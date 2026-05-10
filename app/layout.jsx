import "./globals.css";

export const metadata = {
  title: "Factory Fit | Detroit AI Works",
  description:
    "A sourcing diagnostic tool for first-time apparel founders deciding which supplier path fits their clothing brand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
