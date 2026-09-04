"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PricingBrochureButton() {
  const generatePdf = async () => {
    try {
      const res = await fetch("/api/brochure");
      if (!res.ok) throw new Error("Failed to fetch brochure");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "East-Texas-Handyman-Pricing-Guide.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download brochure");
    }
  };

  return (
    <Button variant="brand" size="xl" onClick={generatePdf}>
      Download Brochure
    </Button>
  );
}
            a.href = url;
