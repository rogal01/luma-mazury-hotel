import { ROOMS, UNAVAILABLE_STAYS } from '../data/hotel';

export const HOLD_DURATION_MS = 10 * 60 * 1000;

export function money(amount) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatHoldTime(milliseconds) {
  const safeMilliseconds = Math.max(0, milliseconds);
  const totalSeconds = Math.ceil(safeMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function nightsBetween(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const nights = Math.round((end - start) / 86400000);
  return Number.isFinite(nights) && nights > 0 ? nights : 1;
}

export function guestCount(stay) {
  return Math.max(1, Number(stay.adults || 0) + Number(stay.children || 0));
}

export function getUnavailableStay(roomId, stay) {
  return UNAVAILABLE_STAYS.find((blocked) => (
    blocked.roomId === roomId && rangesOverlap(stay.checkIn, stay.checkOut, blocked.from, blocked.to)
  ));
}

export function isRoomAvailable(roomId, stay) {
  return !getUnavailableStay(roomId, stay);
}

export function recommendRoom(stay) {
  const guests = guestCount(stay);
  const children = Number(stay.children || 0);
  const fittingRooms = ROOMS
    .filter((room) => room.maxGuests >= guests && isRoomAvailable(room.id, stay))
    .sort((a, b) => a.price - b.price);
  const cheapestFit = fittingRooms[0] ?? ROOMS[ROOMS.length - 1];

  if (guests <= 1) {
    return {
      room: cheapestFit,
      reason: 'Cheapest available room that still fits a solo lake stay.'
    };
  }

  if (guests >= 4 || children >= 2) {
    return {
      room: fittingRooms.find((room) => room.id === 'family-suite') ?? cheapestFit,
      reason: 'Best for a family because it has separate sleeping and lounge space.'
    };
  }

  if (guests === 3) {
    return {
      room: fittingRooms.find((room) => room.id === 'marina-terrace') ?? cheapestFit,
      reason: 'Extra bed and terrace comfort without paying for the family suite.'
    };
  }

  return {
    room: cheapestFit,
    reason: 'Most efficient available room for two guests.'
  };
}

export function calculateTotals({ room, nights, addOns, promo }) {
  const roomTotal = room.price * nights;
  const addOnTotal = addOns.reduce((sum, addOn) => sum + (addOn.perNight ? addOn.price * nights : addOn.price), 0);
  const taxable = roomTotal + addOnTotal;
  const taxes = Math.round(taxable * 0.08);
  const service = 60;
  const discount = promo.trim().toUpperCase() === 'MAZURY10' ? Math.round(taxable * 0.1) : 0;

  return {
    room: roomTotal,
    addOns: addOnTotal,
    taxes,
    service,
    discount,
    total: taxable + taxes + service - discount
  };
}

export function createConfirmation() {
  return `LMH-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function dateValue(date) {
  return new Date(`${date}T00:00:00`).getTime();
}

function rangesOverlap(startA, endA, startB, endB) {
  return dateValue(startA) < dateValue(endB) && dateValue(endA) > dateValue(startB);
}
