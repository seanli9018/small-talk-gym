"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { scenarios } from "@/lib/scenarios";
import { cn } from "@/lib/utils";
import { Dumbbell, Sun, Moon, Menu, X } from "lucide-react";

const difficultyDot: Record<string, string> = {
  beginner: "bg-foreground/30",
  intermediate: "bg-foreground/60",
  advanced: "bg-foreground",
};

function SidebarContent({
  onNavClick,
  onClose,
}: {
  onNavClick?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b">
        <Dumbbell className="h-5 w-5 text-foreground shrink-0" />
        <span className="font-semibold text-sm tracking-tight text-foreground flex-1">
          Small Talk Gym
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Section label */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Scenarios
        </p>
      </div>

      {/* Scenario list */}
      <nav className="flex flex-col gap-0.5 px-2 pb-4">
        {scenarios.map((scenario) => {
          const active = pathname === `/chat/${scenario.id}`;
          return (
            <Link
              key={scenario.id}
              href={`/chat/${scenario.id}`}
              onClick={onNavClick}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span className="text-base leading-none shrink-0">{scenario.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("font-medium truncate leading-tight", active ? "text-background" : "text-foreground")}>
                  {scenario.name}
                </p>
                <p className={cn("text-[11px] truncate mt-0.5", active ? "text-background/70" : "text-muted-foreground")}>
                  {scenario.personaName}
                </p>
              </div>
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  active ? "bg-background/60" : difficultyDot[scenario.difficulty]
                )}
                title={scenario.difficulty}
              />
            </Link>
          );
        })}
      </nav>

      {/* Footer hint */}
      <div className="mt-auto px-4 h-16 border-t flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Each scenario hides a secret — can you unlock them all?
        </p>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>
    </>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen border-r bg-muted/30 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 h-14 border-b bg-background/95 backdrop-blur-sm">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-foreground shrink-0" />
          <span className="font-semibold text-sm tracking-tight text-foreground">
            Small Talk Gym
          </span>
        </div>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 flex flex-col w-72 h-screen border-r bg-background overflow-y-auto transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavClick={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
