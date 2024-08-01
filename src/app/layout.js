import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });
import Header from "@/components/Header";
import { ClerkProvider, SignInButton,
  SignedIn,
  SignedOut,
  UserButton } from "@clerk/nextjs";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        <main className="container">
          <div className="flex items-start justify-center min-h-screen">
            <div className="mt-0">{children}</div>
          </div>
        </main>
        {/* <SignedOut>
            <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn> */}
        {/* {children} */}
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
