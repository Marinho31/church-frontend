export const environment = {
  production: false,
  apiUrl: '/api', // Using Vite proxy
  apiVersion: 'v1',
};

export const getApiUrl = (endpoint: string): string => {
  return `${environment.apiUrl}/${endpoint}`;
}; 