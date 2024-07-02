import "./globals.css";

export const metadata = {
  title: "Fraudgrantica",
  description: "Fragrantica pyramid/notes maker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
