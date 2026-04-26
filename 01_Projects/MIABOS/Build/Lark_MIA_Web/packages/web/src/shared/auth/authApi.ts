import { apiClient } from "./apiClient";
import type {
  AuthedUser,
  BindResponse,
  LarkExchangeResponse,
  LarkProfile,
  LoginResponse,
  ServerConfig,
} from "./types";

export const authApi = {
  async getConfig(): Promise<ServerConfig> {
    const { data } = await apiClient.get<ServerConfig>("/config");
    return data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  async me(): Promise<AuthedUser> {
    const { data } = await apiClient.get<{ user: AuthedUser }>("/auth/me");
    return data.user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Logout is best-effort — local state is the source of truth.
    }
  },

  async larkExchange(code: string): Promise<LarkExchangeResponse> {
    const { data } = await apiClient.post<LarkExchangeResponse>(
      "/auth/lark/exchange",
      { code },
    );
    return data;
  },

  async bind(profile: LarkProfile): Promise<BindResponse> {
    const { data } = await apiClient.post<BindResponse>("/auth/bind", {
      larkProfile: profile,
    });
    return data;
  },
};
