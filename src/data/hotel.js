export const HOTEL = {
  name: 'Luma Mazury Hotel & Spa',
  tagline: 'Kameralny luksus nad brzegiem Jeziora Czos',
  location: 'Mikołajki, Mazury, Polska',
  coordinates: "53°48'N 21°34'E",
  rating: '4.98',
  reviews: '1 286',
  heroImage: 'https://images.unsplash.com/photo-1736195197354-7192bc9c5da3?auto=format&fit=crop&w=1800&q=84',
  mapImage: 'https://images.unsplash.com/photo-1756109187951-782aba864599?auto=format&fit=crop&w=1200&q=80',
  phone: '+48 87 732 10 00',
  email: 'rezerwacje@lumamazury.pl',
  address: 'ul. Spacerowa 14, 11-730 Mikołajki, Polska'
};

export const ROOMS = [
  {
    id: 'lake-classic',
    name: 'Apartament Classic z Widokiem na Jezioro Czos',
    tagline: 'Kameralny apartament z panoramicznym oknem na taflę jeziora, idealny na spokojny reset lub pobyt we dwoje.',
    price: 420,
    maxGuests: 2,
    capacity: '1–2 gości',
    beds: '1 łóżko king-size (180 cm)',
    size: '28 m²',
    remaining: 4,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=82',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85'
    ],
    perks: ['Widok na Jezioro Czos', 'Opcja śniadań z mazurskich ryb', 'Bezpłatne odwołanie do 48h przed'],
    pairedAddOnId: 'sauna',
    pairedDiscountNote: 'Goście tego apartamentu najczęściej dobierają: Prywatny seans w saunie na pomoście (-15%)'
  },
  {
    id: 'marina-terrace',
    name: 'Marina Terrace z Prywatnym Tarasem i Jacuzzi',
    tagline: 'Przestronny apartament z bezpośrednim wyjściem na prywatny taras widokowy, zewnętrznym jacuzzi i widokiem na marinę.',
    price: 610,
    maxGuests: 3,
    capacity: '2–3 gości',
    beds: '1 łóżko king-size + leżanka',
    size: '38 m²',
    remaining: 3,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=82',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85'
    ],
    perks: ['Prywatny taras z jacuzzi', 'Powitalny zestaw naparów ziołowych', 'Elastyczne zameldowanie'],
    pairedAddOnId: 'kayak',
    pairedDiscountNote: 'Goście tego apartamentu najczęściej dobierają: Kajaki wyprawowe i SUP o poranku (-20%)'
  },
  {
    id: 'family-suite',
    name: 'Rodzinny Apartament Mazurski Suite z Salonem Kominkowym',
    tagline: 'Dedykowany dla rodzin i grup: dwie niezależne strefy sypialne, salon z kominkiem na drewno i wyjście do ogrodu.',
    price: 890,
    maxGuests: 5,
    capacity: '4–5 gości',
    beds: '1 łóżko king-size + 2 łóżka pojedyncze + sofa',
    size: '62 m²',
    remaining: 2,
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=82',
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85'
    ],
    perks: ['Salon kominkowy z drewnem', 'Kredyt na strefę SPA & Wellness', 'Pakiet powitalny dla najmłodszych'],
    pairedAddOnId: 'breakfast',
    pairedDiscountNote: 'Goście tego apartamentu najczęściej dobierają: Pełny bufet mazurskich śniadań z rybami'
  }
];

export const ADD_ONS = [
  {
    id: 'breakfast',
    name: 'Śniadanie mazurskie ze świeżych ryb i produktów wiejskich',
    detail: 'Codzienny bufet regionalny: wędzone sielawy, sery zagrodowe, pieczywo rzemieślnicze i miody z mazurskich pasiek.',
    price: 75,
    perNight: true,
    badge: 'Popularne'
  },
  {
    id: 'sauna',
    name: 'Prywatny seans w saunie fińskiej na pomoście o zachodzie słońca',
    detail: '60-minutowy ekskluzywny seans z bezpośrednim zejściem do czystych wód Jeziora Czos i aromaterapią sosnową.',
    price: 180,
    perNight: false,
    badge: 'Rekomendacja SPA'
  },
  {
    id: 'parking',
    name: 'Monitorowane miejsce parkingowe z ładowarką EV (Type 2)',
    detail: 'Gwarantowane miejsce postojowe na zamykanym terenie hotelu z bezpłatnym ładowaniem pojazdów elektrycznych.',
    price: 45,
    perNight: true,
    badge: 'Eko'
  },
  {
    id: 'kayak',
    name: 'Wypożyczenie kajaków wyprawowych i desek SUP (pół dnia)',
    detail: 'Kompletny sprzęt z kamizelkami asekuracyjnymi i mapą najcichszych zatok i trzcinowisk Jeziora Czos.',
    price: 120,
    perNight: false,
    badge: 'Aktywnie'
  }
];

export const CUSTOMER_REVIEWS = [
  {
    name: 'Anna & Piotr Kotlewscy',
    trip: 'Pobyt rodzinny · Warszawa',
    rating: '5.0',
    quote: 'Apartament Rodzinny z kominkiem przerósł nasze oczekiwania. Ścieżka wzdłuż Jeziora Czos zaczyna się dosłownie za furtką ogrodu, a poranne śniadanie ze świeżą sielawą było wybitne.',
    stay: 'Rodzinny Apartament Mazurski Suite',
    date: 'Czerwiec 2026'
  },
  {
    name: 'Marek Szymański',
    trip: 'Weekendowy reset solo · Gdańsk',
    rating: '4.9',
    quote: 'Cisza, bezkresna tafla jeziora i genialna sauna na pomoście. Proces rezerwacji bezpośredniej był błyskawiczny, a obsługa zadbała o każdy detal mojego przyjazdu.',
    stay: 'Apartament Classic z Widokiem',
    date: 'Maj 2026'
  },
  {
    name: 'Julia & Tomasz Włodarczyk',
    trip: 'Rocznica ślubu · Poznań',
    rating: '5.0',
    quote: 'Marina Terrace z jacuzzi pod gwiazdami to absolutny majstersztywk. Widok na zachodzące słońce nad Mikołajkami zapamiętamy na bardzo długo.',
    stay: 'Marina Terrace z Jacuzzi',
    date: 'Lipiec 2026'
  }
];

export const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://www.facebook.com/lumamazuryhotel' },
  { name: 'Instagram', url: 'https://www.instagram.com/lumamazuryhotel' },
  { name: 'Tripadvisor', url: 'https://www.tripadvisor.com/' }
];

export const UNAVAILABLE_STAYS = [
  {
    roomId: 'lake-classic',
    from: '2026-07-18',
    to: '2026-07-22',
    reason: 'Wszystkie apartamenty wyprzedane podczas Festiwalu Piosenki Żeglarskiej.'
  },
  {
    roomId: 'marina-terrace',
    from: '2026-07-20',
    to: '2026-07-21',
    reason: 'Termin zarezerwowany na cykliczny przegląd strefy wellness i jacuzzi.'
  },
  {
    roomId: 'family-suite',
    from: '2026-07-14',
    to: '2026-07-17',
    reason: 'Apartamenty rodzinne w tym terminie zostały już w pełni zarezerwowane.'
  }
];

export const SECURITY_FEATURES = [
  {
    title: 'Tokenizacja płatności PCI-DSS',
    detail: 'Dane karty płatniczej są szyfrowane bezpośrednio przez certyfikowanego operatora płatności (Stripe/PayU Level 1).'
  },
  {
    title: 'Uwierzytelnienie 3D Secure / SCA',
    detail: 'Wymagane silne uwierzytelnienie bankowe dla kart europejskich, gwarantujące pełną ochronę przed nieautoryzowanym obciążeniem.'
  },
  {
    title: 'Tymczasowa blokada dostępności',
    detail: 'Wybrany apartament jest automatycznie blokowany w czasie realizacji rezerwacji, zapobiegając podwójnym rezerwacjom.'
  },
  {
    title: 'Szyfrowanie i ochrona RODO',
    detail: 'Protokół TLS 1.3, nagłówki CSP, HSTS, rejestr zdarzeń i bezpieczne przechowywanie danych gości zgodnie z RODO.'
  }
];

export const HOTEL_DETAILS = [
  {
    title: 'Dostęp do Jeziora Czos & Plaża',
    detail: 'Prywatny pomost widokowy, bezpieczne kąpielisko, wypożyczalnia sprzętu wodnego oraz zaciszna ścieżka leśna wzdłuż linii brzegowej.'
  },
  {
    title: 'Rytuały Wellness & SPA',
    detail: 'Panoramiczna sauna fińska bezpośrednio na pomoście, gabinety masaży relaksacyjnych, napary ziołowe i wieczorne ogniska z widokiem na wodę.'
  },
  {
    title: 'Praktyczne informacje dla Gości',
    detail: 'Zameldowanie od godziny 15:00, wymeldowanie do 11:00. Pobyt z pupilami możliwy po wcześniejszym zgłoszeniu.'
  },
  {
    title: 'Marina i dojazd',
    detail: 'Monitorowany parking z ładowarkami EV, rowerownia oraz możliwość cumowania jachtów i motorówek w prywatnej marinie hotelowej.'
  }
];

export const AVAILABILITY_NOTES = [
  { label: 'Szczyt sezonu', value: '18–22 Lipca', tone: 'busy' },
  { label: 'Najlepsza oferta', value: 'Dni powszednie', tone: 'good' },
  { label: 'Dostępność rodzinna', value: 'Ostatnie 2 apartamenty', tone: 'warn' }
];

export const PORTFOLIO_NOTES = [
  {
    label: 'Architektura Kodu',
    value: 'Stanowy silnik rezerwacyjny React z rozbiciem na moduły kalkulacyjne, walidację Luhna i responsywną estetykę editorial.'
  },
  {
    label: 'Decyzje UX & Design Spells',
    value: 'Dynamiczny radar pogodowy Jeziora Czos, pulsujący timer hold, kojący pejzaż dźwiękowy fal oraz konfetti po udanej rezerwacji.'
  },
  {
    label: 'Responsywność i Standardy',
    value: 'Gwarancja stabilności min-h-[100dvh], brak przeskoków viewportu na iOS, floating mobile checkout bar i Bento grid.'
  },
  {
    label: 'Zgodność Prawna RODO',
    value: 'Wdrożony standard RODO z równorzędnymi przyciskami zgód, granularnym panelem i podpisem wykonawcy Rogal Studio.'
  }
];

export const INITIAL_STAY = {
  checkIn: '2026-07-14',
  checkOut: '2026-07-17',
  adults: 2,
  children: 0,
  promo: ''
};

export const INITIAL_GUEST = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  requests: ''
};

export const INITIAL_PAYMENT = {
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  billingZip: '',
  agree: false
};
