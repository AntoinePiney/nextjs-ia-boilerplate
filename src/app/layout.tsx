// app/layout.tsx
import "../styles/globals.css";
import "../styles/variables.css";
import LenisProvider from "./LenisProvider";

export const metadata = {
  title: "Antoine Piney - Portfolio",
  description: "Description de votre projet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
