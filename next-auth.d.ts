import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      uuid: string;
      role: string;
      name: string;
      email: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    id: string;
    token: string;
    uuid: string;
    role: string;
    name: string;
    email: string;
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    id: string;
    token: string;
    uuid: string;
    role: string;
    name: string;
    email: string;
  }
}
