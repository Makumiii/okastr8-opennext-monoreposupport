import "./styles.css";

export const metadata = {
  title: "Task Tracker",
  description: "Task tracking with per-task pomodoro sessions"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
