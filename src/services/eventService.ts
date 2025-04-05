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
    const headers = await this.getHeaders();
    console.log('Debug - Creating event with headers:', headers);
    
    const response = await fetch(`${this.baseUrl}/event`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Debug - Error response:', errorText);
      throw new Error(`Failed to create event: ${errorText}`);
    }

    return response.json();
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

    const headers = await this.getHeaders();
    console.log('Debug - Getting all events with headers:', headers);

    const response = await fetch(`${this.baseUrl}/event?${params.toString()}`, {
      method: 'GET',
      headers
    });
    
   

    console.log('Debug - Response status:', response.status);
    console.log('Debug - Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Debug - Error response:', errorText);
      throw new Error(`Failed to fetch events: ${errorText}`);
    }

    return response.json();
  }

  async getById(id: number) {
    const response = await fetch(`${this.baseUrl}/event/${id}`, {
      method: 'GET',
      headers: await this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }

    return response.json();
  }
  

  async update(id: number, event: Partial<Omit<Event, 'id' | 'active' | 'churchId'>>) {
    const response = await fetch(`${this.baseUrl}/event/${id}`, {
      method: 'PATCH',
      headers: await this.getHeaders(),
      body: JSON.stringify(event)
    });

    if (!response.ok) {
      throw new Error('Failed to update event');
    }

    return response.json();
  }

  async delete(id: number) {
    const response = await fetch(`${this.baseUrl}/event/${id}`, {
      method: 'DELETE',
      headers: await this.getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  }
}

export const eventService = new EventService();