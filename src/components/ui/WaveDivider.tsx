import { cn } from "@/lib/utils"

interface WaveDividerProps {
  /** Color via Tailwind text-* class (e.g. "text-white") — the wave fill */
  className?: string
  /** Flip vertically for mirrored placement */
  flip?: boolean
}

/**
 * Decorative SVG wave used to separate homepage sections with a soft,
 * flowing transition instead of a hard edge. Fill color comes from the
 * Tailwind text-* utility passed via className.
 */
export function WaveDivider({ className, flip = false }: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-full overflow-hidden leading-[0]",
        flip && "rotate-180",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-[28px] sm:h-[40px] md:h-[56px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0 32C240 62 480 2 720 32C960 62 1200 2 1440 32V64H0V32Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
