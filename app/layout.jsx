import {Poppins} from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "THE VA BAR",
  description: "Enter your description here.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={poppins.className}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
