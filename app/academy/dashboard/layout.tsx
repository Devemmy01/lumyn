import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Student Dashboard",
  manifest: "/academy-manifest.json",
  icons: {
    icon: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: { index: false, follow: false, nocache: true },
  appleWebApp: {
    capable: true,
    title: "Lumyn Academy",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101118",
};

export default function AcademyDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Script id="academy-sw-register" strategy="afterInteractive">
        {`if ('serviceWorker' in navigator) { window.addEventListener('load', function() { var localHosts = ['localhost', '127.0.0.1', '0.0.0.0']; var isLocal = localHosts.indexOf(window.location.hostname) !== -1; if (isLocal) { navigator.serviceWorker.getRegistrations().then(function(registrations) { registrations.forEach(function(registration) { if (registration.scope.indexOf('/academy/dashboard') !== -1) registration.unregister(); }); }); return; } navigator.serviceWorker.register('/academy-sw.js', { scope: '/academy/dashboard' }); }); }`}
      </Script>
      {children}
    </>
  );
}
