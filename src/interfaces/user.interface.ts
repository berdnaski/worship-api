import type { Department } from "@prisma/client";
import type { DepartmentResponse } from "./department.interface";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'ADMIN' | 'LEADER' | 'MEMBER';
  avatarUrl?: string | null; 
  initialSetupCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  departmentId?: string | null; 
}

export interface UserCreate {
  email: string;
  name: string;
  passwordHash: string;
  role?: "ADMIN" | "LEADER" | "MEMBER"; 
  departmentId?: string;
  avatarUrl?: string | null; 
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null; 
  role: 'ADMIN' | 'LEADER' | 'MEMBER';
  createdAt: Date;
  updatedAt: Date;
  initialSetupCompleted: boolean; 
  department?: string;
}


export interface UserUpdate {
  name?: string;
  email?: string;
  role?: "ADMIN" | "LEADER" | "MEMBER";
  departmentId?: string;
  initialSetupCompleted?: boolean;
  avatarUrl?: string | null; 
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRepository {
  create(data: UserCreate): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UserUpdate): Promise<User | null>;
  findAll(): Promise<UserResponse[]>;
  delete(id: string): Promise<void>;
  addUserToDepartment(id: string, departmentId: string): Promise<void>
  findDepartmentsByUserId(userId: string): Promise<DepartmentResponse[]>
}
