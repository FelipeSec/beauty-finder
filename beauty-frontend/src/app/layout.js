import './globals.css'

export const metadata = {
  title: "Recomendador de Produtos de Beleza",
  description: "Descubra suas rotinas perfeitas de beleza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
