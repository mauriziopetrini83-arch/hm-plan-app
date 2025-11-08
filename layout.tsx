export const metadata = { title: "Piano Mezza Maratona", description: "Vista atleta con velocità precise" };
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
