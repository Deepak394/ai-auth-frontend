export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface FieldError {
  field: string;
  message: string;
}
    
export interface ApiErrorBody {
    success: boolean;
  status: 'error';
  message: string;
  errors?: FieldError[];
}