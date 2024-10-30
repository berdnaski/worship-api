import type { FastifyInstance } from "fastify";
import type { User, UserCreate, UserLogin, UserRepository, UserResponse, UserUpdate } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";
import bcrypt from "bcrypt";

class UserUseCase {
  private userRepository: UserRepository;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.userRepository = new UserRepositoryPrisma();
    this.fastify = fastify;
  }

  private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async create({ name, email, passwordHash, departmentId, role }: UserCreate): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const verifyIfUserExists = await this.userRepository.findByEmail(email);

    if (verifyIfUserExists) {
      throw new Error("User already exists");
    }

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      departmentId,
      role,
    });

    const token = this.fastify.jwt.sign({
      sub: user.id,
      role: user.role
    });

    return { user: this.sanitizeUser(user), token };
  }

  async login({ email, password }: UserLogin): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = this.fastify.jwt.sign({
      sub: user.id,
      role: user.role
    });

    return { user: this.sanitizeUser(user), token }; 
  }

  async setup(userId: string, role: 'ADMIN' | 'LEADER' | 'MEMBER', code?: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
  
    if (user.initialSetupCompleted) {
      throw new Error("Initial setup already completed");
    }
  
    const MEMBER_CODE = "KEOCI321";
    const LEADER_CODE = "KEO43fvCI123";
  
    let updatedRole: 'ADMIN' | 'LEADER' | 'MEMBER' = role;
  
    if (role === "LEADER" && code !== LEADER_CODE) {
      throw new Error("Invalid code for the specified role");
    } else if (role === "MEMBER" && code !== MEMBER_CODE) {
      throw new Error("Invalid code for the specified role");
    }

    if (code === LEADER_CODE) {
      updatedRole = "LEADER"; 
    } else if (code === MEMBER_CODE) {
      updatedRole = "MEMBER"; 
    }
  
    const userUpdateData: UserUpdate = {
      initialSetupCompleted: true,
      role: updatedRole 
    };
  
    console.log("Updating user with data:", userUpdateData);
    const updatedUser = await this.userRepository.update(userId, userUpdateData);

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }
  
    return this.sanitizeUser(updatedUser);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findByUser(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  async update(id: string, data: UserUpdate): Promise<User | null> {
    const existing_user = await this.userRepository.findById(id);

    if (!existing_user) {
      throw new Error("User not found");
    }

    const update = await this.userRepository.update(id, data);

    return update;
  }

  async delete(id: string, requesterId: string, requesterRole: 'ADMIN' | 'LEADER' | 'MEMBER'): Promise<void> {
    const userToDelete = await this.userRepository.findById(id);
  
    if (!userToDelete) {
      throw new Error("User not found");
    }

    if (requesterRole !== 'ADMIN' && requesterId !== id) {
      throw new Error("Permission denied");
    }
  
    await this.userRepository.delete(id);
  }
  
}

export { UserUseCase };
