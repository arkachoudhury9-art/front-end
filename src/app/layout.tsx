import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anomaly Detection",
  description: "Industrial asset anomaly monitoring and remediation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
