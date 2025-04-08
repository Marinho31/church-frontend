import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Home } from 'lucide-react';
import { eventService, Event } from '../services/eventService';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      
      // Atualiza para acessar response.data.data que é onde estão os eventos
      if (response?.data?.data) {
        setEvents(response.data.data);
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
      
      if (!filters.startDate || !filters.endDate) {
        setError('Por favor, selecione as datas inicial e final para filtrar');
        setLoading(false);
        return;
      }
      
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      const apiFilters = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      
      console.log('Debug - Sending filters:', apiFilters); // Debug log
      
      const response = await eventService.getAll(apiFilters);
      console.log('Filtered events loaded:', response); // Debug log
      
      // Atualiza para acessar response.data.data que é onde estão os eventos
      if (response?.data?.data) {
        setEvents(response.data.data);
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

  const handleFilterChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'date',
      header: 'Data',
      cell: ({ row }) => formatDate(row.getValue('date')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenDialog(event)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(event.id)}
              className="text-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/menu')}
          >
            <Home className="h-6 w-6" />
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight text-[#333333]">Agenda</h2>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#333333] hover:bg-[#333333]/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Novo Evento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="startDate">Data Inicial</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={handleFilterChange('startDate')}
          />
        </div>
        <div>
          <Label htmlFor="endDate">Data Final</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={handleFilterChange('endDate')}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={handleSearch} className="flex-1 bg-[#333333] hover:bg-[#333333]/90 text-white">
            Buscar
          </Button>
          <Button variant="outline" onClick={handleClearFilters} className="border-[#333333] hover:bg-[#333333] hover:text-white">
            Limpar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={events}
        />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-[#333333] focus:border-[#333333] focus-visible:ring-[#333333] focus:ring-[#333333]"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="flex w-full rounded-md border border-[#333333] bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#333333] focus-visible:ring-offset-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="border-[#333333] focus:border-[#333333] focus-visible:ring-[#333333] focus:ring-[#333333]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleCloseDialog}
                className="border-[#333333] hover:bg-[#333333] hover:text-white"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-[#333333] hover:bg-[#333333]/90 text-white"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventList;   