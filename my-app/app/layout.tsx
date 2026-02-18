import "./globals.css";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ 
        backgroundColor: "#222222",
        color: "#ffffff",
        }}>
        <Navbar /> 
        {children}
      </body>
    </html>
  );
}
