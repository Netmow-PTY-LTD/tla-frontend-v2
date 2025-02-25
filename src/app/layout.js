import { Inter } from "next/font/google";
import "../styles/globals.css";
import ReduxProvider from "@/store/Provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "The LawAppOnline",
  description:
    "The Law App is a complete online marketplace for people to search for lawyers at a price they can afford and for lawyers to build an online presence to find clients without the need for heavy marketing expenses. We match clients to lawyers directly based on their field of expertise and allow fair bidding to reach the right price.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
