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

export interface DepartmentUpdate {
  name?: string;
  description?: string | null; 
}

export interface DepartmentResponse {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentRepository {
  create(data: DepartmentCreate): Promise<Department>;
  addUserToDepartment(id: string, departmentId: string): Promise<void>
}