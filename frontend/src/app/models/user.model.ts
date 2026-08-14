export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface UserSignUp {
  email: string;
  password: string;
  full_name?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}
