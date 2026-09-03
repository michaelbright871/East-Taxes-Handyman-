"use client";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import logoUrl from "@/assets/logo.png";
import { serviceCatalog, currency } from "./booking/pricing";
import { business } from "./business";

export function PricingBrochureButton() {
  const generatePdf = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Fetch and embed logo image
      let pngImage;
      try {
        const res = await fetch(logoUrl);
        const logoBytes = await res.arrayBuffer();
        pngImage = await pdfDoc.embedPng(logoBytes);
      } catch {
        pngImage = null;
      }

      const page1 = pdfDoc.addPage([612, 792]);
      const { width, height } = page1.getSize();

      // Draw header / cover
      if (pngImage) {
        const imgDims = pngImage.scale(0.6);
        page1.drawImage(pngImage, {
          x: 40,
          y: height - imgDims.height - 60,
          width: imgDims.width,
          height: imgDims.height,
        });
      }

      page1.drawText("East Texas Handyman Services", {
        x: 40,
        y: height - 140,
        size: 26,
        font: timesRomanFont,
        color: rgb(0.06, 0.2, 0.6),
      });

      page1.drawText("Professional Home Repairs & Maintenance", {
        x: 40,
        y: height - 170,
        size: 14,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page1.drawText(`Longview, Texas`, {
        x: 40,
        y: height - 190,
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      page1.drawText("Pricing Guide", {
        x: 40,
        y: height - 230,
        size: 20,
        font: timesRomanFont,
        color: rgb(0.06, 0.2, 0.6),
      });

      page1.drawText(
        "Typical Price Ranges, Published Up Front — written estimates are always free and final pricing is confirmed in a written estimate before work begins.",
        {
          x: 40,
          y: height - 260,
          size: 10,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
          maxWidth: width - 80,
        },
      );

      page1.drawText(`Website: ${business.website || "Visit our website"}` , { x: 40, y: 90, size: 10, font: timesRomanFont });
      page1.drawText(`Call: ${business.phone || "Visit our website"}` , { x: 40, y: 76, size: 10, font: timesRomanFont });

      // Page 2: pricing table
      const page2 = pdfDoc.addPage([612, 792]);
      const margin = 40;
      let yCursor = 740;

      page2.drawText("Service", { x: margin, y: yCursor, size: 12, font: timesRomanFont, color: rgb(0,0,0) });
      page2.drawText("Starting From", { x: 380, y: yCursor, size: 12, font: timesRomanFont, color: rgb(0,0,0) });
      yCursor -= 18;

      const rowHeight = 20;

      serviceCatalog.forEach((svc) => {
        const price = currency(svc.base[0]);
        page2.drawText(svc.label, { x: margin, y: yCursor, size: 11, font: timesRomanFont, color: rgb(0,0,0) });
        page2.drawText(price, { x: 380, y: yCursor, size: 11, font: timesRomanFont, color: rgb(0.06, 0.2, 0.6) });
        yCursor -= rowHeight;
      });

      // Footer and page numbers
      [page1, page2].forEach((pg, idx) => {
        const { width: w } = pg.getSize();
        pg.drawText(`Page ${idx + 1} of 2`, { x: w - 100, y: 30, size: 10, font: timesRomanFont, color: rgb(0.2,0.2,0.2) });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
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
      toast.error("Failed to generate brochure");
    }
  };

  return (
    <Button variant="brand" size="xl" onClick={generatePdf}>
      Download Brochure
    </Button>
  );
}
