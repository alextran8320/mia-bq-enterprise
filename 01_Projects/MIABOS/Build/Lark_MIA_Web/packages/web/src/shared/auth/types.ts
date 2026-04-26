export type AuthedUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  permissions: string[];
  isActive: boolean;
};

export type LarkProfile = {
  openId: string;
  unionId?: string;
  tenantKey?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
};

export type LoginResponse = { token: string; user: AuthedUser };

export type LarkExchangeResponse =
  | LoginResponse
  | { needsBinding: true; larkProfile: LarkProfile };

export type BindResponse = {
  token: string;
  user: AuthedUser;
  linkedAt: string;
};

export type ServerConfig = {
  larkAppId: string;
  larkAutoProvision: boolean;
};
