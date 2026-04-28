"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

// ============================================================
// Types
// ============================================================

interface ActionResult {
  success: boolean;
  error?: string;
}

// ============================================================
// Register (First Time Setup)
// ============================================================

interface RegisterInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput): Promise<ActionResult> {
  try {
    // Cek apakah sudah ada user
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return { success: false, error: "Setup awal sudah dilakukan." };
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: "Superadmin",
        email: input.email,
        password: hashedPassword,
      },
    });

    await createSession({ userId: user.id, email: user.email });
  } catch (error) {
    console.error("register error:", error);
    return { success: false, error: "Gagal membuat akun." };
  }

  redirect("/dashboard");
}

// ============================================================
// Login
// ============================================================

interface LoginInput {
  email: string;
  password: string;
}

export async function login(input: LoginInput): Promise<ActionResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || user.deletedAt) {
      return { success: false, error: "Email atau password salah." };
    }

    const isValid = await verifyPassword(input.password, user.password);
    if (!isValid) {
      return { success: false, error: "Email atau password salah." };
    }

    await createSession({ userId: user.id, email: user.email });
  } catch (error) {
    console.error("login error:", error);
    return { success: false, error: "Gagal masuk. Coba lagi." };
  }

  redirect("/dashboard");
}

// ============================================================
// Logout
// ============================================================

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
