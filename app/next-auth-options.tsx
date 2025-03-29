import TwitterProvider from "next-auth/providers/twitter";
import type { NextAuthOptions } from "next-auth";

export const nextAuthOptions: NextAuthOptions = {
  debug: true,
  session: { strategy: "jwt" },
  secret: "yhTNYOrBQon8CxpYGo/tp7tOmTsKvOn36D9wFABczYk=",
  providers: [
    TwitterProvider({
      clientId: "gAPaMF89HYP5ph3iLi6CDpLbh",
      clientSecret: "wygBmxJ8sKQQgubUjE7UbOlAAFlYyA0jg0lhOMaFxBRiFh9tZD",
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
      // console.log("in session", { session, token });
      
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      };
    },
  },
};

export default nextAuthOptions;