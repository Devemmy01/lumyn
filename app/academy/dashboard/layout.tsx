import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Student Dashboard",
  manifest: "/academy-manifest.json",
  robots: { index: false, follow: false, nocache: true },
  appleWebApp: {
    capable: true,
    title: "Lumyn Academy",
    statusBarStyle: "black-translucent",
  },
};

export default function AcademyDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Script id="academy-sw-register" strategy="afterInteractive">
        {`if ('serviceWorker' in navigator) { window.addEventListener('load', function() { var isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname); if (isLocal) { navigator.serviceWorker.getRegistrations().then(function(registrations) { registrations.forEach(function(registration) { if (registration.scope.indexOf('/academy/dashboard') !== -1) registration.unregister(); }); }); return; } navigator.serviceWorker.register('/academy-sw.js', { scope: '/academy/dashboard' }); }); }`}
      </Script>
      {children}
    </>
  );
}
