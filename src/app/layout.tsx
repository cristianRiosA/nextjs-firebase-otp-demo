import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("RECAPTCHA SITE KEY:", process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  return (
    <html lang="es">
      <head>
      <Script
            src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
