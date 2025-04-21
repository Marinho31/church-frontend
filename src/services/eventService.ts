import api from './api';

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  churchId: number;
}

export interface EventFilters {
  startDate?: string;
  endDate?: string;
}

export const eventService = {
  async getAll(filters?: EventFilters) {
    const response = await api.get('/event', { params: filters });
    return response;
  },

  async create(data: Omit<Event, 'id'>) {
    const response = await api.post('/event', data);
    return response;
  },

  async update(id: number, data: Partial<Event>) {
    const response = await api.patch(`/event/${id}`, data);
    return response;
  },

  async delete(id: number) {
    const response = await api.delete(`/event/${id}`);
    return response;
  },
};