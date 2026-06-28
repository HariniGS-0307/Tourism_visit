import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

export type LocalAuthRole = "USER" | "OPERATOR" | "ADMIN";

export interface LocalAuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: LocalAuthRole;
  passwordHash: string | null;
}

interface LocalAuthStore {
  users: LocalAuthUser[];
}

const storePath = path.join(process.cwd(), ".data", "auth-users.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function ensureStoreDir() {
  await mkdir(path.dirname(storePath), { recursive: true });
}

async function buildSeedUsers() {
  const passwordHash = await bcrypt.hash("123456", 10);

  return [
    {
      id: randomUUID(),
      name: "Admin User",
      email: "admin@maharashtra-adventures.com",
      image: null,
      role: "ADMIN" as const,
      passwordHash,
    },
    {
      id: randomUUID(),
      name: "Harini",
      email: "sharini822@gmail.com",
      image: null,
      role: "USER" as const,
      passwordHash,
    },
    {
      id: randomUUID(),
      name: "Amohammed Ali",
      email: "amohammedali2005@gmail.com",
      image: null,
      role: "USER" as const,
      passwordHash,
    },
    {
      id: randomUUID(),
      name: "Operator 1",
      email: "operator1@example.com",
      image: null,
      role: "OPERATOR" as const,
      passwordHash,
    },
  ];
}

async function readStore(): Promise<LocalAuthStore> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as LocalAuthStore;
    if (!parsed || !Array.isArray(parsed.users)) {
      throw new Error("Invalid auth store");
    }
    return parsed;
  } catch {
    return { users: await buildSeedUsers() };
  }
}

async function writeStore(store: LocalAuthStore) {
  await ensureStoreDir();
  await writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

async function ensureSeedUsers(store: LocalAuthStore) {
  const seedUsers = await buildSeedUsers();
  const existingEmails = new Set(store.users.map((user) => normalizeEmail(user.email)));
  let changed = false;

  for (const seedUser of seedUsers) {
    const normalizedEmail = normalizeEmail(seedUser.email);
    if (!existingEmails.has(normalizedEmail)) {
      store.users.push(seedUser);
      changed = true;
    }
  }

  if (changed) {
    await writeStore(store);
  }
}

export async function findLocalAuthUserByEmail(email: string) {
  const store = await readStore();
  await ensureSeedUsers(store);
  const normalizedEmail = normalizeEmail(email);
  return store.users.find((user) => normalizeEmail(user.email) === normalizedEmail) ?? null;
}

export async function upsertLocalAuthUser(user: Omit<LocalAuthUser, "id"> & { id?: string }) {
  const store = await readStore();
  const normalizedEmail = normalizeEmail(user.email);
  const index = store.users.findIndex((entry) => normalizeEmail(entry.email) === normalizedEmail);
  const nextUser: LocalAuthUser = {
    id: user.id ?? randomUUID(),
    name: user.name,
    email: normalizedEmail,
    image: user.image,
    role: user.role,
    passwordHash: user.passwordHash,
  };

  if (index >= 0) {
    store.users[index] = nextUser;
  } else {
    store.users.push(nextUser);
  }

  await ensureSeedUsers(store);
  await writeStore(store);
  return nextUser;
}

export async function verifyLocalAuthPassword(email: string, password: string) {
  const user = await findLocalAuthUserByEmail(email);
  if (!user?.passwordHash) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  return passwordMatches ? user : null;
}
