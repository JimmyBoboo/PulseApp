"use server";

import { authService, type User } from "../services/authService";

export async function getCurrentUser(): Promise<User | null> {
  return null;
}

export async function loginAction(
  email: string,
  password: string
): Promise<User | null> {
  return await authService.login(email, password);
}

export async function registerAction(
  name: string,
  email: string,
  password: string,
  age: number
): Promise<User | null> {
  return await authService.register(name, email, password, age);
}

export async function logoutAction(): Promise<void> {
  authService.logout();
}
