import TwitterProvider from "next-auth/providers/twitter";
import type { NextAuthOptions } from "next-auth";

export const nextAuthOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },
  secret: "yhTNYOrBQon8CxpYGo/tp7tOmTsKvOn36D9wFABczYk=",
  providers: [
    TwitterProvider({
      clientId: "NL8qcuwBDmDWYfNajRhsZXYN3",
      clientSecret: "ZtqHZHtDKBR4okkxFegDWUphS7TY9TldZtotNJvyUPTWjtSGJJ",
      version: "1.0a",
    }),
  ],
  callbacks: {
    jwt: ({ token, user, account, profile }) => {
      // 注意: トークンをログ出力してはダメです。
      console.log("in jwt", { user, token, account, profile });

      if (user) {
        token.user = user;
        const u = user as any;
        token.role = u.role;
      }
      if (account) {
        token.accessToken = account.oauth_token;
        token.accessTokenSecret = account.oauth_token_secret;
      }
      return token;
    },
    session: ({ session, token }) => {

      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          accessToken: token.accessToken,
          accessTokenSecret: token.accessTokenSecret
        },
      };
    },
  },
};

export default nextAuthOptions;