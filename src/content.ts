// All site copy and business details live here.
// TODO: confirm prices, durations and opening hours with the shop.

export type Lang = "en" | "es"

export const business = {
  name: "The Lord Barbier",
  since: 2020,
  phoneDisplay: "6413-8832",
  // Number taken from the shop's Instagram bio ("Citas: 64138832"); assumed to be on WhatsApp.
  whatsapp: "50664138832",
  // Instagram (@thelordbarbier) is inactive for now, so the site links to Facebook instead.
  email: "thelordbarbier07@hotmail.com" as string,
  facebook: "https://www.facebook.com/p/thelordbarbier-100083440836460/",
  mapEmbed:
    "https://www.google.com/maps?q=The+Lord+Barbier,+La+Fortuna,+San+Carlos,+Costa+Rica&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=The+Lord+Barbier+La+Fortuna+San+Carlos+Costa+Rica",
}

export type Service = {
  id: string
  name: Record<Lang, string>
  desc: Record<Lang, string>
  price: Record<Lang, string>
}

const tbd = { en: "₡ —", es: "₡ —" }

export const shopServices: Service[] = [
  {
    id: "cut",
    name: { en: "Classic Haircut", es: "Corte Clásico" },
    desc: { en: "Scissor or clipper cut, finished and styled.", es: "Corte a tijera o máquina, terminado y peinado." },
    price: tbd,
  },
  {
    id: "fade",
    name: { en: "Fade", es: "Degradado (Fade)" },
    desc: { en: "Low, mid, high, taper or burst fade, sharp line-up included.", es: "Fade bajo, medio, alto, taper o burst, con perfilado incluido." },
    price: tbd,
  },
  {
    id: "beard",
    name: { en: "Beard Trim & Shape", es: "Arreglo de Barba" },
    desc: { en: "Shape, line-up and hot towel.", es: "Forma, perfilado y toalla caliente." },
    price: tbd,
  },
  {
    id: "shave",
    name: { en: "Hot Towel Shave", es: "Afeitado con Toalla Caliente" },
    desc: { en: "Straight razor shave with hot towels and balm.", es: "Afeitado a navaja con toallas calientes y bálsamo." },
    price: tbd,
  },
  {
    id: "combo",
    name: { en: "Cut + Beard", es: "Corte + Barba" },
    desc: { en: "The full service, head to chin.", es: "El servicio completo, de la cabeza a la barba." },
    price: tbd,
  },
  {
    id: "kids",
    name: { en: "Kids' Cut", es: "Corte de Niño" },
    desc: { en: "For the young lords, under 12.", es: "Para los pequeños lores, menores de 12." },
    price: tbd,
  },
]

export const visitServices: Service[] = [
  {
    id: "villa",
    name: { en: "Villa & Hotel Visit", es: "Visita a Villa u Hotel" },
    desc: {
      en: "We bring the chair, tools and towels to where you're staying in the La Fortuna area.",
      es: "Llevamos silla, herramientas y toallas a donde te hospedes en la zona de La Fortuna.",
    },
    price: { en: "On request", es: "A consultar" },
  },
  {
    id: "group",
    name: { en: "Groups & Families", es: "Grupos y Familias" },
    desc: { en: "Several cuts in one visit. Ask for a group price.", es: "Varios cortes en una sola visita. Pregunta por precio de grupo." },
    price: { en: "On request", es: "A consultar" },
  },
  {
    id: "wedding",
    name: { en: "Weddings & Events", es: "Bodas y Eventos" },
    desc: { en: "The groom and his party, ready on the day, at your venue.", es: "El novio y sus acompañantes, listos el gran día, en tu lugar." },
    price: { en: "On request", es: "A consultar" },
  },
]

export const gallery = [
  { src: "/images/cut-side-part.jpg", alt: { en: "Side part with a skin fade", es: "Peinado de lado con fade" } },
  { src: "/images/cut-curly-fade.jpg", alt: { en: "Curly top with a low fade", es: "Rizos con fade bajo" } },
  { src: "/images/cut-burst-fade.jpg", alt: { en: "Burst fade on curly hair", es: "Burst fade en cabello rizado" } },
  { src: "/images/cut-kids-fade.jpg", alt: { en: "Kids' taper fade", es: "Fade para niño" } },
]

export const shopPhoto = {
  src: "/images/shop-interior.jpg",
  alt: { en: "Inside the shop in La Fortuna", es: "La barbería por dentro, en La Fortuna" },
}

export const t = {
  en: {
    nav: { services: "Services", work: "Recent cuts", visit: "Find us", book: "Book" },
    hero: {
      since: "Since",
      lead: "A classic barbershop in La Fortuna. Cuts, fades and beard work at the shop, or at your villa or hotel.",
      book: "Book on WhatsApp",
      services: "See services and prices",
      address: "25 m east of BCR, La Fortuna",
    },
    services: {
      title: "Services",
      intro: "Walk in or book ahead. For groups, weddings and villa visits, we come to you.",
      shop: "At the shop",
      visit: "At your villa or hotel",
      visitNote: "Visits are by appointment. Send us the date, the place and how many people.",
      priceNote: "Prices in colones. Ask us for current rates.",
    },
    work: { title: "Recent cuts", intro: "Straight from the chair. Tap a photo to see it in color.", more: "See more on Facebook" },
    visit: {
      title: "Find us",
      address: "Address",
      addressValue: "25 m east of Banco de Costa Rica (BCR), La Fortuna, San Carlos, Alajuela",
      phone: "Appointments",
      hours: "Hours",
      hoursValue: "Call or message us for today's hours.",
      directions: "Open in Google Maps",
      products: "We also sell pomades, beard oils and other grooming products.",
    },
    book: {
      title: "Book an appointment",
      lead: "Fill this in and WhatsApp opens with your request ready to send.",
      name: "Your name",
      service: "Service",
      where: "Where",
      atShop: "At the shop",
      atVilla: "At my villa or hotel",
      place: "Villa or hotel name",
      date: "Date",
      time: "Preferred time",
      people: "People",
      notes: "Notes (optional)",
      send: "Send request on WhatsApp",
      msgHello: "Hello! I'd like to book with The Lord Barbier.",
    },
    footer: "Classic barbershop in La Fortuna, San Carlos, since 2020.",
    menu: "Menu",
    contact: "Contact",
  },
  es: {
    nav: { services: "Servicios", work: "Cortes recientes", visit: "Ubicación", book: "Reservar" },
    hero: {
      since: "Desde",
      lead: "Una barbería clásica en La Fortuna. Cortes, fades y barba en el local, o en tu villa u hotel.",
      book: "Reservar por WhatsApp",
      services: "Ver servicios y precios",
      address: "25 m al este del BCR, La Fortuna",
    },
    services: {
      title: "Servicios",
      intro: "Ven sin cita o reserva antes. Para grupos, bodas y villas, vamos a ti.",
      shop: "En la barbería",
      visit: "En tu villa u hotel",
      visitNote: "Las visitas son con cita. Envíanos la fecha, el lugar y cuántas personas.",
      priceNote: "Precios en colones. Pregúntanos por las tarifas actuales.",
    },
    work: { title: "Cortes recientes", intro: "Recién salidos de la silla. Toca una foto para verla a color.", more: "Ver más en Facebook" },
    visit: {
      title: "Ubicación",
      address: "Dirección",
      addressValue: "25 m al este del Banco de Costa Rica (BCR), La Fortuna, San Carlos, Alajuela",
      phone: "Citas",
      hours: "Horario",
      hoursValue: "Llámanos o escríbenos para el horario de hoy.",
      directions: "Abrir en Google Maps",
      products: "También vendemos pomadas, aceites para barba y otros productos.",
    },
    book: {
      title: "Reserva una cita",
      lead: "Llena esto y se abre WhatsApp con tu solicitud lista para enviar.",
      name: "Tu nombre",
      service: "Servicio",
      where: "Dónde",
      atShop: "En la barbería",
      atVilla: "En mi villa u hotel",
      place: "Nombre de la villa u hotel",
      date: "Fecha",
      time: "Hora preferida",
      people: "Personas",
      notes: "Notas (opcional)",
      send: "Enviar solicitud por WhatsApp",
      msgHello: "¡Hola! Me gustaría reservar con The Lord Barbier.",
    },
    footer: "Barbería clásica en La Fortuna, San Carlos, desde 2020.",
    menu: "Menú",
    contact: "Contacto",
  },
} as const
