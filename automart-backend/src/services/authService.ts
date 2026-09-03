import prisma from '../config/db.js';
import { RegisterInput, LoginInput } from '../schemas/authSchema.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { Role } from '@prisma/client';

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existingUser) {
      throw AppError.conflict('An account with this email address already exists.');
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase(),
        password: hashedPassword,
        role: (input.role as Role) || Role.BUYER,
        phone: input.phone,
        companyName: input.companyName,
        city: input.city,
        state: input.state,
        isVerifiedDealer: input.role === 'DEALER' ? false : false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        companyName: true,
        isVerifiedDealer: true,
        createdAt: true,
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { user, token };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw AppError.unauthorized('Invalid email or password credentials.');
    }

    const isMatch = await comparePassword(input.password, user.password);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password credentials.');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      companyName: user.companyName,
      isVerifiedDealer: user.isVerifiedDealer,
      createdAt: user.createdAt,
    };

    return { user: userProfile, token };
  }

  static async getCurrentUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        companyName: true,
        isVerifiedDealer: true,
        city: true,
        state: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound('User profile not found.');
    }

    return user;
  }
}

export default AuthService;
