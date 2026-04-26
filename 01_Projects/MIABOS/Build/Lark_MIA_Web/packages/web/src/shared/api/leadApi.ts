import { apiClient } from "@/shared/auth/apiClient";

export type LeadEntry = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
  status: string;
  score: number;
  note: string | null;
  assigneeId: string | null;
  assigneeEmail: string | null;
  convertedCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadListFilters = {
  q?: string;
  status?: string;
  source?: string;
  assigneeId?: string;
  page?: number;
  pageSize?: number;
};

export type LeadListResponse = {
  items: LeadEntry[];
  total: number;
  page: number;
  pageSize: number;
};

export type LeadInput = {
  name: string;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
  status?: string;
  score?: number;
  note?: string | null;
  assigneeId?: string | null;
};

export const leadApi = {
  async list(filters: LeadListFilters = {}): Promise<LeadListResponse> {
    const { data } = await apiClient.get<LeadListResponse>("/leads", {
      params: filters,
    });
    return data;
  },
  async get(id: string): Promise<LeadEntry> {
    const { data } = await apiClient.get<{ lead: LeadEntry }>(`/leads/${id}`);
    return data.lead;
  },
  async create(input: LeadInput): Promise<LeadEntry> {
    const { data } = await apiClient.post<{ lead: LeadEntry }>("/leads", input);
    return data.lead;
  },
  async patch(id: string, patch: Partial<LeadInput>): Promise<LeadEntry> {
    const { data } = await apiClient.patch<{ lead: LeadEntry }>(
      `/leads/${id}`,
      patch,
    );
    return data.lead;
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/leads/${id}`);
  },
};
