import NextAuth from "next-auth";

import nextAuthOptions from "@/app/next-auth-options";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };