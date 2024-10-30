export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'ADMIN' | 'LEADER' | 'MEMBER';
  initialSetupCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  email: string;
  name: string;
  passwordHash: string;
  role?: "ADMIN" | "LEADER" | "MEMBER"; 
  departmentId?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'LEADER' | 'MEMBER';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  role?: "ADMIN" | "LEADER" | "MEMBER";
  departmentId?: string;
  initialSetupCompleted?: boolean;
}

export interface UserRepository {
  create(data: UserCreate): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UserUpdate): Promise<User | null>
}
