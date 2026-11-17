import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const hind = Hind_Siliguri({ 
  subsets: ["bengali"], 
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  title: "TutorConnect BD",
  description: "বাংলাদেশের সেরা টিউশন প্ল্যাটফর্ম। শিক্ষক এবং শিক্ষার্থীদের সরাসরি যুক্ত করার সহজ মাধ্যম।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hind.className} text-white bg-[#03050a] flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}