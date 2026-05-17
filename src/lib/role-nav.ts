import {
  LayoutDashboard, Bot, BookOpen, Brain, LineChart, Users, Shield,
  Megaphone, Wallet, Radio, Upload, GraduationCap, BarChart3, CalendarClock, HeartPulse,
} from "lucide-react";
import type { Role } from "@/hooks/use-auth";

export type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

export const studentNav: NavItem[] = [
  { to: "/student-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Trading Classes", icon: BookOpen },
  { to: "/paper-trading", label: "Paper Trading", icon: Wallet },
  { to: "/quiz", label: "Quizzes", icon: Brain },
  { to: "/screener", label: "Screener", icon: LineChart },
  { to: "/broadcasts", label: "Broadcasts", icon: Megaphone },
  { to: "/tutor", label: "AI Mentor", icon: Bot },
  { to: "/psychology", label: "Psychology Coach", icon: HeartPulse },
  { to: "/referrals", label: "Referrals", icon: Users },
];

export const tutorNav: NavItem[] = [
  { to: "/tutor-dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/tutor-dashboard?tab=courses", label: "My Courses", icon: BookOpen },
  { to: "/tutor-dashboard?tab=upload", label: "Upload Class", icon: Upload },
  { to: "/tutor-dashboard?tab=live", label: "Live Classes", icon: CalendarClock },
  { to: "/tutor-dashboard?tab=students", label: "Students", icon: GraduationCap },
  { to: "/tutor-dashboard?tab=broadcast", label: "Broadcast", icon: Radio },
  { to: "/tutor-dashboard?tab=analytics", label: "Analytics", icon: BarChart3 },
];

export const adminNav: NavItem[] = [
  { to: "/admin-dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin-dashboard?tab=students", label: "Students", icon: Users },
  { to: "/admin-dashboard?tab=tutors", label: "Tutors", icon: GraduationCap },
  { to: "/admin-dashboard?tab=attendance", label: "Attendance", icon: CalendarClock },
  { to: "/admin-dashboard?tab=broadcasts", label: "Broadcasts", icon: Megaphone },
  { to: "/admin-dashboard?tab=analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin-dashboard?tab=settings", label: "Settings", icon: Shield },
];

export const navForRole = (role: Role | null): NavItem[] =>
  role === "admin" ? adminNav : role === "tutor" ? tutorNav : studentNav;
