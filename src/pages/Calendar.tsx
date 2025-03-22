import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Calendar: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Agenda
        </Typography>
        {/* Adicione aqui o conteúdo do calendário */}
      </Paper>
    </Container>
  );
};

export default Calendar; 