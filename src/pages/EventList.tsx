import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { eventService, Event } from '../services/eventService';

// Dados mockados para visualização inicial
const mockEvents: Event[] = [
  {
    id: 1,
    name: 'Culto de Domingo',
    description: 'Culto dominical com Santa Ceia',
    date: '2024-03-24T09:00:00.000Z',
    churchId: 1,
    active: true
  },
  {
    id: 2,
    name: 'Escola Bíblica',
    description: 'Aulas para todas as idades',
    date: '2024-03-24T08:00:00.000Z',
    churchId: 1,
    active: true
  },
  {
    id: 3,
    name: 'Culto de Oração',
    description: 'Momento especial de intercessão',
    date: '2024-03-26T19:30:00.000Z',
    churchId: 1,
    active: true
  },
  {
    id: 4,
    name: 'Ensaio do Coral',
    description: 'Preparação para apresentação especial',
    date: '2024-03-27T20:00:00.000Z',
    churchId: 1,
    active: true
  },
  {
    id: 5,
    name: 'Vigília',
    description: 'Noite de oração e adoração',
    date: '2024-03-29T23:00:00.000Z',
    churchId: 1,
    active: true
  }
];

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      // Usando dados mockados em vez de chamar a API
      setEvents(mockEvents);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar eventos');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenDialog = (event?: Event) => {
    if (event) {
      setSelectedEvent(event);
      setFormData({
        name: event.name,
        description: event.description,
        date: event.date.split('T')[0],
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        name: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setFormData({
      name: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        churchId: 1, // TODO: Pegar da igreja do usuário logado
      };

      if (selectedEvent) {
        await eventService.update(selectedEvent.id, eventData);
      } else {
        await eventService.create(eventData);
      }

      handleCloseDialog();
      loadEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        setLoading(true);
        setError(null);
        await eventService.delete(id);
        loadEvents();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao excluir evento');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Agenda
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Evento
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      {formatDate(event.date)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpenDialog(event)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(event.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Data"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default EventList; 