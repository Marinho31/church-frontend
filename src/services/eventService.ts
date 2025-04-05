import api from './api';

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  churchId: number;
  active: boolean;
}

interface EventFilters {
  churchId?: number;
  page?: number;
  size?: number;
  name?: string;
  startDate?: string;
  endDate?: string;
}

class EventService {
  private baseUrl = 'http://localhost:3000';

  private async getHeaders() {
    const token = localStorage.getItem('token') 
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Debug - Headers being sent:', headers);
    return headers;
  }

  async create(event: Omit<Event, 'id' | 'active'>) {
    try {
      console.log('Debug - Creating event:', event);
      const response = await api.post('/event', event);
      console.log('Debug - Create response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - Create error:', error);
      throw error;
    }
  }

  async getAll(filters?: EventFilters) {
    try {
      console.log('Debug - Getting all events with filters:', filters);
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            // Formata as datas corretamente
            if (key === 'startDate' || key === 'endDate') {
              // Remove os caracteres de escape da data
              const formattedDate = value.toString().replace(/%3A/g, ':');
              params.append(key, formattedDate);
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      // Só adiciona o ? se houver parâmetros
      const queryString = params.toString();
      const url = queryString ? `/event?${queryString}` : '/event';
      
      console.log('Debug - Request URL:', url); // Log da URL antes da chamada
      const response = await api.get(url);
      console.log('Debug - GetAll response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - GetAll error:', error);
      throw error;
    }
  }

  async getById(id: number) {
    try {
      console.log('Debug - Getting event by id:', id);
      const response = await api.get(`/event/${id}`);
      console.log('Debug - GetById response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - GetById error:', error);
      throw error;
    }
  }
  

  async update(id: number, event: Partial<Omit<Event, 'id' | 'active' | 'churchId'>>) {
    try {
      console.log('Debug - Updating event:', id, event);
      const response = await api.patch(`/event/${id}`, event);
      console.log('Debug - Update response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - Update error:', error);
      throw error;
    }
  }

  async delete(id: number) {
    try {
      console.log('Debug - Deleting event:', id);
      const response = await api.delete(`/event/${id}`);
      console.log('Debug - Delete response:', response);
      return response.data;
    } catch (error) {
      console.error('Debug - Delete error:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();