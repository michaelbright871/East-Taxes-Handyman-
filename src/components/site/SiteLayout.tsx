import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BookingProvider } from "./booking/BookingProvider";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </BookingProvider>
  );
}
