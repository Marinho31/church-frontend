import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface PasswordStrengthProps {
  password: string;
}

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  // Comprimento mínimo
  if (password.length >= 8) strength += 20;
  
  // Contém números
  if (/\d/.test(password)) strength += 20;
  
  // Contém letras minúsculas
  if (/[a-z]/.test(password)) strength += 20;
  
  // Contém letras maiúsculas
  if (/[A-Z]/.test(password)) strength += 20;
  
  // Contém caracteres especiais
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
  
  return strength;
};

const getStrengthColor = (strength: number): string => {
  if (strength < 40) return '#f44336'; // Vermelho
  if (strength < 60) return '#ff9800'; // Laranja
  if (strength < 80) return '#ffc107'; // Amarelo
  return '#4caf50'; // Verde
};

const getStrengthLabel = (strength: number): string => {
  if (strength < 40) return 'Fraca';
  if (strength < 60) return 'Média';
  if (strength < 80) return 'Boa';
  return 'Forte';
};

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = calculatePasswordStrength(password);
  const color = getStrengthColor(strength);
  const label = getStrengthLabel(strength);

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: color,
          mt: 0.5,
          display: 'block',
          textAlign: 'right',
        }}
      >
        Força da senha: {label}
      </Typography>
    </Box>
  );
};

export default PasswordStrength; 