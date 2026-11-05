import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { PreferencesProvider } from "@/lib/preferences";
import { Base44Scripts } from "base44:document";
import { MASCOT_URL } from "@/lib/brand-asset";
import appCss from "@/index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "لونُطق | LAWNATQ — لونك ينطق عنك" },
      {
        name: "description",
        content:
          "لونُطق مساحة تعبير للأطفال من 5 إلى 10 سنوات: بطاقات تواصل، رسم وتلوين، قصص تفاعلية، ومساعد ودود. LAWNATQ — a gentle space where children express themselves through colors, cards and stories.",
      },
      { name: "theme-color", content: "#F7F5F0" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@400;500;600;700;800&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap",
      },
      { rel: "icon", type: "image/png", href: MASCOT_URL },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <AuthProvider>
        <PreferencesProvider>
          <Outlet />
          <Toaster />
        </PreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootDocument({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body data-react-root="true">
        {children}
        <Base44Scripts />
        <Scripts />
      </body>
    </html>
  );
}