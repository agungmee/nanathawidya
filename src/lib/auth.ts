import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const PB_URL = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${PB_URL()}/api/collections/users/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identity: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();
          const user = data.record;

          if (!user || (user.role !== "admin" && user.role !== "store_admin")) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.avatar,
            role: user.role,
            storeId: user.storeId,
          };
        } catch (error) {
          console.error('PocketBase auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.storeId = (user as any).storeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).storeId = token.storeId;
      }
      return session;
    },
  },
});
