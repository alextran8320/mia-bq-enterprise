import { apiClient } from "@/shared/auth/apiClient";

export type CustomerEntry = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  source: string | null;
  consentGiven: boolean;
  gender: string | null;
  birthday: string | null;
  region: string | null;
  preferredChannel: string | null;
  preferredStore: string | null;
  tags: string[];
  totalSpent: number;
  orderCount: number;
  assigneeId: string | null;
  assigneeEmail: string | null;
  lastContactAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerListFilters = {
  q?: string;
  status?: string;
  source?: string;
  assigneeId?: string;
  page?: number;
  pageSize?: number;
};

export type CustomerListResponse = {
  items: CustomerEntry[];
  total: number;
  page: number;
  pageSize: number;
};

export type CustomerInput = {
  name: string;
  phone?: string | null;
  email?: string | null;
  status?: string;
  source?: string | null;
  consentGiven?: boolean;
  gender?: string | null;
  birthday?: string | null;
  region?: string | null;
  preferredChannel?: string | null;
  preferredStore?: string | null;
  tags?: string[];
  assigneeId?: string | null;
};

export const customerApi = {
  async list(filters: CustomerListFilters = {}): Promise<CustomerListResponse> {
    const { data } = await apiClient.get<CustomerListResponse>("/customers", {
      params: filters,
    });
    return data;
  },
  async get(id: string): Promise<CustomerEntry> {
    const { data } = await apiClient.get<{ customer: CustomerEntry }>(
      `/customers/${id}`,
    );
    return data.customer;
  },
  async create(input: CustomerInput): Promise<CustomerEntry> {
    const { data } = await apiClient.post<{ customer: CustomerEntry }>(
      "/customers",
      input,
    );
    return data.customer;
  },
  async patch(
    id: string,
    patch: Partial<CustomerInput>,
  ): Promise<CustomerEntry> {
    const { data } = await apiClient.patch<{ customer: CustomerEntry }>(
      `/customers/${id}`,
      patch,
    );
    return data.customer;
  },
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },
};
