import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type Photo = { src: string; alt: string }

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduced(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}

/**
 * An image that fades in once it has loaded, instead of painting in line by line.
 * Already-cached images show at once; reduced-motion users get no transition.
 */
export function FadeImg({ className, onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  useLayoutEffect(() => {
    const img = ref.current
    if (img?.complete && img.naturalWidth) setLoaded(true)
  }, [props.src])
  return (
    <img
      ref={ref}
      {...props}
      onLoad={(e) => {
        setLoaded(true)
        onLoad?.(e)
      }}
      onError={() => setLoaded(true)}
      className={cn("transition-opacity duration-700 ease-out motion-reduce:transition-none", loaded ? "opacity-100" : "opacity-0", className)}
    />
  )
}

/**
 * Hero photos that crossfade every 6 seconds, with a "1 / 5" counter and a caption.
 * Waits for the next photo to load; pauses on hover, when scrolled away or in a hidden tab;
 * stops back on the first photo after two rounds; never moves for reduced motion.
 */
export function HeroSlides({ photos, label, className }: { photos: Photo[]; label: string; className?: string }) {
  const reduced = useReducedMotion()
  const [at, setAt] = useState(0)
  const figRef = useRef<HTMLElement>(null)
  const imgs = useRef<(HTMLImageElement | null)[]>([])
  const state = useRef({ hovered: false, seen: true, rounds: 0, at: 0 })

  useEffect(() => {
    if (reduced || photos.length < 2) return
    const fig = figRef.current
    const s = state.current
    const io = new IntersectionObserver(([e]) => (s.seen = e.isIntersecting))
    if (fig) io.observe(fig)
    const timer = window.setInterval(() => {
      if (s.hovered || !s.seen || document.hidden) return
      const next = (s.at + 1) % photos.length
      const img = imgs.current[next]
      if (!img?.complete || !img.naturalWidth) return // try again on the next tick
      if (next === 0) s.rounds += 1
      s.at = next
      setAt(next)
      if (s.rounds >= 2) window.clearInterval(timer)
    }, 6000)
    return () => {
      window.clearInterval(timer)
      io.disconnect()
    }
  }, [reduced, photos.length])

  return (
    <figure
      ref={figRef}
      aria-label={label}
      onPointerEnter={() => (state.current.hovered = true)}
      onPointerLeave={() => (state.current.hovered = false)}
      className={cn("relative overflow-hidden", className)}
    >
      {photos.map((p, i) => (
        <img
          key={p.src}
          ref={(el) => {
            imgs.current[i] = el
          }}
          src={p.src}
          alt={i === at ? p.alt : ""}
          aria-hidden={i !== at}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "photo-mono absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none",
            i === at ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-background/85 px-5 py-3 text-sm text-muted-foreground backdrop-blur-sm">
        <span aria-live="polite">{photos[at].alt}</span>
        {photos.length > 1 && (
          <span className="tabular-nums" aria-hidden>
            {at + 1} / {photos.length}
          </span>
        )}
      </figcaption>
    </figure>
  )
}

/**
 * Full-colour photo viewer: previous/next buttons, arrow keys, swipe on phones,
 * an "x of y" counter, and the neighbouring photos preloaded.
 */
export function PhotoViewer({
  photos,
  index,
  onIndexChange,
  labels,
}: {
  photos: Photo[]
  index: number | null
  onIndexChange: (i: number | null) => void
  labels: { prev: string; next: string; close: string; of: string }
}) {
  const open = index !== null
  const n = photos.length
  const go = useCallback((d: number) => index !== null && onIndexChange((index + d + n) % n), [index, n, onIndexChange])
  const x0 = useRef<number | null>(null)

  useEffect(() => {
    if (index === null) return
    for (const k of [index - 1, index + 1]) new Image().src = photos[(k + n) % n].src
  }, [index, n, photos])

  const p = index !== null ? photos[index] : null
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent
        showCloseButton={false}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") (e.preventDefault(), go(-1))
          if (e.key === "ArrowRight") (e.preventDefault(), go(1))
        }}
        className="dark w-auto max-w-[94vw] gap-0 overflow-hidden rounded-[3px] bg-background p-0 text-foreground sm:max-w-[94vw]"
      >
        {p && (
          <>
            <DialogTitle className="sr-only">{p.alt}</DialogTitle>
            <div
              className="relative touch-pan-y select-none"
              onPointerDown={(e) => (x0.current = e.clientX)}
              onPointerUp={(e) => {
                if (x0.current === null) return
                const dx = e.clientX - x0.current
                x0.current = null
                if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
              }}
            >
              <FadeImg key={p.src} src={p.src} alt={p.alt} draggable={false} className="mx-auto block h-auto max-h-[78vh] w-auto max-w-[94vw] object-contain" />
              {n > 1 && (
                <>
                  <ViewerButton side="left" label={labels.prev} onClick={() => go(-1)}>
                    <ChevronLeft />
                  </ViewerButton>
                  <ViewerButton side="right" label={labels.next} onClick={() => go(1)}>
                    <ChevronRight />
                  </ViewerButton>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 px-4 py-3 text-sm text-muted-foreground">
              <span className="flex-1">{p.alt}</span>
              {n > 1 && (
                <span className="tabular-nums">
                  {index! + 1} {labels.of} {n}
                </span>
              )}
              <DialogClose
                aria-label={labels.close}
                className="-mr-1 grid size-9 place-items-center rounded-[3px] text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="size-5" />
              </DialogClose>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ViewerButton({ side, label, onClick, children }: { side: "left" | "right"; label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      className={cn(
        "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-[3px] bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-ring [&_svg]:size-6",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      {children}
    </button>
  )
}
