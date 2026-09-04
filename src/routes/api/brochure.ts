import { createFileRoute } from "@tanstack/react-router";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import { serviceCatalog, currency } from "@/components/site/booking/pricing";
import { business } from "@/components/site/business";

export const Route = createFileRoute("/api/brochure")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const pdfDoc = await PDFDocument.create();
          const times = await pdfDoc.embedFont(StandardFonts.Helvetica);

          // Try to embed logo from src/assets/logo.png if present
          let pngImage: ReturnType<typeof pdfDoc.embedPng> | null = null;
          try {
            const logoPath = path.resolve(process.cwd(), "src/assets/logo.png");
            const logoBytes = await readFile(logoPath);
            pngImage = await pdfDoc.embedPng(logoBytes);
          } catch (e) {
            pngImage = null;
          }

          const page1 = pdfDoc.addPage([612, 792]);
          const { width, height } = page1.getSize();

          if (pngImage) {
            const dims = pngImage.scale(0.6);
            page1.drawImage(pngImage, {
              x: 40,
              y: height - dims.height - 60,
              width: dims.width,
              height: dims.height,
            });
          }

          page1.drawText("East Texas Handyman Services", {
            x: 40,
            y: height - 140,
            size: 26,
            font: times,
            color: rgb(0.06, 0.2, 0.6),
          });

          page1.drawText("Professional Home Repairs & Maintenance", {
            x: 40,
            y: height - 170,
            size: 14,
            font: times,
            color: rgb(0, 0, 0),
          });

          page1.drawText(`Location: ${business.city ?? "East Texas"}`, {
            x: 40,
            y: height - 190,
            size: 12,
            font: times,
            color: rgb(0, 0, 0),
          });

          page1.drawText("Pricing Guide", {
            x: 40,
            y: height - 230,
            size: 20,
            font: times,
            color: rgb(0.06, 0.2, 0.6),
          });

          page1.drawText(
            "Typical Price Ranges, Published Up Front — written estimates are always free and final pricing is confirmed in a written estimate before work begins.",
            {
              x: 40,
              y: height - 260,
              size: 10,
              font: times,
              color: rgb(0, 0, 0),
              maxWidth: width - 80,
            },
          );

          page1.drawText(`Website: ${business.website || "Visit our website"}`, {
            x: 40,
            y: 90,
            size: 10,
            font: times,
          });
          page1.drawText(`Call: ${business.phone || "Visit our website"}`, {
            x: 40,
            y: 76,
            size: 10,
            font: times,
          });

          const page2 = pdfDoc.addPage([612, 792]);
          const margin = 40;
          let y = 740;

          page2.drawText("Service", { x: margin, y, size: 12, font: times, color: rgb(0, 0, 0) });
          page2.drawText("Starting From", { x: 380, y, size: 12, font: times, color: rgb(0, 0, 0) });
          y -= 18;

          const rowHeight = 20;

          for (const svc of serviceCatalog) {
            const price = currency(svc.base[0]);
            page2.drawText(svc.label, { x: margin, y, size: 11, font: times, color: rgb(0, 0, 0) });
            page2.drawText(price, { x: 380, y, size: 11, font: times, color: rgb(0.06, 0.2, 0.6) });
            y -= rowHeight;
            if (y < 80) {
              // new page
              const np = pdfDoc.addPage([612, 792]);
              y = 740;
              np.drawText("Service", { x: margin, y, size: 12, font: times, color: rgb(0, 0, 0) });
              np.drawText("Starting From", { x: 380, y, size: 12, font: times, color: rgb(0, 0, 0) });
              y -= 18;
            }
          }

          // Add page numbers
          const pages = pdfDoc.getPages();
          pages.forEach((pg, idx) => {
            const { width: w } = pg.getSize();
            pg.drawText(`Page ${idx + 1} of ${pages.length}`, {
              x: w - 120,
              y: 30,
              size: 10,
              font: times,
              color: rgb(0.2, 0.2, 0.2),
            });
          });

          const pdfBytes = await pdfDoc.save();

          return new Response(pdfBytes, {
            status: 200,
            headers: {
              "content-type": "application/pdf",
              "content-length": String(pdfBytes.length),
              "content-disposition": 'attachment; filename="East-Texas-Handyman-Pricing-Guide.pdf"',
            },
          });
        } catch (err) {
          console.error("Failed to generate brochure", err);
          return Response.json({ error: "Failed to generate brochure" }, { status: 500 });
        }
      },
    },
  },
});
