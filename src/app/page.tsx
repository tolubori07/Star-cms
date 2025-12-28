import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Database,
  LayoutDashboard,
  ShieldCheck,
  Workflow,
  Boxes,
  Plug,
  Sparkles,
} from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative border-b">
        <div className="mx-auto max-w-6xl px-6 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              BlockForge
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl">
              A CMS built for
              <br />
              <span className="text-primary">structured content.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              Define collections, manage entries, and deliver content through a
              clean API. Fully schema-driven. Fully type-safe.
            </p>

            <div className="mt-10 flex gap-4">
              <Button size="lg">Open Dashboard</Button>
              <Button size="lg" variant="outline">
                View API
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={Boxes}
            title="Schema-driven collections"
            description="Define collections and fields visually. No migrations, no hardcoded schemas."
          />
          <Feature
            icon={LayoutDashboard}
            title="Content management UI"
            description="Create, edit, and manage entries with a clean, structured editor."
          />
          <Feature
            icon={Database}
            title="Typed content layer"
            description="All content is backed by Prisma for consistency and safety."
          />
          <Feature
            icon={Workflow}
            title="Flexible field types"
            description="Text, numbers, dates, media, files, and more — all configurable."
          />
          <Feature
            icon={ShieldCheck}
            title="Safe by default"
            description="Validation, required fields, and predictable data shapes."
          />
          <Feature
            icon={Plug}
            title="API-first"
            description="Consume your content anywhere via a clean, headless API."
          />
        </div>
      </section>

      {/* POSITIONING */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-3xl">
            <h2 className="font-heading text-3xl font-bold">
              Not just forms. Not just tables.
            </h2>
            <p className="mt-4 text-muted-foreground">
              This CMS is designed around structured data. You model your
              content once, manage it visually, and trust it everywhere else —
              websites, apps, internal tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-heading text-3xl font-bold">
            Build content with confidence
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A modern CMS for developers who care about structure, safety, and
            control.
          </p>
          <div className="mt-8">
            <Button size="lg">Get started</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-muted/50">
      <CardContent className="flex flex-col gap-3 p-6">
        <Icon className="h-6 w-6 text-primary" />
        <h3 className="font-heading font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
