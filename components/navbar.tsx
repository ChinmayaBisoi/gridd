import Link from "next/link";
import { ModeToggle } from "@/components/theme-mode-toggle";

export default function Navbar() {
  return (
    <>
      <Link
        href="/grid"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Data Grid Demo
      </Link>
      <ModeToggle />
    </>
  );
}
