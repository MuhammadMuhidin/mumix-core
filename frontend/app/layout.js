import "./globals.css";

export const metadata = {
  title: "User Management",
  description: "SSR CRUD Example"
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ fontFamily: "Arial", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}