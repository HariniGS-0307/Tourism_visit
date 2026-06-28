import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { RegisterInput, OperatorRegisterInput } from "@/lib/validators";
import {
  findLocalAuthUserByEmail,
  upsertLocalAuthUser,
  verifyLocalAuthPassword,
} from "@/server/services/local-auth-store";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isDatabaseConnectionError(error: unknown) {
  return (
    error instanceof Error &&
    /TLS connection|security package|connect ECONN|server closed the connection|timed out/i.test(
      error.message
    )
  );
}

async function passwordMatches(plainTextPassword: string, storedPassword: string) {
  return bcrypt.compare(plainTextPassword, storedPassword);
}

async function findLocalUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  try {
    const localUser = await findLocalUserByEmail(normalizedEmail);

    if (localUser?.password) {
      const passwordIsValid = await passwordMatches(password, localUser.password);
      if (passwordIsValid) {
        return {
          id: localUser.id,
          name: localUser.name,
          email: localUser.email,
          image: localUser.image,
          role: localUser.role,
        };
      }
    }
  } catch {
    const fallbackUser = await verifyLocalAuthPassword(normalizedEmail, password);
    if (fallbackUser) {
      return fallbackUser;
    }
    return null;
  }

  const fallbackUser = await verifyLocalAuthPassword(normalizedEmail, password);
  if (fallbackUser) {
    return fallbackUser;
  }

  return null;
}

export async function registerUser(data: RegisterInput) {
  const email = normalizeEmail(data.email);
  const hashedPassword = await bcrypt.hash(data.password, 10);

  let existingLocalUser = null;
  let localLookupFailed = false;
  try {
    existingLocalUser = await findLocalUserByEmail(email);
  } catch {
    localLookupFailed = true;
  }

  if (existingLocalUser) {
    throw new Error("User with this email already exists");
  }

  if (!localLookupFailed) {
    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });
    } catch (error) {
      if (!isDatabaseConnectionError(error)) {
        throw error;
      }
    }
  }

  const existingFallbackUser = await findLocalAuthUserByEmail(email);
  if (existingFallbackUser) {
    throw new Error("User with this email already exists");
  }

  return upsertLocalAuthUser({
    name: data.name,
    email,
    image: null,
    role: "USER",
    passwordHash: hashedPassword,
  });
}

export async function registerOperator(data: OperatorRegisterInput) {
  const email = normalizeEmail(data.email);
  const hashedPassword = await bcrypt.hash(data.password, 10);

  let existingLocalUser = null;
  let localLookupFailed = false;
  try {
    existingLocalUser = await findLocalUserByEmail(email);
  } catch {
    localLookupFailed = true;
  }

  if (existingLocalUser) {
    throw new Error("User with this email already exists");
  }

  if (!localLookupFailed) {
    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email,
          password: hashedPassword,
          role: "OPERATOR",
          operatorProfile: {
            create: {
              businessName: data.businessName,
              phone: data.phone,
              description: data.description,
              verificationDocs: [data.verificationDocUrl],
              isVerified: false,
            },
          },
        },
      });
    } catch (error) {
      if (!isDatabaseConnectionError(error)) {
        throw error;
      }
    }
  }

  const existingFallbackUser = await findLocalAuthUserByEmail(email);
  if (existingFallbackUser) {
    throw new Error("User with this email already exists");
  }

  return upsertLocalAuthUser({
    name: data.name,
    email,
    image: null,
    role: "OPERATOR",
    passwordHash: hashedPassword,
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    },
  });
}

export async function getNotifications(userId: string, onlyUnread = false) {
  return prisma.notification.findMany({
    where: { userId, ...(onlyUnread ? { isRead: false } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
