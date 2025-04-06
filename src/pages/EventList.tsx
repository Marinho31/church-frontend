import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { eventService, Event } from '../services/eventService';

const EventList = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Estado para filtros de data
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  // Função para carregar todos os eventos sem filtros
  const loadAllEvents = async () => {
    try {
      console.log('Loading all events...'); // Debug log
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login...'); // Debug log
        navigate('/login', { replace: true });
        return;
      }

      setLoading(true);
      setError(null);
      
      const response = await eventService.getAll();
      console.log('All events loaded:', response); // Debug log
      
      // Corrige o acesso aos dados da resposta
      if (response && response.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.error('Error loading events:', err);
      setError(err.message || 'Erro ao carregar eventos');
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar eventos com filtros de data
  const loadFilteredEvents = async () => {
    try {
      console.log('Loading filtered events...'); // Debug log
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login...'); // Debug log
        navigate('/login', { replace: true });
        return;
      }

      setLoading(true);
      setError(null);
      
      // Verifica se as datas foram preenchidas
      if (!filters.startDate || !filters.endDate) {
        setError('Por favor, selecione as datas inicial e final para filtrar');
        setLoading(false);
        return;
      }
      
      // Converte as datas para o formato esperado pela API
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      // Ajusta as horas para início e fim do dia
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const apiFilters = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      
      console.log('Debug - Sending filters:', apiFilters); // Debug log
      
      const response = await eventService.getAll(apiFilters);
      console.log('Filtered events loaded:', response); // Debug log
      
      // Corrige o acesso aos dados da resposta
      if (response && response.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.error('Error loading filtered events:', err);
      setError(err.message || 'Erro ao carregar eventos filtrados');
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  // Carrega todos os eventos ao montar o componente
  useEffect(() => {
    console.log('EventList mounted or location changed'); // Debug log
    loadAllEvents();
  }, [location.pathname]);

  const handleFilterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSearch = () => {
    loadFilteredEvents();
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
    });
    loadAllEvents();
  };

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

      // Create date object and adjust for timezone
      const date = new Date(formData.date);
      const timezoneOffset = date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() + timezoneOffset);
      date.setHours(15, 0, 0, 0); // Set to 3 PM UTC

      const eventData = {
        ...formData,
        date: date.toISOString(),
        churchId: 1, // TODO: Pegar da igreja do usuário logado
      };

      if (selectedEvent) {
        await eventService.update(selectedEvent.id, eventData);
      } else {
        await eventService.create(eventData);
      }

      handleCloseDialog();
      loadAllEvents(); // Recarrega a lista após criar/atualizar
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar evento');
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
        loadAllEvents(); // Recarrega a lista após deletar
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir evento');
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

        {/* Filtros de data */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Data Inicial"
                value={filters.startDate}
                onChange={handleFilterChange('startDate')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Data Final"
                value={filters.endDate}
                onChange={handleFilterChange('endDate')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                >
                  Limpar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

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
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(event)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(event.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={4}
                required
              />
              <TextField
                fullWidth
                type="date"
                label="Data"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                margin="normal"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Salvar'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default EventList;   