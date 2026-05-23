import type { Metadata } from "next";
import "./globals.css";
import Navbar      from "@/components/Navbar";
import Footer      from "@/components/Footer";
import Newsletter  from "@/components/Newsletter";
import { AuthProvider } from "@/components/AuthContext";

// Métadonnées globales — surchargées page par page avec generateMetadata()
export const metadata: Metadata = {
  title: {
    default:  "EduBlog — Votre avenir commence ici",
    template: "%s — EduBlog",
  },
  description:
    "Articles sur l'orientation, la carrière, les opportunités et le développement personnel pour la jeunesse africaine.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    siteName: "EduBlog",
    locale:   "fr_FR",
    type:     "website",
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body">
        <AuthProvider>
          <Navbar />
          {children}
          <Newsletter />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
