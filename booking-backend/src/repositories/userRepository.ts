import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Repository } from "typeorm";

export const userRepository: Repository<User> = AppDataSource.getRepository(User);
