"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Dumbbell, Sun, Moon, Mail, Menu, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

export default function Header({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { data: session } = useSession();

  return (
    <header className="h-14 shrink-0 border-b bg-background/95 backdrop-blur-sm flex items-center px-4 gap-4 z-30">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2">
        <Dumbbell className="h-4 w-4 text-foreground shrink-0" />
        <span className="font-semibold text-sm tracking-tight text-foreground">
          Small Talk Gym
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        <Link
          href="/contact"
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
            pathname === "/contact"
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Mail className="h-3.5 w-3.5" />
          <span>About</span>
        </Link>

        {/* Placeholder slots for future nav items (login, settings, etc.) */}
        {/* <SettingsButton /> */}
      </nav>

      {/* Auth */}
      {mounted && (
        session ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="hidden sm:inline max-w-[120px] truncate">{session.user.name || session.user.email}</span>
            </div>
            <button
              onClick={async () => {
                await signOut();
                router.push("/sign-in");
                router.refresh();
              }}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign in</span>
          </Link>
        )
      )}

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Toggle dark mode"
      >
        {mounted && resolvedTheme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    </header>
  );
}
