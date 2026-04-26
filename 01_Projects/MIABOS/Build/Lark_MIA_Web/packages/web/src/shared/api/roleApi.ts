import { apiClient } from "@/shared/auth/apiClient";

export type RoleEntry = {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
};

export type PermissionEntry = {
  id: string;
  code: string;
  label: string | null;
};

export type RolesResponse = {
  roles: RoleEntry[];
  permissions: PermissionEntry[];
};

export const roleApi = {
  async list(): Promise<RolesResponse> {
    const { data } = await apiClient.get<RolesResponse>("/roles");
    return data;
  },
};
