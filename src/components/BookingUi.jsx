import React, { useEffect, useState } from 'react';
import { ADD_ONS, AVAILABILITY_NOTES, HOTEL, SECURITY_FEATURES, UNAVAILABLE_STAYS } from '../data/hotel';
import { formatHoldTime, guestCount, money } from '../lib/booking';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Lock,
  User,
  CreditCard,
  Plus,
  Minus,
  X,
  Flame,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Stepper({ step }) {
  const steps = [
    { label: 'Termin & Pokój', icon: Calendar },
    { label: 'Dane Gości', icon: User },
    { label: 'Płatność & Finalizacja', icon: CreditCard }
  ];

  return (
    <div className="stepper" aria-label="Kroki rezerwacji">
      {steps.map(({ label, icon: Icon }, index) => (
        <span
          className={`step ${index === step ? 'active current' : index < step ? 'active completed' : ''}`}
          key={label}
        >
          <span className="step-num">
            {index < step ? <Check size={13} className="step-check" /> : index + 1}
          </span>
          <span className="step-text">{label}</span>
        </span>
      ))}
    </div>
  );
}

export function SearchBar({ stay, onChange, roomId }) {
  const [calOpen, setCalOpen] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const nights = Math.max(0, Math.round(
    (new Date(`${stay.checkOut}T00:00:00`) - new Date(`${stay.checkIn}T00:00:00`)) / 86400000
  ));
  const minCheckOut = stay.checkIn
    ? new Date(new Date(`${stay.checkIn}T00:00:00`).getTime() + 86400000).toISOString().split('T')[0]
    : today;

  const update = (key, value) => {
    const next = { ...stay, [key]: value };
    if (key === 'checkIn' && value >= stay.checkOut) {
      next.checkOut = new Date(new Date(`${value}T00:00:00`).getTime() + 86400000).toISOString().split('T')[0];
    }
    onChange(next);
  };

  return (
    <div className="search-panel-wrap">
      <div className="search-panel" aria-label="Wyszukiwarka dostępności">
        <label>
          <span>Przyjazd (Check-in)</span>
          <input
            type="date"
            min={today}
            value={stay.checkIn}
            onChange={(e) => update('checkIn', e.target.value)}
          />
        </label>
        <label>
          <span>Wyjazd (Check-out){nights > 0 ? ` · ${nights} ${nights === 1 ? 'noc' : nights < 5 ? 'noce' : 'nocy'}` : ''}</span>
          <input
            type="date"
            min={minCheckOut}
            value={stay.checkOut}
            onChange={(e) => update('checkOut', e.target.value)}
          />
        </label>
        <GuestPicker label="Dorośli" value={stay.adults} min={1} max={6} onChange={(v) => update('adults', v)} />
        <GuestPicker label="Dzieci" value={stay.children} min={0} max={4} onChange={(v) => update('children', v)} />
      </div>
      <button
        type="button"
        className="cal-toggle-btn"
        onClick={() => setCalOpen((o) => !o)}
        aria-expanded={calOpen}
      >
        <Calendar size={14} className="inline-icon" />
        {calOpen ? 'Ukryj kalendarz obłożenia' : 'Zobacz kalendarz dostępności i obłożenia'}
      </button>
      {calOpen && <AvailabilityCalendar stay={stay} roomId={roomId} />}
    </div>
  );
}

function GuestPicker({ label, value, min, max, onChange }) {
  return (
    <div className="guest-picker">
      <span className="guest-picker-label">{label}</span>
      <div className="guest-picker-controls">
        <button
          type="button"
          className="guest-picker-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Zmniejsz: ${label}`}
        >
          <Minus size={13} />
        </button>
        <span className="guest-picker-count">{value}</span>
        <button
          type="button"
          className="guest-picker-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Zwiększ: ${label}`}
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

function AvailabilityCalendar({ stay, roomId }) {
  const [displayDate, setDisplayDate] = useState(() => {
    const d = new Date(`${stay.checkIn}T00:00:00`);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const { year, month } = displayDate;
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startPad = (firstDayOfWeek + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  const blocked = UNAVAILABLE_STAYS.filter((b) => b.roomId === roomId);
  const isBlocked = (ds) => blocked.some((b) => ds >= b.from && ds < b.to);
  const isInRange = (ds) => stay.checkIn && stay.checkOut && ds > stay.checkIn && ds < stay.checkOut;
  const isEndpoint = (ds) => ds === stay.checkIn || ds === stay.checkOut;

  const cells = [
    ...Array.from({ length: startPad }, (_, i) => ({ key: `pad-${i}`, empty: true })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      return { key: ds, dateStr: ds };
    })
  ];

  const monthName = new Date(year, month).toLocaleString('pl-PL', { month: 'long', year: 'numeric' });
  const prev = () => setDisplayDate(({ year: y, month: m }) =>
    m === 0 ? { year: y - 1, month: 11 } : { year: y, month: m - 1 }
  );
  const next = () => setDisplayDate(({ year: y, month: m }) =>
    m === 11 ? { year: y + 1, month: 0 } : { year: y, month: m + 1 }
  );

  return (
    <div className="availability-cal">
      <div className="cal-header">
        <button type="button" className="cal-nav-btn" onClick={prev} aria-label="Poprzedni miesiąc">
          <ChevronLeft size={16} />
        </button>
        <span className="cal-title">{monthName}</span>
        <button type="button" className="cal-nav-btn" onClick={next} aria-label="Następny miesiąc">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="cal-weekdays">
        {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {cells.map(({ key, empty, dateStr }) => {
          if (empty) return <span key={key} className="cal-day empty" />;
          const classes = ['cal-day'];
          if (isBlocked(dateStr)) classes.push('blocked');
          else if (isEndpoint(dateStr)) classes.push('endpoint');
          else if (isInRange(dateStr)) classes.push('in-range');
          if (dateStr === todayStr) classes.push('today');
          return (
            <span
              key={key}
              className={classes.join(' ')}
              title={isBlocked(dateStr) ? 'Termin niedostępny (wyprzedany lub przegląd)' : 'Dostępny'}
            >
              {new Date(`${dateStr}T00:00:00`).getDate()}
            </span>
          );
        })}
      </div>
      <div className="cal-legend">
        <span className="legend-blocked">Wyprzedane / Blokada</span>
        <span className="legend-selected">Twój wybrany pobyt</span>
      </div>
    </div>
  );
}

function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [images.length, onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Galeria zdjęć apartamentu">
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Zamknij galerię">
          <X size={20} />
        </button>
        <button
          type="button"
          className="lightbox-nav prev"
          onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
          aria-label="Poprzednie zdjęcie"
        >
          <ChevronLeft size={22} />
        </button>
        <img src={images[current]} alt={`Zdjęcie apartamentu ${current + 1} z ${images.length}`} className="lightbox-img" />
        <button
          type="button"
          className="lightbox-nav next"
          onClick={() => setCurrent((c) => (c + 1) % images.length)}
          aria-label="Następne zdjęcie"
        >
          <ChevronRight size={22} />
        </button>
        <div className="lightbox-counter">{current + 1} / {images.length}</div>
        <div className="lightbox-dots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === current ? 'lb-dot active' : 'lb-dot'}
              onClick={() => setCurrent(i)}
              aria-label={`Przejdź do zdjęcia ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AvailabilityStrip() {
  return (
    <section className="availability-strip" aria-label="Wskaźniki obłożenia Mazur">
      {AVAILABILITY_NOTES.map((note) => (
        <article className={`availability-item ${note.tone}`} key={note.label}>
          <span>{note.label}</span>
          <strong>{note.value}</strong>
        </article>
      ))}
    </section>
  );
}

export function HoldTimer({ remaining, duration, onRenew }) {
  const isExpired = remaining <= 0;
  const isUrgent = remaining > 0 && remaining < 120000; // < 2 minutes
  const progress = `${Math.max(0, Math.min(100, (remaining / duration) * 100))}%`;

  let cardClasses = 'hold-card';
  if (isExpired) cardClasses += ' expired';
  else if (isUrgent) cardClasses += ' urgency-pulse';

  return (
    <section className={cardClasses} aria-live="polite">
      <div className="hold-copy">
        <div className="hold-header-row">
          <span className={`eyebrow ${isUrgent ? 'eyebrow-urgency' : ''}`}>
            {isExpired ? 'Blokada wygasła' : isUrgent ? 'Pilna blokada terminowa' : 'Gwarancja rezerwacji'}
          </span>
          {isUrgent && (
            <span className="urgency-badge">
              <Flame size={13} className="text-amber animate-bounce" />
              <span>Pozostało tylko {formatHoldTime(remaining)}</span>
            </span>
          )}
        </div>
        <strong>
          {isExpired ? 'Odnów blokadę, aby zachować cenę' : `Blokada pokoju aktywna: ${formatHoldTime(remaining)}`}
        </strong>
        <small>
          {isExpired
            ? 'Termin został zwolniony dla innych gości. Kliknij poniżej, aby odnowić 10-minutową blokadę.'
            : isUrgent
            ? 'Uwaga: Za chwilę termin wróci do ogólnej puli. Dokończ rezerwację lub przedłuż czas.'
            : 'Wybrany apartament jest tymczasowo zarezerwowany wyłącznie dla Ciebie na czas wypełniania formularza.'}
        </small>
      </div>
      <div className={`hold-meter ${isUrgent ? 'hold-meter-urgency' : ''}`} aria-hidden="true">
        <span style={{ width: progress }} />
      </div>
      <button type="button" className={`btn ${isUrgent ? 'primary' : 'secondary'}`} onClick={onRenew}>
        <Clock size={14} className="inline-icon" />
        Przedłuż blokadę o 10 min
      </button>
    </section>
  );
}

export function RoomProposal({ proposal, guests, nights, selected, onApply }) {
  return (
    <section className="proposal-card" aria-live="polite">
      <div>
        <span className="eyebrow-accent">Rekomendacja dla Twojej grupy</span>
        <h2>{proposal.room.name}</h2>
        <p>{proposal.reason}</p>
      </div>
      <div className="proposal-meta">
        <span>{guests} {guests === 1 ? 'gość' : guests < 5 ? 'gości' : 'gości'}</span>
        <strong>{money(proposal.room.price * nights)}</strong>
        <small>pobyt na {nights} {nights === 1 ? 'noc' : nights < 5 ? 'noce' : 'nocy'}</small>
      </div>
      <button type="button" className={selected ? 'btn secondary' : 'btn primary'} onClick={onApply}>
        {selected ? 'Wybrano rekomendację' : 'Wybierz rekomendowany apartament'}
      </button>
    </section>
  );
}

export function RoomCard({ room, selected, recommended, unavailable, nights, onSelect }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const classes = ['room-card'];
  if (selected) classes.push('selected');
  if (recommended) classes.push('recommended');
  if (unavailable) classes.push('unavailable');

  return (
    <article className={classes.join(' ')}>
      <div className="room-img-wrap">
        <img
          src={room.image}
          alt={`${room.name} w ${HOTEL.name}`}
          loading="lazy"
          onClick={() => setLightboxIndex(0)}
        />
        {room.images && room.images.length > 1 && (
          <button
            type="button"
            className="room-photos-btn"
            onClick={() => setLightboxIndex(0)}
          >
            Zobacz {room.images.length} zdjęć
          </button>
        )}
      </div>
      <div className="room-copy">
        <div>
          <div className="room-heading">
            <h3>{room.name}</h3>
            <div className="room-badges">
              {recommended && <span className="proposal-badge">Rekomendowany</span>}
              {unavailable && <span className="soldout-badge">Termin zajęty</span>}
              <span>Ostatnie {room.remaining} apartamenty</span>
            </div>
          </div>
          <p>{room.tagline}</p>
          {unavailable && <p className="availability-warning">{unavailable.reason}</p>}
        </div>

        <div className="room-meta">
          <span>{room.capacity}</span>
          <span>{room.beds}</span>
          <span>{room.size}</span>
        </div>

        <div className="perk-list">
          {room.perks.map((perk) => <span key={perk}>{perk}</span>)}
        </div>

        {/* Dynamic Synergy Hint */}
        {room.pairedDiscountNote && (
          <div className="room-synergy-hint">
            <Sparkles size={13} className="text-gold" />
            <span>{room.pairedDiscountNote}</span>
          </div>
        )}

        <div className="room-action">
          <div>
            <strong>{money(room.price)}</strong>
            <small>za noc / {money(room.price * nights)} łącznie za pobyt</small>
          </div>
          <button
            type="button"
            disabled={Boolean(unavailable)}
            className={selected ? 'btn primary' : 'btn secondary'}
            onClick={() => onSelect(room.id)}
          >
            {selected ? 'Wybrany apartament' : 'Wybierz ten apartament'}
          </button>
        </div>
      </div>

      {lightboxIndex !== null && room.images && (
        <Lightbox
          images={room.images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </article>
  );
}

export function AddOnCard({ addOn, selected, nights, isSynergy, onToggle }) {
  const price = addOn.perNight ? addOn.price * nights : addOn.price;

  return (
    <label className={`addon-card ${selected ? 'selected' : ''} ${isSynergy ? 'is-synergy-match' : ''}`}>
      <input type="checkbox" checked={selected} onChange={() => onToggle(addOn.id)} />
      <div className="addon-body">
        <div className="addon-header">
          <strong>{addOn.name}</strong>
          {addOn.badge && <span className="addon-badge-pill">{addOn.badge}</span>}
          {isSynergy && <span className="synergy-match-badge"><Sparkles size={11} /> Rekomendacja do pokoju</span>}
        </div>
        <small>{addOn.detail}</small>
      </div>
      <b className="addon-price">{money(price)}</b>
    </label>
  );
}

export function Field({ label, value, onChange, type = 'text', placeholder = '', required = true, error = '' }) {
  return (
    <label className={error ? 'field has-error' : 'field'}>
      <span>{label}</span>
      <input
        required={required}
        aria-invalid={Boolean(error)}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}

export function GuestForm({ guest, errors, onChange }) {
  const update = (key, value) => onChange({ ...guest, [key]: value });

  return (
    <section className="panel">
      <div className="panel-title">
        <span>Dane rezerwacji</span>
        <h2>Kto będzie naszym Gościem?</h2>
      </div>
      <div className="form-grid">
        <Field label="Imię" value={guest.firstName} placeholder="np. Jan" error={errors.firstName} onChange={(value) => update('firstName', value)} />
        <Field label="Nazwisko" value={guest.lastName} placeholder="np. Kowalski" error={errors.lastName} onChange={(value) => update('lastName', value)} />
        <Field label="Adres e-mail" type="email" value={guest.email} placeholder="jan.kowalski@example.com" error={errors.email} onChange={(value) => update('email', value)} />
        <Field label="Numer telefonu" type="tel" value={guest.phone} placeholder="+48 501 234 567" error={errors.phone} onChange={(value) => update('phone', value)} />
      </div>
      <label className="field full">
        <span>Dodatkowe życzenia i uwagi do przyjazdu</span>
        <textarea
          value={guest.requests}
          placeholder="Opcjonalnie: orientacyjna godzina przyjazdu, alergie pokarmowe, preferencje poduszek lub przygotowanie łóżeczka dziecięcego."
          onChange={(event) => update('requests', event.target.value)}
        />
        <small className="field-help">Nasz zespół recepcji przygotuje apartament dokładnie według Twoich wytycznych.</small>
      </label>
    </section>
  );
}

export function PaymentForm({ payment, errors, onChange }) {
  const update = (key, value) => onChange({ ...payment, [key]: value });

  return (
    <section className="panel">
      <div className="panel-title">
        <span>Bezpieczna finalizacja</span>
        <h2>Metoda płatności i gwarancja</h2>
      </div>
      <div className="payment-strip">
        <div className="payment-strip-icon">
          <ShieldCheck size={18} className="text-emerald" />
        </div>
        <div>
          <span>Środowisko Demonstracyjne</span>
          <strong>Żadna rzeczywista karta płatnicza nie zostanie obciążona</strong>
        </div>
      </div>
      <div className="form-grid">
        <Field label="Imię i nazwisko na karcie" value={payment.cardName} placeholder="JAN KOWALSKI" error={errors.cardName} onChange={(value) => update('cardName', value)} />
        <Field label="Numer karty płatniczej" value={payment.cardNumber} placeholder="4242 4242 4242 4242" error={errors.cardNumber} onChange={(value) => update('cardNumber', value)} />
        <Field label="Data ważności" value={payment.expiry} placeholder="08/28" error={errors.expiry} onChange={(value) => update('expiry', value)} />
        <Field label="Kod CVC / CVV" value={payment.cvc} placeholder="123" error={errors.cvc} onChange={(value) => update('cvc', value)} />
        <Field label="Kod pocztowy rozliczeniowy" value={payment.billingZip} placeholder="11-730" error={errors.billingZip} onChange={(value) => update('billingZip', value)} />
      </div>
      <label className="terms-row">
        <input type="checkbox" checked={payment.agree} onChange={(event) => update('agree', event.target.checked)} />
        <span>Akceptuję warunki pobytu, politykę anulacji do 48h przed przyjazdem oraz demonstracyjne warunki rezerwacji Luma Mazury.</span>
      </label>
      {errors.agree && <div className="field-error">{errors.agree}</div>}
      <SecurityPanel />
    </section>
  );
}

export function BookingSummary({
  stay,
  room,
  proposedRoom,
  selectedUnavailable,
  nights,
  selectedAddOns,
  totals,
  step,
  holdRemaining,
  holdDuration,
  onDetails,
  onCheckout,
  onBook,
  onRenewHold,
  error
}) {
  const guests = guestCount(stay);
  const hasDifferentProposal = proposedRoom && proposedRoom.id !== room.id;
  const holdExpired = holdRemaining <= 0;
  const isUrgent = holdRemaining > 0 && holdRemaining < 120000;

  return (
    <aside className="summary">
      <div className={`summary-card ${isUrgent ? 'summary-card-urgent' : ''}`}>
        <div className="summary-top">
          <div>
            <span className="eyebrow">Twój wybrany pobyt</span>
            <h2>{room.name}</h2>
            <p>{HOTEL.location}</p>
          </div>
          <span className={`summary-timer ${holdExpired ? 'expired' : isUrgent ? 'urgency' : ''}`}>
            {holdExpired ? 'Wygasła' : formatHoldTime(holdRemaining)}
          </span>
        </div>

        <div className="summary-dates">
          <div>
            <span>Przyjazd</span>
            <strong>{stay.checkIn}</strong>
          </div>
          <div>
            <span>Wyjazd</span>
            <strong>{stay.checkOut}</strong>
          </div>
        </div>

        <div className="summary-row">
          <span>{nights} {nights === 1 ? 'noc' : nights < 5 ? 'noce' : 'nocy'} / {guests} {guests === 1 ? 'gość' : 'gości'}</span>
          <strong>{money(totals.room)}</strong>
        </div>
        <div className="summary-row">
          <span>Pakiety & Atrakcje</span>
          <strong>{money(totals.addOns)}</strong>
        </div>
        <div className="summary-row">
          <span>Podatek VAT (8%) i obsługa</span>
          <strong>{money(totals.taxes + totals.service)}</strong>
        </div>
        {totals.discount > 0 && (
          <div className="summary-row discount">
            <span>Rabat z kodem promocyjnym</span>
            <strong>-{money(totals.discount)}</strong>
          </div>
        )}

        <div className="summary-total">
          <span>Łącznie do zapłaty</span>
          <strong>{money(totals.total)}</strong>
        </div>

        {selectedAddOns.length > 0 && (
          <div className="mini-list">
            {selectedAddOns.map((addOn) => <span key={addOn.id}>{addOn.name}</span>)}
          </div>
        )}

        {hasDifferentProposal && (
          <div className="summary-note">
            Rekomendowany dla tej liczby osób: <strong>{proposedRoom.name}</strong>
          </div>
        )}

        {selectedUnavailable && (
          <div className="error-box">
            Ten apartament jest niedostępny w wybranym terminie. {selectedUnavailable.reason}
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        <div className={`summary-hold ${isUrgent ? 'summary-hold-urgent' : ''}`}>
          <div>
            <span>Gwarancja blokady terminu</span>
            <strong>{holdExpired ? 'Wymaga odnowienia' : `Pozostało ${formatHoldTime(holdRemaining)}`}</strong>
          </div>
          <div className="summary-hold-meter" aria-hidden="true">
            <span style={{ width: `${Math.max(0, Math.min(100, (holdRemaining / holdDuration) * 100))}%` }} />
          </div>
        </div>

        {holdExpired && <button type="button" className="btn secondary wide" onClick={onRenewHold}>Odnów blokadę terminu</button>}
        {!holdExpired && step === 0 && <button type="button" className="btn primary wide" onClick={onDetails}>Przejdź do danych gości</button>}
        {!holdExpired && step === 1 && <button type="button" className="btn primary wide" onClick={onCheckout}>Przejdź do płatności</button>}
        {!holdExpired && step === 2 && <button type="button" className="btn primary wide" onClick={onBook}>Zarezerwuj pobyt bezpośrednio</button>}
      </div>
    </aside>
  );
}

export function MobileBookingBar({ room, totals, step, holdRemaining, onDetails, onCheckout, onBook, onRenewHold }) {
  const handlers = [onDetails, onCheckout, onBook];
  const labels = ['Dane gości', 'Płatność', 'Rezerwuj'];
  const holdExpired = holdRemaining <= 0;
  const isUrgent = holdRemaining > 0 && holdRemaining < 120000;

  return (
    <div className={`mobile-booking-bar ${isUrgent ? 'mobile-bar-urgent' : ''}`}>
      <div>
        <span>{holdExpired ? 'Blokada wygasła' : `${room.name} · ${formatHoldTime(holdRemaining)}`}</span>
        <strong>{money(totals.total)}</strong>
      </div>
      <button
        type="button"
        className={holdExpired ? 'btn secondary' : 'btn primary'}
        onClick={holdExpired ? onRenewHold : handlers[step]}
      >
        {holdExpired ? 'Odnów' : labels[step]}
      </button>
    </div>
  );
}

function SecurityPanel() {
  return (
    <section className="security-panel">
      <div>
        <span className="eyebrow-accent">Standardy Bezpieczeństwa</span>
        <h3>Klasa korporacyjna ochrony transakcji</h3>
      </div>
      <div className="security-grid">
        {SECURITY_FEATURES.map((feature) => (
          <article key={feature.title}>
            <strong>{feature.title}</strong>
            <p>{feature.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CheckoutTrustRail() {
  const items = [
    'Gwarancja bezpiecznej rezerwacji',
    'Szyfrowane połączenie TLS 1.3',
    'Autonomiczna blokada dostępności',
    'Bezpośrednia opieka recepcji 24/7'
  ];

  return (
    <section className="trust-rail" aria-label="Sygnały zaufania rezerwacji">
      {items.map((item) => (
        <span key={item}>
          <ShieldCheck size={14} className="text-forest inline-icon" />
          {item}
        </span>
      ))}
    </section>
  );
}

export function AddOnsPanel({ selectedAddOns, nights, selectedRoomId, onToggle }) {
  const currentRoom = selectedRoomId ? ADD_ONS : ADD_ONS;
  const pairedAddOnId = selectedRoomId === 'lake-classic' ? 'sauna' : selectedRoomId === 'marina-terrace' ? 'kayak' : 'breakfast';
  const pairedAddOn = ADD_ONS.find((a) => a.id === pairedAddOnId);

  return (
    <section className="panel">
      <div className="panel-title">
        <span>Doświadczenia & Pakiety</span>
        <h2>Wzbogać swój pobyt nad Jeziorem Czos</h2>
      </div>

      {/* Add-on Synergy Pairing Box */}
      {pairedAddOn && (
        <motion.div
          className="synergy-pairing-box"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="synergy-icon-wrap">
            <Sparkles size={20} className="text-gold" />
          </div>
          <div className="synergy-copy">
            <span className="synergy-tag">Rekomendowane Dobranie do Twojego Apartamentu</span>
            <strong>{pairedAddOn.name}</strong>
            <p>{pairedAddOn.detail}</p>
          </div>
          <button
            type="button"
            className={`btn ${selectedAddOns.includes(pairedAddOn.id) ? 'secondary' : 'primary'} sm`}
            onClick={() => onToggle(pairedAddOn.id)}
          >
            {selectedAddOns.includes(pairedAddOn.id) ? 'Dodano do pobytu ✓' : `Dodaj pakiet (${money(pairedAddOn.perNight ? pairedAddOn.price * nights : pairedAddOn.price)})`}
          </button>
        </motion.div>
      )}

      <div className="addon-grid">
        {ADD_ONS.map((addOn) => (
          <AddOnCard
            key={addOn.id}
            addOn={addOn}
            nights={nights}
            isSynergy={addOn.id === pairedAddOnId}
            selected={selectedAddOns.includes(addOn.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
