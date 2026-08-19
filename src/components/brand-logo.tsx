import { Wallet } from "lucide-react";

type BrandLogoProps = {
  /** true when the logo sits on a dark surface (sidebar, nav, footer) */
  onDark?: boolean;
  /** show the wallet icon box next to the name */
  withIcon?: boolean;
  /** sm = footer • md = nav • lg = sidebar • xl = auth pages */
  size?: "sm" | "md" | "lg" | "xl";
};

const SIZES = {
  sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-lg" },
  md: { box: "h-9 w-9", icon: "h-5 w-5", text: "text-xl" },
  lg: { box: "h-9 w-9", icon: "h-5 w-5", text: "text-2xl" },
  xl: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-3xl" },
} as const;

export default function BrandLogo({ onDark = false, withIcon = true, size = "md" }: BrandLogoProps) {
  const s = SIZES[size];

  return (
    <span className="inline-flex items-center gap-2 select-none">
      {withIcon && (
        <span className={`${s.box} rounded-lg bg-primary flex items-center justify-center shrink-0`}>
          <Wallet className={`${s.icon} text-primary-foreground`} />
        </span>
      )}
      <span
        className={`${s.text} font-heading font-bold tracking-tight ${
          onDark ? "text-white" : "text-foreground"
        }`}
      >
        Rupa<span className="text-primary">lytic</span>
      </span>
    </span>
  );
}