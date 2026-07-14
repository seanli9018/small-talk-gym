import { Mail, Heart, Dumbbell } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 overflow-y-auto">
      <div className="max-w-lg w-full space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">About This Project</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The honest story of why this exists.
          </p>
        </div>

        {/* Story section */}
        <div className="rounded-xl border bg-muted/30 px-6 py-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Hi, I&apos;m <span className="text-foreground font-medium">Sean</span> — a developer who can
            debug a gnarly async race condition but completely freezes up when someone at a
            conference says <em>&ldquo;So… what do you do for fun?&rdquo;</em> 😅
          </p>
          <p>
            Let&apos;s be real: soft skills are wildly underrated in tech. We spend years mastering
            TypeScript and system design, yet nobody teaches us how to not be awkward at the
            company all-hands or survive a 3-minute elevator ride with the CTO.
          </p>
          <p>
            <span className="text-foreground font-medium">Small Talk Gym</span>{" "}is my attempt to fix
            that — at least for myself, and hopefully for anyone else who secretly rehearses
            conversations in the shower. The idea is simple: practice the socially uncomfortable
            stuff with an AI that won&apos;t judge you, so the real-world version feels a little
            less terrifying.
          </p>
          <p>
            Think of it as a gym for your social muscles. Low stakes, no cringe, just reps. 💪
          </p>
        </div>

        {/* What I'm looking for */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Got ideas? Let&apos;s talk.
          </h2>
          <div className="rounded-xl border bg-muted/30 px-6 py-5 text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              Whether you have a wild scenario idea, want to collaborate, or just want to commiserate
              about being a fellow awkward developer — my inbox is open. 📬
            </p>
            <p>
              I&apos;m especially excited about:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-foreground/80">
              <li>New scenario ideas (the weirder the better)</li>
              <li>Better AI feedback &amp; coaching mechanics</li>
              <li>Making this useful beyond just small talk</li>
              <li>Anyone who wants to build this together</li>
            </ul>
          </div>
        </div>

        {/* Contact card */}
        <div className="rounded-xl border px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Mail className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Drop me a line</p>
              <a
                href="mailto:seanli9018@gmail.com"
                className="text-sm font-medium text-foreground hover:underline underline-offset-4"
              >
                seanli9018@gmail.com
              </a>
            </div>
          </div>
          <a
            href="mailto:seanli9018@gmail.com"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background text-xs font-medium px-4 py-2 hover:opacity-90 transition-opacity"
          >
            <Heart className="h-3.5 w-3.5" />
            Say hello
          </a>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground">
          Built with too much coffee and a genuine desire to be less socially weird. ☕
        </p>

      </div>
    </div>
  );
}
