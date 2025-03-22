import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, CircularProgress, Typography, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import PasswordStrength from '../components/PasswordStrength';
import { authService } from '../services/authService';

// Validação de senha
const validatePassword = (password: string): boolean => {
  // Mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula e um número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Função para lidar com alto contraste - inicializado como false
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (email) {
      setRemainingAttempts(authService.getRemainingAttempts(email));
    }
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('A senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      setPassword('');
      navigate('/menu');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setError(error.message);
      setRemainingAttempts(authService.getRemainingAttempts(email));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      highContrast ? 'bg-black' : 'bg-gradient-to-b from-blue-50 to-white'
    }`}>
      {/* Botão de Acessibilidade */}
      <button
        onClick={() => setHighContrast(!highContrast)}
        className="fixed top-4 right-4 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        aria-label="Alternar alto contraste"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>

      <div className={`w-full max-w-[440px] ${highContrast ? 'bg-black' : 'bg-white'} rounded-2xl shadow-2xl p-8 transition-all duration-300`}>
        <div className="text-center mb-8">
          <h1 
            className={`text-4xl font-bold mb-3 ${highContrast ? 'text-white' : 'text-gray-800'}`}
            tabIndex={0}
          >
            BEM VINDO
          </h1>
          <p 
            className={`text-lg ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}
            tabIndex={0}
          >
            Entre com suas credenciais
          </p>
        </div>

        {error && (
          <Alert 
            severity="error" 
            className="mb-6"
            role="alert"
            sx={{
              borderRadius: '12px',
              '& .MuiAlert-icon': { color: '#ef4444' }
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className={`block text-base font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-base transition-all duration-300
                  ${highContrast 
                    ? 'bg-gray-900 text-white border-2 border-white focus:border-blue-400' 
                    : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-blue-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-200`}
                placeholder="Digite seu email"
                required
                disabled={loading}
                autoComplete="off"
                aria-label="Email"
                aria-required="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className={`block text-base font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-xl text-base transition-all duration-300
                  ${highContrast 
                    ? 'bg-gray-900 text-white border-2 border-white focus:border-blue-400' 
                    : 'bg-gray-50 text-gray-900 border border-gray-200 focus:border-blue-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-200`}
                placeholder="Digite sua senha"
                required
                disabled={loading}
                autoComplete="new-password"
                aria-label="Senha"
                aria-required="true"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className={highContrast ? 'text-white' : 'text-gray-500'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>
          </div>

          {password && (
            <div className={`p-4 rounded-xl ${highContrast ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <PasswordStrength password={password} />
            </div>
          )}

          {email && remainingAttempts < 3 && (
            <Typography
              variant="body2"
              color={highContrast ? "error" : "warning"}
              className="text-center font-medium"
              role="alert"
            >
              Tentativas restantes: {remainingAttempts}
            </Typography>
          )}

          <button
            type="submit"
            className={`w-full py-4 px-4 rounded-xl text-white text-lg font-semibold transition-all duration-300 mt-6
              ${loading || remainingAttempts === 0
                ? 'opacity-60 cursor-not-allowed'
                : highContrast
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
              focus:outline-none focus:ring-4 focus:ring-blue-300`}
            disabled={loading || remainingAttempts === 0}
            aria-label={loading ? 'Carregando...' : 'Entrar'}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center w-full max-w-[440px]">
        <p className={`text-sm ${highContrast ? 'text-white' : 'text-gray-600'}`}>
          © {new Date().getFullYear()} Maranata. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login; 