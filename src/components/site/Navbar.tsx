import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 inset-x-0 z-50 mx-auto max-w-6xl px-4"
    >
      <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-lg bg-[image:var(--gradient-primary)] grid place-items-center glow">
            <Flame className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold tracking-tight">CandleMind</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <Link to="/courses" className="hover:text-foreground transition">Courses</Link>
          <Link to="/screener" className="hover:text-foreground transition">Screener</Link>
          <Link to="/tutor" className="hover:text-foreground transition">AI Tutor</Link>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="text-sm px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition">Sign in</Link>
          <Link
            to="/auth"
            className="text-sm px-4 py-1.5 rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground font-medium hover:shadow-[var(--shadow-glow)] transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
