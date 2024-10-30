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

export interface DepartmentUpdate {
  name?: string;
  description?: string | null;
}

export interface DepartmentRepository {
  create(data: DepartmentCreate): Promise<Department>;
  update(id: string, data: DepartmentUpdate): Promise<Department | null>
  findById(id: string): Promise<Department | null>
}