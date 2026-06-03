export const HOTEL = {
  name: 'Luma Mazury Hotel',
  location: 'Mikolajki, Mazury, Poland',
  rating: '4.9',
  reviews: '1,286',
  heroImage: 'https://images.unsplash.com/photo-1736195197354-7192bc9c5da3?auto=format&fit=crop&w=1800&q=84',
  mapImage: 'https://images.unsplash.com/photo-1756109187951-782aba864599?auto=format&fit=crop&w=1200&q=80'
};

export const ROOMS = [
  {
    id: 'lake-classic',
    name: 'Lake Classic',
    tagline: 'Compact lake-facing room for solo stays or couples.',
    price: 420,
    maxGuests: 2,
    capacity: '1-2 guests',
    beds: '1 queen bed',
    size: '28 m2',
    remaining: 6,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=82',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85'
    ],
    perks: ['Lake view', 'Breakfast option', 'Free cancellation']
  },
  {
    id: 'marina-terrace',
    name: 'Marina Terrace',
    tagline: 'Larger room with terrace seating near the marina.',
    price: 610,
    maxGuests: 3,
    capacity: '2-3 guests',
    beds: '1 king + daybed',
    size: '38 m2',
    remaining: 3,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=82',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85'
    ],
    perks: ['Private terrace', 'Welcome tea', 'Flexible dates']
  },
  {
    id: 'family-suite',
    name: 'Family Lake Suite',
    tagline: 'Separate lounge and sleeping space for family trips.',
    price: 890,
    maxGuests: 5,
    capacity: '4-5 guests',
    beds: '1 king + twin beds',
    size: '62 m2',
    remaining: 2,
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=82',
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85'
    ],
    perks: ['Family layout', 'Sauna credit', 'Kids welcome pack']
  }
];

export const ADD_ONS = [
  { id: 'breakfast', name: 'Mazury breakfast', detail: 'Daily regional breakfast for the room.', price: 75, perNight: true },
  { id: 'sauna', name: 'Private sauna hour', detail: 'One private lakeside sauna session.', price: 180, perNight: false },
  { id: 'parking', name: 'Secure parking', detail: 'Reserved parking for the stay.', price: 45, perNight: true },
  { id: 'kayak', name: 'Kayak rental', detail: 'Half-day kayak rental on the lake.', price: 120, perNight: false }
];

export const CUSTOMER_REVIEWS = [
  {
    name: 'Anna K.',
    trip: 'Family weekend',
    rating: '5.0',
    quote: 'The suite worked perfectly for our children, and the lake path was right outside the hotel.',
    stay: 'Family Lake Suite',
    date: 'May 2026'
  },
  {
    name: 'Marek S.',
    trip: 'Solo reset',
    rating: '4.8',
    quote: 'I booked the cheapest room and still got a calm lake view, good breakfast, and fast checkout.',
    stay: 'Lake Classic',
    date: 'April 2026'
  },
  {
    name: 'Julia and Tomek',
    trip: 'Anniversary',
    rating: '4.9',
    quote: 'Marina Terrace felt private without being too expensive. The recommendation was spot on.',
    stay: 'Marina Terrace',
    date: 'June 2026'
  }
];

export const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://www.facebook.com/lumamazuryhotel' },
  { name: 'Instagram', url: 'https://www.instagram.com/lumamazuryhotel' },
  { name: 'Tripadvisor', url: 'https://www.tripadvisor.com/' }
];

export const UNAVAILABLE_STAYS = [
  { roomId: 'lake-classic', from: '2026-07-18', to: '2026-07-22', reason: 'Sold out during lake festival weekend.' },
  { roomId: 'marina-terrace', from: '2026-07-20', to: '2026-07-21', reason: 'Terrace rooms are blocked for maintenance.' },
  { roomId: 'family-suite', from: '2026-07-14', to: '2026-07-17', reason: 'Family suites are already booked for these dates.' }
];

export const SECURITY_FEATURES = [
  {
    title: 'Tokenized card handling',
    detail: 'Production checkout should send card data directly to a PCI-compliant payment provider, never your server.'
  },
  {
    title: '3D Secure / SCA',
    detail: 'Require bank challenge flows for eligible European cards before confirming paid bookings.'
  },
  {
    title: 'Inventory locks',
    detail: 'Hold the selected room server-side for a short time during checkout to prevent double booking.'
  },
  {
    title: 'Secure app headers',
    detail: 'Use HTTPS, HSTS, CSP, CSRF protection, audit logs, and encrypted booking records.'
  }
];

export const HOTEL_DETAILS = [
  { title: 'Lake access', detail: 'Private pier, sunrise swimming, kayak launch, and a quiet forest trail from the garden.' },
  { title: 'Wellness', detail: 'Lakeside sauna, massage room, herbal tea bar, and evening fire pit reservations.' },
  { title: 'Guest rules', detail: 'Check-in from 15:00, checkout by 11:00, pets on request, family rooms available.' },
  { title: 'Travel', detail: 'Secure parking, EV charger, bike storage, and marina transfers for guests arriving by boat.' }
];

export const AVAILABILITY_NOTES = [
  { label: 'Peak dates', value: 'Jul 18-22', tone: 'busy' },
  { label: 'Best value', value: 'Weekdays', tone: 'good' },
  { label: 'Family demand', value: 'High', tone: 'warn' }
];

export const PORTFOLIO_NOTES = [
  { label: 'Architecture', value: 'Stateful React flow with data, validation, and pricing logic split into focused modules.' },
  { label: 'UX decisions', value: 'Room proposal engine, unavailable stays, add-ons, checkout validation, and confirmation state.' },
  { label: 'Responsive work', value: 'Desktop summary rail, tablet-safe grids, and mobile sticky total for checkout momentum.' },
  { label: 'Security thinking', value: 'Demo form backed by notes for tokenized payments, SCA, inventory locks, and secure headers.' }
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
