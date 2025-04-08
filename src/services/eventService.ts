import axios from 'axios';

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

const api = axios.create({
  baseURL: '/event',
});

export const eventService = {
  async getAll(filters?: EventFilters) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.get('/', { headers, params: filters });
    return response;
  },

  async create(data: Omit<Event, 'id'>) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.post('/', data, { headers });
    return response;
  },

  async update(id: number, data: Partial<Event>) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.put(`/${id}`, data, { headers });
    return response;
  },

  async delete(id: number) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await api.delete(`/${id}`, { headers });
    return response;
  },
};