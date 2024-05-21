// import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/provider/user/provider";
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" >
      <body style={{ margin: 0, padding: 1 }}>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
