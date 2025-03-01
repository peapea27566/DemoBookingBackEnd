import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { JwtService } from "../services/jwtService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
const userRepository = AppDataSource.getRepository(User);

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, tel } = req.body;
      if (!name || !email || !password || !tel) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters long" });
      }

      const telRegex = /^\+?\d{10,15}$/;
      if (!telRegex.test(tel)) {
        return res.status(400).json({ error: "Invalid telephone format" });
      }

      const existingUser = await userRepository.findOne({
        where: [{ tel }, { email }],
      });
      
      if (existingUser) {
        return res.status(400).json({
          error: existingUser.tel === tel
            ? "Tel already exists"
            : "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password", hashedPassword);
      const user = userRepository.create({
        name,
        email,
        tel,
        password: hashedPassword,
      });
      await userRepository.save(user);

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: error });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = JwtService.generateToken(user);

      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async userInfo(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId;
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
