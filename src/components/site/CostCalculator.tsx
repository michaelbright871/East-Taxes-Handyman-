import { useMemo, useState } from "react";
import { ArrowRight, Calculator, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { business } from "./business";
import { useBooking } from "./booking/BookingProvider";
import { EstimatePanel } from "./booking/BookingDialog";
import {
  calculateEstimate,
  complexities,
  projectSizes,
  propertyTypes,
  serviceCatalog,
  type ComplexityId,
  type ProjectSizeId,
  type PropertyTypeId,
} from "./booking/pricing";

/** Instant repair cost calculator that hands off to the full quote estimator. */
export function CostCalculator() {
  const { open } = useBooking();
  const [service, setService] = useState(serviceCatalog[0]!.id);
  const [size, setSize] = useState<ProjectSizeId>("small");
  const [complexity, setComplexity] = useState<ComplexityId>("standard");
  const [propertyType, setPropertyType] = useState<PropertyTypeId>("residential");

  const estimate = useMemo(
    () =>
      calculateEstimate({
        serviceIds: [service],
        propertyType,
        size,
        complexity,
        urgency: "standard",
      }),
    [service, propertyType, size, complexity],
  );

  return (
    <section id="calculator" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <p className="eyebrow">Repair Cost Calculator</p>
          <h2 className="mt-4 text-3xl text-foreground sm:text-4xl">
            Know Roughly What It Costs Before You Call
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Pick a service, tell us the scope, and get a realistic East Texas price range instantly.
            Want it dialled in? Move straight into the full quote estimator with photos and your
            preferred schedule.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button variant="brand" size="xl" onClick={() => open("estimate", service)}>
              <Calculator className="size-4" /> Full Quote Estimator
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href={business.phoneHref}>
                <Phone className="size-4" /> {business.phone}
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-7 shadow-lg sm:p-9">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="calc-service">Service</Label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger id="calc-service">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceCatalog.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="calc-size">Project size</Label>
                <Select value={size} onValueChange={(v) => setSize(v as ProjectSizeId)}>
                  <SelectTrigger id="calc-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectSizes.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-property">Property type</Label>
                <Select
                  value={propertyType}
                  onValueChange={(v) => setPropertyType(v as PropertyTypeId)}
                >
                  <SelectTrigger id="calc-property">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calc-complexity">Repair complexity</Label>
              <Select value={complexity} onValueChange={(v) => setComplexity(v as ComplexityId)}>
                <SelectTrigger id="calc-complexity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complexities.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {estimate && <EstimatePanel estimate={estimate} />}

            <Button
              variant="brand"
              size="xl"
              className="w-full"
              onClick={() => open("estimate", service)}
            >
              Get Free Estimate <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
