import "./globals.css";

export const metadata = {
  title: "Fragrantica",
  description: "Fragrantica pyramid maker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
