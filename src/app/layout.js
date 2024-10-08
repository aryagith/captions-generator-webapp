import { Inter } from "next/font/google";
import "./globals.css";
import CCIcon from "../components/CCIcon";
import Link from "next/link";
import UploadIcon from "../components/UploadIcon";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Captioner",
  description: "Apply beautiful captions to your videos!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className+ " bg-gradient-to-b from-blue-500 to-purple-300 min-h-screen"}>
        <main className="p-4 max-w-3xl mx-auto">
        <header className="flex justify-between my-8 items-center">
        <Link href ="/" className="inline-flex gap-1 items-center">
        <CCIcon/>
         <span>Captioner</span> 
          </Link>
        <nav className="flex gap-6 text-black/80">
          <Link href="/">Home</Link>
          <a href="/pricing">Pricing</a>
          <a href="mailto:aryagsv@gmail.com">Contact</a>
        </nav>
      </header>
      {children}
        </main> 
      </body>
      
    
    </html>
  );
}
