import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { syncDB, User } from "./models/index";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // 7 days
  debug: process.env.NODE_ENV === "development",

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          await syncDB();

          const user = await User.findOne({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (!user || !user.passwordHash) return null;
          if (user.status !== "approved" && user.role !== "admin") return null;

          const valid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!valid) return null;

          // Update last login
          await user.update({ lastLoginAt: new Date() });

          return {
            id:      String(user.id),
            name:    user.name,
            email:   user.email,
            role:    user.role,
            status:  user.status,
            company: user.company ?? undefined,
          };
        } catch (error) {
          console.error("[NextAuth authorize error]", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id      = user.id;
        token.role    = (user as any).role;
        token.status  = (user as any).status;
        token.company = (user as any).company;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id      = token.id;
        (session.user as any).role    = token.role;
        (session.user as any).status  = token.status;
        (session.user as any).company = token.company;
      }
      return session;
    },
  },

  pages: {
    signIn:  "/auth/login",
    error:   "/auth/error",
  },
};
