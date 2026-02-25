import "@/app/globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "User Management",
  description: "SSR CRUD Example"
};

export default function RootLayout({ children }) {
  return (
    <html>
      <Header/>
      <body style={{ fontFamily: "Arial"}}>
        {children}
      </body>
    </html>
  );
}