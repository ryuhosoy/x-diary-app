import type { Metadata } from "next";
import "./globals.css";
import SessionProviders from "./providers/sessionProviders";
import { getServerSession } from "next-auth/next";
import nextAuthOptions from "./next-auth-options";

export const metadata: Metadata = {
  title: "Create Next App", 
  description: "Generated by create next app",
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(nextAuthOptions);
  console.log("layout session", session);

  return (
    <html lang="en">
      <body>
        {/* <SessionProviders session={session}> */}
          <div className="min-h-screen bg-gray-50 flex">{children}</div>
        {/* </SessionProviders> */}
      </body>
    </html>
  );
}
