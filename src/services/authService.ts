import api from './api';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  active: boolean;
  churchId: number | null;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const MAX_LOGIN_ATTEMPTS = 50;
const LOCKOUT_TIME = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

const getLoginAttempts = (email: string): { attempts: number; timestamp: number } => {
  const attemptsStr = localStorage.getItem(`loginAttempts_${email}`);
  return attemptsStr ? JSON.parse(attemptsStr) : { attempts: 0, timestamp: 0 };
};

const setLoginAttempts = (email: string, attempts: number) => {
  localStorage.setItem(
    `loginAttempts_${email}`,
    JSON.stringify({ attempts, timestamp: Date.now() })
  );
};

const clearLoginAttempts = (email: string) => {
  localStorage.removeItem(`loginAttempts_${email}`);
};

const isAccountLocked = (email: string): boolean => {
  const { attempts, timestamp } = getLoginAttempts(email);
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const timeElapsed = Date.now() - timestamp;
    if (timeElapsed < LOCKOUT_TIME) {
      return true;
    }
    clearLoginAttempts(email);
  }
  return false;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      // Verificar se a conta está bloqueada
      if (isAccountLocked(credentials.email)) {
        const minutesLeft = Math.ceil((LOCKOUT_TIME - (Date.now() - getLoginAttempts(credentials.email).timestamp)) / 60000);
        throw new Error(`Conta temporariamente bloqueada. Tente novamente em ${minutesLeft} minutos.`);
      }

      // Enviar requisição de login
      const response = await api.post<LoginResponse>('/authentication/log-in', {
        email: credentials.email,
        password: credentials.password
      });

      // Limpar tentativas em caso de sucesso
      clearLoginAttempts(credentials.email);

      // Salvar token e usuário no localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data.user;
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      
      // Incrementar contador de tentativas apenas se o erro não for de conexão
      if (error.response) {
        const { attempts } = getLoginAttempts(credentials.email);
        setLoginAttempts(credentials.email, attempts + 1);

        if (attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
          throw new Error('Número máximo de tentativas excedido. Conta temporariamente bloqueada.');
        }

        // Mensagens de erro mais específicas
        if (error.response.status === 401) {
          throw new Error('Email ou senha incorretos.');
        } else if (error.response.status === 403) {
          throw new Error('Acesso não autorizado.');
        }

        throw new Error(
          error.response.data.message || 
          'Erro ao fazer login. Por favor, tente novamente.'
        );
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
      }
      
      throw new Error('Erro ao fazer login. Por favor, tente novamente.');
    }
  },

  logout: async () => {
    try {
      await api.post('/api/authentication/log-out');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getRemainingAttempts: (email: string): number => {
    const { attempts } = getLoginAttempts(email);
    return Math.max(0, MAX_LOGIN_ATTEMPTS - attempts);
  },

  getLockoutTimeRemaining: (email: string): number => {
    const { timestamp } = getLoginAttempts(email);
    return Math.max(0, LOCKOUT_TIME - (Date.now() - timestamp));
  }
}; 