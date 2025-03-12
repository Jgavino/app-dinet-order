export interface LoginRequest {
  username: string;
  password: string;
  ipAddress: string;
}

export interface LoginResponse {
  token: string;
  session: string;
}
