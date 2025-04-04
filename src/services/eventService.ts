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
}

class EventService {
  async create(event: Omit<Event, 'id' | 'active'>) {
    const response = await api.post<Event>('/event', event);
    return response.data;
  }

  async getAll(filters?: EventFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get<Event[]>(`/event?${params.toString()}`);
    return response.data;
  }

  async getById(id: number) {
    const response = await api.get<Event>(`/event/${id}`);
    return response.data;
  }

  async update(id: number, event: Partial<Omit<Event, 'id' | 'active' | 'churchId'>>) {
    const response = await api.patch<Event>(`/event/${id}`, event);
    return response.data;
  }

  async delete(id: number) {
    await api.delete(`/event/${id}`);
  }
}

export const eventService = new EventService(); 