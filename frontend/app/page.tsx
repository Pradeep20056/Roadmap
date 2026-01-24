import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="font-bold text-xl">AI Roadmap Gen</div>
        <div className="flex gap-4">
          <Link href="/roadmap/demo">
            <Button variant="ghost">Roadmap</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 py-12 bg-gray-50 dark:bg-zinc-900">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Master Any Skill with <span className="text-blue-600">AI-Powered</span> Roadmaps
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
          Stop wondering where to start. Generate personalized, week-by-week learning paths for any goal in seconds.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">Generate My Roadmap</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8">Learn More</Button>
          </Link>
        </div>
      </section>

      <section id="features" className="py-20 px-6 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <FeatureCard
          title="Instant Plans"
          desc="Just type your goal, and get a structured plan in seconds."
        />
        <FeatureCard
          title="Curated Resources"
          desc="Best free tutorials, docs, and videos selected for you."
        />
        <FeatureCard
          title="Track Progress"
          desc="Save your roadmaps and check off weeks as you go."
        />
      </section>
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
