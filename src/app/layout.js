import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/common/Header";
import "./globals.css";

export const metadata = {
  title: "ObsidianGPT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <Header />
          <main>{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}
