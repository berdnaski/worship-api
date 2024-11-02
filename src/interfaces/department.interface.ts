import type { UserResponse } from "./user.interface";

export interface Department {
  id: string;
  name: string;
  description?: string | null; 
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentCreate {
  name: string;
  description?: string | null; 
}

export interface DepartmentResponse {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  users?: UserResponse[];
}

export interface DepartmentUpdate {
  name?: string;
  description?: string | null;
}

export interface DepartmentRepository {
  create(data: DepartmentCreate): Promise<Department>;
  update(id: string, data: DepartmentUpdate): Promise<Department | null>
  findById(id: string): Promise<DepartmentResponse | null>
  findAll(): Promise<DepartmentResponse[]>
  delete(departmentId: string): Promise<void>
  addUser(departmentId: string, id: string): Promise<void>
  removeUser(departmentId: string, id: string): Promise<void>
}