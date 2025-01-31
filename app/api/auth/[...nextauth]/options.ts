import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextAuthOptions } from "next-auth";

import { User } from "next-auth";

interface ExtendedUser extends User {
  user_id: string;
}


const login = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(
    `${process.env.NEXTAUTH_URL}/api/auth/login`,
    {
      email: credentials.email,
      password: credentials.password,
    }
  );
  return response;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;

        try {
          const loginCredentials = credentials as { email: string; password: string };
          const response = await login(loginCredentials);

          if (response.status === 200 && response.data && response.data.user) {
            const user: ExtendedUser = {
              id: response.data.user.id,
              token: response.data.user.token,
              uuid: response.data.user.uuid,
              user_id: response.data.user.user_id,
              name: response.data.user.name,
              email: response.data.user.email,
              role: response.data.user.role,
            };
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error(error); // or handle the error in some way
          throw new Error("Invalid email or password.");
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl + "/dashboard";
    },
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.user_id;
        token.name = extendedUser.name;
        token.email = extendedUser.email;
        token.role = extendedUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
