import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Moon } from 'lucide-react';
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
      <Button
        onClick={() => setHighContrast(!highContrast)}
        className="fixed top-4 right-4"
        variant="outline"
        size="icon"
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </Button>

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
          <div className="mb-6 rounded-md bg-destructive/15 p-4 text-sm text-destructive" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className={highContrast ? 'text-white' : ''}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${highContrast 
                ? 'bg-gray-900 text-white border-2 border-white focus:border-blue-400' 
                : ''
              }`}
              placeholder="Digite seu email"
              required
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="password" 
              className={highContrast ? 'text-white' : ''}
            >
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${highContrast 
                  ? 'bg-gray-900 text-white border-2 border-white focus:border-blue-400' 
                  : ''
                }`}
                placeholder="Digite sua senha"
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {password && (
            <div className={`p-4 rounded-xl ${highContrast ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    password.length >= 8 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min((password.length / 8) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className={`mt-2 text-sm ${highContrast ? 'text-white' : 'text-gray-600'}`}>
                {password.length < 8
                  ? 'A senha deve ter pelo menos 8 caracteres'
                  : 'Senha forte'}
              </p>
            </div>
          )}

          {email && remainingAttempts < 3 && (
            <p
              className={`text-center font-medium ${
                highContrast ? 'text-red-400' : 'text-yellow-600'
              }`}
              role="alert"
            >
              Tentativas restantes: {remainingAttempts}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || remainingAttempts === 0}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login; 