import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackButton } from "@/components/app/BackButton";

export function InfoPage({ title, tagline, children }: { title: string; tagline?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <article className="mx-auto max-w-3xl">
          <div className="text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">Home</Link> · {title}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
            {title}
          </h1>
          {tagline && <p className="mt-3 text-muted-foreground">{tagline}</p>}
          <div className="prose prose-invert mt-10 space-y-5 text-sm text-muted-foreground leading-relaxed [&_h2]:text-foreground [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-primary [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
