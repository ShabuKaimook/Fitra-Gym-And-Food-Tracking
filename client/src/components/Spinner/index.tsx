type Props = {
  /** Size and colour, e.g. "size-5 text-on-primary" in a button. Default: 32px, orange. */
  className?: string
  /** Read by screen readers. "" = decorative, when text beside it already says what's loading. */
  label?: string
}

// Loading spinner (a dumbbell being lifted). Draws in currentColor, so it works on any background.
// Reduced motion slows it down rather than stopping it, so it still shows something is happening.
export const Spinner = ({ className = 'size-8 text-primary', label = 'Loading' }: Props) => (
  <svg
    viewBox="0 0 48 48"
    {...(label ? { role: 'status', 'aria-label': label } : { 'aria-hidden': true })}
    className={`inline-block flex-none ${className}`}
  >
    <ellipse
      cx="24"
      cy="42"
      rx="13"
      ry="1.6"
      fill="currentColor"
      className="origin-center animate-lift-shadow opacity-25 [transform-box:fill-box] motion-reduce:[animation-duration:2s]"
    />
    <g fill="currentColor" className="translate-y-1 animate-lift motion-reduce:[animation-duration:2s]">
      <rect x="10" y="22.5" width="28" height="3" rx="1.5" />
      <rect x="12.5" y="15" width="4.5" height="18" rx="1.8" />
      <rect x="31" y="15" width="4.5" height="18" rx="1.8" />
      <rect x="8" y="18" width="3.5" height="12" rx="1.5" />
      <rect x="36.5" y="18" width="3.5" height="12" rx="1.5" />
    </g>
  </svg>
)
