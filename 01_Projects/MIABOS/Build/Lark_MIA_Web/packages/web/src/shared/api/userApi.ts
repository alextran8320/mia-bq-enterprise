import { apiClient } from "@/shared/auth/apiClient";

export type UserSummary = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isActive: boolean;
  hasLarkBinding: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserListFilters = {
  q?: string;
  role?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
};

export type UserListResponse = {
  items: UserSummary[];
  total: number;
  page: number;
  pageSize: number;
};

export type PatchUserInput = {
  fullName?: string | null;
  role?: string;
  isActive?: boolean;
};

export const userApi = {
  async list(filters: UserListFilters = {}): Promise<UserListResponse> {
    const { data } = await apiClient.get<UserListResponse>("/users", {
      params: filters,
    });
    return data;
  },
  async get(id: string): Promise<UserSummary> {
    const { data } = await apiClient.get<{ user: UserSummary }>(`/users/${id}`);
    return data.user;
  },
  async patch(id: string, patch: PatchUserInput): Promise<UserSummary> {
    const { data } = await apiClient.patch<{ user: UserSummary }>(
      `/users/${id}`,
      patch,
    );
    return data.user;
  },
};
