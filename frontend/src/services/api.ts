import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  id: number;
  name: string;
}

export interface UsersResponse {
  data: User[];
  page: number;
  limit: number;
  total?: number;
  hasMore: boolean;
}

export interface CountResponse {
  total: number;
}

export interface AlphabetIndex {
  [letter: string]: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchUsers = async (page: number, limit: number = 500): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>('/users', {
    params: { page, limit },
  });
  return response.data;
};

export const fetchAlphabetIndex = async (): Promise<AlphabetIndex> => {
  const response = await api.get<AlphabetIndex>('/users/index');
  return response.data;
};

export const fetchUsersByLetter = async (letter: string, limit: number = 500): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>(`/users/letter/${letter}`, {
    params: { limit },
  });
  return response.data;
};

export const fetchTotalCount = async (): Promise<number> => {
  const response = await api.get<CountResponse>('/users/count');
  return response.data.total;
};