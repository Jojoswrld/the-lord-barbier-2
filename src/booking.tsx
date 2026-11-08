import { useRef, useState } from "react"
import { format } from "date-fns"
import { enUS, es } from "date-fns/locale"
import { CalendarDays, Mail, Minus, Plus } from "lucide-react"
import { siWhatsapp } from "simple-icons"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"
import { business, shopServices, t, visitServices, type Lang } from "@/content"

type Where = "shop" | "villa"
type When = "morning" | "afternoon" | "any"

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] shrink-0 fill-current">
      <path d={siWhatsapp.path} />
    </svg>
  )
}

export function BookingSection({ lang }: { lang: Lang }) {
  const c = t[lang].book
  const dfLocale = lang === "es" ? es : enUS
  const all = [...shopServices, ...visitServices.filter((s) => s.id !== "villa")]
  const items = all.map((s) => ({ value: s.id, label: s.name[lang] }))

  const [service, setService] = useState("cut")
  const [where, setWhere] = useState<Where>("shop")
  const [date, setDate] = useState<Date | undefined>()
  const [dateOpen, setDateOpen] = useState(false)
  const [dateMissing, setDateMissing] = useState(false)
  const [when, setWhen] = useState<When>("any")
  const [people, setPeople] = useState(1)
  const dateButton = useRef<HTMLButtonElement>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateLabel = (d: Date) => format(d, lang === "es" ? "EEEE d 'de' MMMM" : "EEEE, MMMM d", { locale: dfLocale })

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!date) {
      setDateMissing(true)
      dateButton.current?.focus()
      return
    }
    const via = ((e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value
    const f = new FormData(e.currentTarget)
    const svc = all.find((s) => s.id === service)?.name[lang] ?? service
    const lines = [
      c.msgHello,
      `${c.name}: ${f.get("name")}`,
      `${c.service}: ${svc}`,
      `${c.where}: ${where === "shop" ? c.atShop : `${c.atVilla} (${f.get("place")})`}`,
      `${c.date}: ${dateLabel(date)}`,
      `${c.time}: ${c.times[when]}`,
      `${c.people}: ${people}`,
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

  return (
    <section id="book" className="dark scroll-mt-16 bg-background py-16 text-foreground md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.4fr] md:gap-16">
        {/* left: what this is and what happens after sending */}
        <div className="md:sticky md:top-28 md:self-start">
          <h2 className="text-4xl leading-tight sm:text-5xl">{c.title}</h2>
          <p className="mt-3 max-w-[40ch] text-muted-foreground">{c.lead}</p>
          <h3 className="mt-10 font-sans text-sm font-medium text-muted-foreground">{c.stepsTitle}</h3>
          <ol className="mt-4 space-y-4">
            {c.steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border font-heading text-sm font-bold tabular-nums">
                  {i + 1}
                </span>
                <span className="max-w-[38ch] pt-0.5 text-[0.95rem] leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-muted-foreground">
            WhatsApp{" "}
            <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-4">
              +506 {business.phoneDisplay}
            </a>
          </p>
        </div>

        {/* right: the form */}
        <form onSubmit={submit} noValidate={false}>
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="name">{c.name}</FieldLabel>
              <Input id="name" name="name" required autoComplete="name" className="h-11" />
            </Field>

            <Field>
              <FieldLabel>{c.service}</FieldLabel>
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
            </Field>

            <FieldSet>
              <FieldLegend variant="label">{c.where}</FieldLegend>
              <RadioGroup value={where} onValueChange={(v) => setWhere(v as Where)} className="grid gap-3 sm:grid-cols-2">
                {(["shop", "villa"] as const).map((w) => (
                  <FieldLabel key={w} htmlFor={`where-${w}`} className="w-full *:data-[slot=field]:min-h-11 *:data-[slot=field]:px-3.5">
                    <Field orientation="horizontal" className="items-center">
                      <RadioGroupItem value={w} id={`where-${w}`} />
                      <FieldContent>
                        <FieldTitle>{w === "shop" ? c.atShop : c.atVilla}</FieldTitle>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </FieldSet>

            {where === "villa" && (
              <Field>
                <FieldLabel htmlFor="place">{c.place}</FieldLabel>
                <Input id="place" name="place" required className="h-11" />
              </Field>
            )}

            <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr]">
              <Field data-invalid={dateMissing || undefined}>
                <FieldLabel htmlFor="date">{c.date}</FieldLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        ref={dateButton}
                        id="date"
                        type="button"
                        variant="outline"
                        aria-invalid={dateMissing || undefined}
                        className={cn("h-11 w-full justify-start bg-input/30 font-normal hover:bg-input/50", !date && "text-muted-foreground")}
                      />
                    }
                  >
                    <CalendarDays className="text-muted-foreground" />
                    <span className="first-letter:uppercase">{date ? dateLabel(date) : c.pickDate}</span>
                  </PopoverTrigger>
                  <PopoverContent className="dark w-auto bg-popover p-0 text-popover-foreground" align="start">
                    <Calendar
                      mode="single"
                      locale={dfLocale}
                      selected={date}
                      defaultMonth={date ?? today}
                      disabled={{ before: today }}
                      onSelect={(d) => {
                        setDate(d)
                        if (d) {
                          setDateMissing(false)
                          setDateOpen(false)
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {dateMissing && <FieldError>{c.dateError}</FieldError>}
              </Field>

              <Field>
                <FieldLabel id="people-label">{c.people}</FieldLabel>
                <div role="group" aria-labelledby="people-label" className="flex h-11 items-center rounded-[3px] border border-input bg-input/30">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={c.fewer}
                    disabled={people <= 1}
                    onClick={() => setPeople((p) => Math.max(1, p - 1))}
                    className="h-full rounded-none"
                  >
                    <Minus />
                  </Button>
                  <output aria-live="polite" className="flex-1 text-center text-base tabular-nums">
                    {people}
                  </output>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={c.more}
                    disabled={people >= 12}
                    onClick={() => setPeople((p) => Math.min(12, p + 1))}
                    className="h-full rounded-none"
                  >
                    <Plus />
                  </Button>
                </div>
              </Field>
            </div>

            <FieldSet>
              <FieldLegend variant="label">{c.time}</FieldLegend>
              <ToggleGroup
                value={[when]}
                onValueChange={(v) => v.length && setWhen(v[0] as When)}
                variant="outline"
                spacing={0}
                className="w-full"
              >
                {(["morning", "afternoon", "any"] as const).map((w) => (
                  <ToggleGroupItem
                    key={w}
                    value={w}
                    className="h-11 flex-1 data-[pressed]:bg-foreground data-[pressed]:text-background"
                  >
                    {c.times[w]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FieldSet>

            <Field>
              <FieldLabel htmlFor="notes">{c.notes}</FieldLabel>
              <Textarea id="notes" name="notes" rows={3} />
            </Field>

            <Field>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" name="via" value="whatsapp" size="lg" className="w-full sm:w-fit">
                  <WhatsAppIcon /> {c.send}
                </Button>
                {business.email && (
                  <Button type="submit" name="via" value="mail" variant="outline" size="lg" className="w-full bg-transparent sm:w-fit">
                    <Mail /> {c.sendEmail}
                  </Button>
                )}
              </div>
              <FieldDescription>{c.noStore}</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </section>
  )
}
