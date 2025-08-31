import crypto from 'crypto';
import { Admin } from '@prisma/client';
import prisma from './prisma';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const SALT_LENGTH = 16;
const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export async function hashPassword(password: string, salt?: string): Promise<{ salt: string; hash: string }> {
  const newSalt = salt || crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = await new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, newSalt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
  return { salt: newSalt, hash };
}

export async function verifyPassword(admin: Admin, password: string): Promise<boolean> {
  if (!admin.salt) return false;
  const { hash } = await hashPassword(password, admin.salt);
  return hash === admin.password;
}

export async function createAdmin(email: string, password: string, name?: string) {
  const { salt, hash } = await hashPassword(password);
  return prisma.admin.create({
    data: {
      email,
      name,
      password: hash,
      salt
    }
  });
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const admin = await prisma.admin.findUnique({
          where: { email: credentials?.email }
        });

        if (!admin) return null;
        const isValid = await verifyPassword(admin, credentials?.password || '');
        return isValid ? { id: admin.id, email: admin.email, name: admin.name } : null;
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  }
};

