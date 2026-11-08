import { useEffect, useState } from "react"
import { Mail, Menu, MessageCircle } from "lucide-react"
import { siFacebook, siWhatsapp } from "simple-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { business, gallery, shopPhoto, shopServices, t, visitServices, type Lang, type Service } from "@/content"
import { FadeImg, HeroSlides, PhotoViewer } from "@/photos"

function initialLang(): Lang {
  // A ?lang=en / ?lang=es link (e.g. from the villa QR card) wins over everything else.
  const fromUrl = new URLSearchParams(window.location.search).get("lang")
  if (fromUrl === "en" || fromUrl === "es") return fromUrl
  const saved = localStorage.getItem("lb-lang")
  if (saved === "en" || saved === "es") return saved
  return navigator.language?.startsWith("en") ? "en" : "es"
}

const textLink =
  "inline-flex items-center gap-2 underline decoration-1 underline-offset-[6px] decoration-current/40 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring rounded-[2px]"


/** Single-color brand logo (WhatsApp, Facebook) drawn from simple-icons, sized to sit next to text. */
function BrandIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] shrink-0 fill-current">
      <path d={path} />
    </svg>
  )
}

function SectionHead({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="max-w-xl">
      <h2 className="text-4xl leading-tight sm:text-5xl">{title}</h2>
      {intro && <p className="mt-3 text-muted-foreground">{intro}</p>}
    </div>
  )
}

function ServiceRow({ s, lang }: { s: Service; lang: Lang }) {
  return (
    <div className="py-4">
      <div className="flex items-baseline-last gap-3">
        <h3 className="text-[1.45rem] leading-snug">{s.name[lang]}</h3>
        <span aria-hidden className="min-w-6 flex-1 -translate-y-1 border-b border-dotted border-foreground/35" />
        <span className="font-medium whitespace-nowrap tabular-nums">{s.price[lang]}</span>
      </div>
      <p className="mt-1 max-w-[46ch] text-[0.95rem] text-muted-foreground">{s.desc[lang]}</p>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [navOpen, setNavOpen] = useState(false)
  const [photo, setPhoto] = useState<number | null>(null)
  const c = t[lang]
  const galleryPhotos = gallery.map((g) => ({ src: g.src, alt: g.alt[lang] }))
  const heroPhotos = [{ src: shopPhoto.src, alt: shopPhoto.alt[lang] }, ...galleryPhotos]

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem("lb-lang", lang)
  }, [lang])

  // Phone-only booking bar: appears once the hero is scrolled past, hides while the booking form is on screen.
  const [pastHero, setPastHero] = useState(false)
  const [bookVisible, setBookVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    const book = document.getElementById("book")
    const io = book ? new IntersectionObserver(([e]) => setBookVisible(e.isIntersecting), { threshold: 0.15 }) : null
    if (book && io) io.observe(book)
    return () => {
      window.removeEventListener("scroll", onScroll)
      io?.disconnect()
    }
  }, [])
  const showBar = pastHero && !bookVisible

  const navLinks = [
    { href: "#services", label: c.nav.services },
    { href: "#work", label: c.nav.work },
    { href: "#visit", label: c.nav.visit },
  ]

  const LangSwitch = (
    <div className="flex items-center text-sm" role="group" aria-label="Language / Idioma">
      {(["es", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden className="mx-1.5 h-3.5 w-px bg-foreground/30" />}
          <button
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={cn(
              "rounded-[2px] px-1 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-ring",
              lang === l ? "text-foreground underline underline-offset-[6px]" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="sm:hidden">{l.toUpperCase()}</span>
            <span className="hidden sm:inline">{l === "es" ? "Español" : "English"}</span>
          </button>
        </span>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <header className="dark fixed inset-x-0 top-0 z-40 border-b bg-background/95 text-foreground backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <a href="#top" className="flex items-center gap-3 rounded-[2px] focus-visible:outline-2 focus-visible:outline-ring">
            <img src="/images/logo-mark.png" alt="" className="size-10" />
            <span className="font-heading text-base whitespace-nowrap tracking-[0.04em] uppercase max-[359px]:sr-only sm:text-lg">The Lord Barbier</span>
          </a>
          <nav className="ml-auto hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-4 md:ml-0">
            {LangSwitch}
            <a href="#book" className={cn(buttonVariants({ size: "sm" }), "hidden h-9 px-4 text-sm md:inline-flex")}>
              {c.nav.book}
            </a>
            <Sheet open={navOpen} onOpenChange={setNavOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" aria-label={c.menu} />}>
                <Menu />
              </SheetTrigger>
              <SheetContent side="right" className="dark bg-background p-6 text-foreground">
                <SheetTitle className="font-heading text-xl tracking-[0.04em] uppercase">The Lord Barbier</SheetTitle>
                <nav className="mt-6 flex flex-col gap-5 text-lg">
                  {[...navLinks, { href: "#book", label: c.nav.book }].map((l) => (
                    <a key={l.href} href={l.href} onClick={() => setNavOpen(false)}>
                      {l.label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO — the name set like the shop's sign, next to a full-bleed photo of their work */}
        <section className="dark bg-background pt-16 text-foreground">
          <div className="grid md:min-h-[calc(100svh-4rem)] md:grid-cols-2">
            {/* left padding lines the text up with the centered max-w-6xl content below */}
            <div className="flex flex-col justify-center px-5 py-14 md:py-20 md:pr-12 md:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
              <p className="flex items-center gap-4 text-sm text-muted-foreground" style={{ fontStretch: "112%" }}>
                <span>{c.hero.since}</span>
                <span aria-hidden className="h-px w-14 bg-current" />
                <span className="tabular-nums">{business.since}</span>
              </p>
              <h1 className="mt-5 uppercase">
                <span className="block text-[clamp(3.8rem,10.5vw,8rem)] leading-[0.86] font-bold tracking-[-0.015em]">The Lord</span>
                <span
                  className="mt-4 block font-sans text-[clamp(1.25rem,3.6vw,2.6rem)] leading-none font-medium tracking-[0.34em]"
                  style={{ fontStretch: "125%" }}
                >
                  Barbier
                </span>
              </h1>
              <p className="mt-8 max-w-[40ch] text-lg text-foreground/80">{c.hero.lead}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                <a href="#book" className={buttonVariants({ size: "lg" })}>
                  <MessageCircle /> {c.hero.book}
                </a>
                <a href="#services" className={textLink}>
                  {c.hero.services}
                </a>
              </div>
              <dl className="mt-12 grid max-w-md grid-cols-2 gap-6 border-t border-border pt-5 text-sm">
                <div>
                  <dt className="text-muted-foreground">{c.visit.address}</dt>
                  <dd className="mt-1">{c.hero.address}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{c.visit.phone}</dt>
                  <dd className="mt-1">
                    <a href={`tel:+${business.whatsapp}`} className="hover:underline">
                      +506 {business.phoneDisplay}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <HeroSlides
              photos={heroPhotos}
              label={c.heroPhotos}
              className="aspect-[4/5] sm:aspect-[16/10] md:aspect-auto"
            />
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="scroll-mt-16 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead title={c.services.title} intro={c.services.intro} />
            <Tabs defaultValue="shop" className="mt-10">
              <TabsList variant="line" className="gap-6 p-0">
                <TabsTrigger value="shop" className="px-0 pb-2 text-base">{c.services.shop}</TabsTrigger>
                <TabsTrigger value="visit" className="px-0 pb-2 text-base">{c.services.visit}</TabsTrigger>
              </TabsList>
              <TabsContent value="shop">
                <div className="mt-4 grid gap-x-16 md:grid-cols-2">
                  {shopServices.map((s) => (
                    <ServiceRow key={s.id} s={s} lang={lang} />
                  ))}
                </div>
                <p className="mt-6 text-sm text-muted-foreground">{c.services.priceNote}</p>
              </TabsContent>
              <TabsContent value="visit">
                <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
                  {visitServices.map((s) => (
                    <Card key={s.id} className="rounded-none bg-card ring-0">
                      <CardHeader>
                        <CardTitle className="font-heading text-[1.45rem] font-medium">{s.name[lang]}</CardTitle>
                        <CardDescription className="text-[0.95rem]">{s.desc[lang]}</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto text-sm font-medium">{s.price[lang]}</CardContent>
                    </Card>
                  ))}
                </div>
                <p className="mt-6 text-sm text-muted-foreground">{c.services.visitNote}</p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* RECENT CUTS */}
        <section id="work" className="dark scroll-mt-16 bg-background py-16 text-foreground md:py-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead title={c.work.title} intro={c.work.intro} />
              <a href={business.facebook} target="_blank" rel="noreferrer" className={textLink}>
                {c.work.more}
              </a>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {gallery.map((g, i) => (
                <figure key={g.src} className={cn(i % 2 === 1 && "md:mt-12")}>
                  <button
                    onClick={() => setPhoto(i)}
                    className="block w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    aria-label={g.alt[lang]}
                  >
                    <FadeImg src={g.src} alt={g.alt[lang]} loading="lazy" decoding="async" className="photo-mono aspect-[4/5] w-full bg-muted object-cover" />
                  </button>
                  <figcaption className="mt-3 text-sm text-muted-foreground">{g.alt[lang]}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <PhotoViewer photos={galleryPhotos} index={photo} onIndexChange={setPhoto} labels={c.viewer} />
        </section>

        {/* FIND US */}
        <section id="visit" className="scroll-mt-16 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.15fr]">
            <div>
              <SectionHead title={c.visit.title} />
              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="text-sm text-muted-foreground">{c.visit.address}</dt>
                  <dd className="mt-1 max-w-[38ch] text-lg">{c.visit.addressValue}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{c.visit.phone}</dt>
                  <dd className="mt-1 text-lg">
                    <a href={`tel:+${business.whatsapp}`} className="hover:underline">
                      +506 {business.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{c.visit.hours}</dt>
                  <dd className="mt-1 text-lg">{c.visit.hoursValue}</dd>
                </div>
              </dl>
              <p className="mt-8 max-w-[40ch] text-muted-foreground">{c.visit.products}</p>
              <a href={business.mapLink} target="_blank" rel="noreferrer" className={cn(textLink, "mt-6")}>
                {c.visit.directions}
              </a>
            </div>
            <iframe
              title="Map: The Lord Barbier, La Fortuna"
              src={business.mapEmbed}
              className="h-full min-h-96 w-full border border-border grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <BookingSection lang={lang} />
      </main>

      <footer className="dark border-t bg-background py-14 text-foreground">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:gap-10 sm:grid-cols-[auto_1fr_auto] sm:items-start">
          <img src="/images/logo-mark.png" alt="The Lord Barbier" className="size-20" />
          <p className="max-w-[36ch] text-sm text-muted-foreground">{c.footer}</p>
          <div>
            <h2 className="font-sans text-sm font-medium text-muted-foreground">{c.contact}</h2>
            <ul className="mt-3 space-y-3 text-[0.95rem]">
              <li>
                <a
                  href={`https://wa.me/${business.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`WhatsApp +506 ${business.phoneDisplay}`}
                  className="inline-flex items-center gap-3 hover:underline"
                >
                  <BrandIcon path={siWhatsapp.path} />
                  +506 {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={business.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook: The Lord Barbier"
                  className="inline-flex items-center gap-3 hover:underline"
                >
                  <BrandIcon path={siFacebook.path} />
                  The Lord Barbier
                </a>
              </li>
              {business.email && (
                <li>
                  <a
                    href={`mailto:${business.email}`}
                    aria-label={`Email ${business.email}`}
                    className="inline-flex items-center gap-3 hover:underline"
                  >
                    <Mail className="size-[18px] shrink-0" aria-hidden />
                    {business.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 pb-20 text-xs text-muted-foreground md:pb-0">© {new Date().getFullYear()} The Lord Barbier</p>
      </footer>

      <div
        aria-hidden={!showBar}
        className={cn(
          "dark fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-foreground backdrop-blur transition-transform duration-300 motion-reduce:transition-none md:hidden",
          showBar ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
      >
        <a href="#book" tabIndex={showBar ? 0 : -1} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          <BrandIcon path={siWhatsapp.path} /> {c.hero.book}
        </a>
      </div>
    </div>
  )
}

function BookingSection({ lang }: { lang: Lang }) {
  const c = t[lang].book
  const all = [...shopServices, ...visitServices.filter((s) => s.id !== "villa")]
  const items = all.map((s) => ({ value: s.id, label: s.name[lang] }))
  const [service, setService] = useState<string>("cut")
  const [where, setWhere] = useState<"shop" | "villa">("shop")

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const via = ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value
    const f = new FormData(e.currentTarget)
    const svc = all.find((s) => s.id === service)?.name[lang] ?? service
    const lines = [
      c.msgHello,
      `${c.name}: ${f.get("name")}`,
      `${c.service}: ${svc}`,
      `${c.where}: ${where === "shop" ? c.atShop : `${c.atVilla} (${f.get("place")})`}`,
      `${c.date}: ${f.get("date")}${f.get("time") ? " " + f.get("time") : ""}`,
      `${c.people}: ${f.get("people")}`,
    ]
    if (f.get("notes")) lines.push(`${c.notes.replace(/ \(.*\)/, "")}: ${f.get("notes")}`)
    const text = lines.join("\n")
    if (via === "mail" && business.email) {
      const subject = `${c.emailSubject}: ${f.get("name")}`
      window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    } else {
      window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener")
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <section id="book" className="dark scroll-mt-16 bg-background py-16 text-foreground md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHead title={c.title} intro={c.lead} />
          <p className="mt-8 text-muted-foreground">
            WhatsApp{" "}
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">
              +506 {business.phoneDisplay}
            </a>
          </p>
        </div>
        <form onSubmit={submit} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="name">{c.name}</Label>
            <Input id="name" name="name" required autoComplete="name" className="h-11" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>{c.service}</Label>
              <Select items={items} value={service} onValueChange={(v) => v && setService(v as string)}>
                <SelectTrigger className="w-full data-[size=default]:h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {items.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium">{c.where}</legend>
              <div className="flex h-11 items-center gap-5">
                {(["shop", "villa"] as const).map((w) => (
                  <label key={w} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="where"
                      value={w}
                      checked={where === w}
                      onChange={() => setWhere(w)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    {w === "shop" ? c.atShop : c.atVilla}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          {where === "villa" && (
            <div className="grid gap-2">
              <Label htmlFor="place">{c.place}</Label>
              <Input id="place" name="place" required className="h-11" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="date">{c.date}</Label>
              <Input id="date" name="date" type="date" min={today} required className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">{c.time}</Label>
              <Input id="time" name="time" type="time" className="h-11" />
            </div>
            <div className="col-span-2 grid gap-2 sm:col-span-1">
              <Label htmlFor="people">{c.people}</Label>
              <Input id="people" name="people" type="number" min={1} defaultValue={1} className="h-11" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">{c.notes}</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" name="via" value="whatsapp" size="lg" className="w-full sm:w-fit">
              <BrandIcon path={siWhatsapp.path} /> {c.send}
            </Button>
            {business.email && (
              <Button type="submit" name="via" value="mail" variant="outline" size="lg" className="w-full bg-transparent sm:w-fit">
                <Mail /> {c.sendEmail}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{c.noStore}</p>
        </form>
      </div>
    </section>
  )
}
