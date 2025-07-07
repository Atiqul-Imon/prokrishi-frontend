import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ChatWidget from "../components/ChatWidget";
import chatConfig from "../config/chat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prokrishi - Fresh Organic Food Marketplace",
  description: "Buy fresh organic vegetables, fruits, grains, and agricultural products directly from farmers. Your trusted source for healthy, sustainable food in Bangladesh.",
  keywords: "organic food, fresh vegetables, fruits, agricultural products, farmers market, Bangladesh, sustainable farming, healthy food",
  authors: [{ name: "Prokrishi Team" }],
  creator: "Prokrishi",
  publisher: "Prokrishi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://prokrishi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Prokrishi - Fresh Organic Food Marketplace",
    description: "Buy fresh organic vegetables, fruits, grains, and agricultural products directly from farmers. Your trusted source for healthy, sustainable food in Bangladesh.",
    url: 'https://prokrishi.com',
    siteName: 'Prokrishi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prokrishi - Fresh Organic Food Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Prokrishi - Fresh Organic Food Marketplace",
    description: "Buy fresh organic vegetables, fruits, grains, and agricultural products directly from farmers.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#16a34a" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="theme-color" content="#16a34a" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="Buy fresh organic vegetables, fruits, grains, and agricultural products directly from farmers. Your trusted source for healthy, sustainable food in Bangladesh." />
        <meta name="keywords" content="organic food, fresh vegetables, fruits, agricultural products, farmers market, Bangladesh, sustainable farming, healthy food, organic farming" />
        <meta name="author" content="Prokrishi Team" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Prokrishi - Fresh Organic Food Marketplace" />
        <meta property="og:description" content="Buy fresh organic vegetables, fruits, grains, and agricultural products directly from farmers. Your trusted source for healthy, sustainable food in Bangladesh." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://prokrishi.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Prokrishi" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prokrishi - Fresh Organic Food Marketplace" />
        <meta name="twitter:description" content="Buy fresh organic vegetables, fruits, grains, and agricultural products directly from farmers." />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://prokrishi.com" />
        <meta name="application-name" content="Prokrishi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Prokrishi" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Facebook SDK for Messenger integration */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId: '${chatConfig.facebook.appId}',
                  cookie: true,
                  xfbml: true,
                  version: 'v18.0'
                });
              };
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ChatWidget />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#4ade80",
                    secondary: "#fff",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
