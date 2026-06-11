import "./styles.css";

export const metadata = {
  title: "Take Notes",
  description: "Simple SQLite-backed note taking"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
