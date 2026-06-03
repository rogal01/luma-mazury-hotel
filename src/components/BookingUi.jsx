import { useEffect, useState } from 'react';
import { ADD_ONS, AVAILABILITY_NOTES, HOTEL, SECURITY_FEATURES, UNAVAILABLE_STAYS } from '../data/hotel';
import { formatHoldTime, guestCount, money } from '../lib/booking';

export function Stepper({ step }) {
  const steps = ['Stay', 'Details', 'Checkout'];

  return (
    <div className="stepper" aria-label="Booking progress">
      {steps.map((label, index) => (
        <span className={index <= step ? 'step active' : 'step'} key={label}>
          <span>{index + 1}</span>
          {label}
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
      <div className="search-panel" aria-label="Search availability">
        <label>
          <span>Check in</span>
          <input type="date" min={today} value={stay.checkIn} onChange={(e) => update('checkIn', e.target.value)} />
        </label>
        <label>
          <span>Check out{nights > 0 ? ` · ${nights} night${nights !== 1 ? 's' : ''}` : ''}</span>
          <input type="date" min={minCheckOut} value={stay.checkOut} onChange={(e) => update('checkOut', e.target.value)} />
        </label>
        <GuestPicker label="Adults" value={stay.adults} min={1} max={6} onChange={(v) => update('adults', v)} />
        <GuestPicker label="Children" value={stay.children} min={0} max={4} onChange={(v) => update('children', v)} />
      </div>
      <button
        type="button"
        className="cal-toggle-btn"
        onClick={() => setCalOpen((o) => !o)}
        aria-expanded={calOpen}
      >
        {calOpen ? 'Hide calendar' : 'View availability calendar'}
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
          aria-label={`Decrease ${label}`}
        >−</button>
        <span className="guest-picker-count">{value}</span>
        <button
          type="button"
          className="guest-picker-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >+</button>
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

  const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const prev = () => setDisplayDate(({ year: y, month: m }) =>
    m === 0 ? { year: y - 1, month: 11 } : { year: y, month: m - 1 }
  );
  const next = () => setDisplayDate(({ year: y, month: m }) =>
    m === 11 ? { year: y + 1, month: 0 } : { year: y, month: m + 1 }
  );

  return (
    <div className="availability-cal">
      <div className="cal-header">
        <button type="button" className="cal-nav-btn" onClick={prev} aria-label="Previous month">‹</button>
        <span>{monthName}</span>
        <button type="button" className="cal-nav-btn" onClick={next} aria-label="Next month">›</button>
      </div>
      <div className="cal-weekdays">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}
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
            <span key={key} className={classes.join(' ')} title={isBlocked(dateStr) ? 'Unavailable' : ''}>
              {new Date(`${dateStr}T00:00:00`).getDate()}
            </span>
          );
        })}
      </div>
      <div className="cal-legend">
        <span className="legend-blocked">Unavailable</span>
        <span className="legend-selected">Your stay</span>
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
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Room photo gallery">
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close gallery">✕</button>
        <button
          type="button"
          className="lightbox-nav prev"
          onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
          aria-label="Previous photo"
        >‹</button>
        <img src={images[current]} alt={`Room photo ${current + 1} of ${images.length}`} className="lightbox-img" />
        <button
          type="button"
          className="lightbox-nav next"
          onClick={() => setCurrent((c) => (c + 1) % images.length)}
          aria-label="Next photo"
        >›</button>
        <div className="lightbox-counter">{current + 1} / {images.length}</div>
        <div className="lightbox-dots">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === current ? 'lb-dot active' : 'lb-dot'}
              onClick={() => setCurrent(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AvailabilityStrip() {
  return (
    <section className="availability-strip" aria-label="Availability highlights">
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
  const progress = `${Math.max(0, Math.min(100, (remaining / duration) * 100))}%`;

  return (
    <section className={isExpired ? 'hold-card expired' : 'hold-card'} aria-live="polite">
      <div className="hold-copy">
        <span className="eyebrow">{isExpired ? 'Hold expired' : 'Room hold'}</span>
        <strong>{isExpired ? 'Renew to keep checking out' : `${formatHoldTime(remaining)} left`}</strong>
        <small>{isExpired ? 'The room is no longer reserved for this demo checkout.' : 'Your selected room is temporarily reserved while you finish booking.'}</small>
      </div>
      <div className="hold-meter" aria-hidden="true">
        <span style={{ width: progress }} />
      </div>
      <button type="button" className="btn secondary" onClick={onRenew}>
        Renew hold
      </button>
    </section>
  );
}

export function RoomProposal({ proposal, guests, nights, selected, onApply }) {
  return (
    <section className="proposal-card" aria-live="polite">
      <div>
        <span className="eyebrow">Proposed room</span>
        <h2>{proposal.room.name}</h2>
        <p>{proposal.reason}</p>
      </div>
      <div className="proposal-meta">
        <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
        <strong>{money(proposal.room.price * nights)}</strong>
        <small>{nights} night stay</small>
      </div>
      <button type="button" className={selected ? 'btn secondary' : 'btn primary'} onClick={onApply}>
        {selected ? 'Using proposal' : 'Use proposed room'}
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
          alt={`${room.name} at ${HOTEL.name}`}
          loading="lazy"
          onClick={() => setLightboxIndex(0)}
        />
        {room.images && room.images.length > 1 && (
          <button
            type="button"
            className="room-photos-btn"
            onClick={() => setLightboxIndex(0)}
          >
            View {room.images.length} photos
          </button>
        )}
      </div>
      <div className="room-copy">
        <div>
          <div className="room-heading">
            <h3>{room.name}</h3>
            <div className="room-badges">
              {recommended && <span className="proposal-badge">Proposed</span>}
              {unavailable && <span className="soldout-badge">Unavailable</span>}
              <span>{room.remaining} left</span>
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

        <div className="room-action">
          <div>
            <strong>{money(room.price)}</strong>
            <small>per night / {money(room.price * nights)} stay</small>
          </div>
          <button type="button" disabled={Boolean(unavailable)} className={selected ? 'btn primary' : 'btn secondary'} onClick={() => onSelect(room.id)}>
            {selected ? 'Selected' : 'Select room'}
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

export function AddOnCard({ addOn, selected, nights, onToggle }) {
  const price = addOn.perNight ? addOn.price * nights : addOn.price;

  return (
    <label className={selected ? 'addon-card selected' : 'addon-card'}>
      <input type="checkbox" checked={selected} onChange={() => onToggle(addOn.id)} />
      <span>
        <strong>{addOn.name}</strong>
        <small>{addOn.detail}</small>
      </span>
      <b>{money(price)}</b>
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
        <span>Guest details</span>
        <h2>Who is checking in?</h2>
      </div>
      <div className="form-grid">
        <Field label="First name" value={guest.firstName} error={errors.firstName} onChange={(value) => update('firstName', value)} />
        <Field label="Last name" value={guest.lastName} error={errors.lastName} onChange={(value) => update('lastName', value)} />
        <Field label="Email" type="email" value={guest.email} error={errors.email} onChange={(value) => update('email', value)} />
        <Field label="Phone" type="tel" value={guest.phone} error={errors.phone} onChange={(value) => update('phone', value)} />
      </div>
      <label className="field full">
        <span>Arrival notes</span>
        <textarea value={guest.requests} placeholder="Optional" onChange={(event) => update('requests', event.target.value)} />
        <small className="field-help">Optional. Add arrival time, allergies, or accessibility notes.</small>
      </label>
    </section>
  );
}

export function PaymentForm({ payment, errors, onChange }) {
  const update = (key, value) => onChange({ ...payment, [key]: value });

  return (
    <section className="panel">
      <div className="panel-title">
        <span>Checkout</span>
        <h2>Payment method</h2>
      </div>
      <div className="payment-strip">
        <span>Demo checkout</span>
        <strong>No real card is charged</strong>
      </div>
      <div className="form-grid">
        <Field label="Name on card" value={payment.cardName} error={errors.cardName} onChange={(value) => update('cardName', value)} />
        <Field label="Card number" value={payment.cardNumber} placeholder="4242 4242 4242 4242" error={errors.cardNumber} onChange={(value) => update('cardNumber', value)} />
        <Field label="Expiry" value={payment.expiry} placeholder="08/28" error={errors.expiry} onChange={(value) => update('expiry', value)} />
        <Field label="CVC" value={payment.cvc} placeholder="123" error={errors.cvc} onChange={(value) => update('cvc', value)} />
        <Field label="Billing ZIP" value={payment.billingZip} error={errors.billingZip} onChange={(value) => update('billingZip', value)} />
      </div>
      <label className="terms-row">
        <input type="checkbox" checked={payment.agree} onChange={(event) => update('agree', event.target.checked)} />
        <span>I agree to the cancellation policy and demo checkout terms.</span>
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
  const hasDifferentProposal = proposedRoom.id !== room.id;
  const holdExpired = holdRemaining <= 0;

  return (
    <aside className="summary">
      <div className="summary-card">
        <div className="summary-top">
          <div>
            <span className="eyebrow">Your stay</span>
            <h2>{room.name}</h2>
            <p>{HOTEL.location}</p>
          </div>
          <span className={holdExpired ? 'summary-timer expired' : 'summary-timer'}>
            {holdExpired ? 'Expired' : formatHoldTime(holdRemaining)}
          </span>
        </div>

        <div className="summary-dates">
          <div>
            <span>Check in</span>
            <strong>{stay.checkIn}</strong>
          </div>
          <div>
            <span>Check out</span>
            <strong>{stay.checkOut}</strong>
          </div>
        </div>

        <div className="summary-row">
          <span>{nights} nights / {guests} guests</span>
          <strong>{money(totals.room)}</strong>
        </div>
        <div className="summary-row">
          <span>Add-ons</span>
          <strong>{money(totals.addOns)}</strong>
        </div>
        <div className="summary-row">
          <span>Taxes and fees</span>
          <strong>{money(totals.taxes + totals.service)}</strong>
        </div>
        {totals.discount > 0 && (
          <div className="summary-row discount">
            <span>Promo</span>
            <strong>-{money(totals.discount)}</strong>
          </div>
        )}

        <div className="summary-total">
          <span>Total due today</span>
          <strong>{money(totals.total)}</strong>
        </div>

        {selectedAddOns.length > 0 && (
          <div className="mini-list">
            {selectedAddOns.map((addOn) => <span key={addOn.id}>{addOn.name}</span>)}
          </div>
        )}

        {hasDifferentProposal && (
          <div className="summary-note">
            Proposed for this party: <strong>{proposedRoom.name}</strong>
          </div>
        )}

        {selectedUnavailable && (
          <div className="error-box">
            This room is not available for the selected dates. {selectedUnavailable.reason}
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        <div className="summary-hold">
          <div>
            <span>Room hold</span>
            <strong>{holdExpired ? 'Needs renewal' : `${formatHoldTime(holdRemaining)} remaining`}</strong>
          </div>
          <div className="summary-hold-meter" aria-hidden="true">
            <span style={{ width: `${Math.max(0, Math.min(100, (holdRemaining / holdDuration) * 100))}%` }} />
          </div>
        </div>

        {holdExpired && <button type="button" className="btn secondary wide" onClick={onRenewHold}>Renew hold</button>}
        {!holdExpired && step === 0 && <button type="button" className="btn primary wide" onClick={onDetails}>Continue</button>}
        {!holdExpired && step === 1 && <button type="button" className="btn primary wide" onClick={onCheckout}>Continue to checkout</button>}
        {!holdExpired && step === 2 && <button type="button" className="btn primary wide" onClick={onBook}>Book stay</button>}
      </div>
    </aside>
  );
}

export function MobileBookingBar({ room, totals, step, holdRemaining, onDetails, onCheckout, onBook, onRenewHold }) {
  const handlers = [onDetails, onCheckout, onBook];
  const labels = ['Continue', 'Checkout', 'Book stay'];
  const holdExpired = holdRemaining <= 0;

  return (
    <div className="mobile-booking-bar">
      <div>
        <span>{holdExpired ? 'Hold expired' : `${room.name} / ${formatHoldTime(holdRemaining)}`}</span>
        <strong>{money(totals.total)}</strong>
      </div>
      <button type="button" className={holdExpired ? 'btn secondary' : 'btn primary'} onClick={holdExpired ? onRenewHold : handlers[step]}>
        {holdExpired ? 'Renew' : labels[step]}
      </button>
    </div>
  );
}

function SecurityPanel() {
  return (
    <section className="security-panel">
      <div>
        <span className="eyebrow">Security proposal</span>
        <h3>Production-grade booking safety</h3>
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
  const items = ['No real card charge', 'Tokenized payment plan', 'Inventory hold timer'];

  return (
    <section className="trust-rail" aria-label="Checkout trust signals">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </section>
  );
}

export function AddOnsPanel({ selectedAddOns, nights, onToggle }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <span>Enhance stay</span>
        <h2>Add-ons</h2>
      </div>
      <div className="addon-grid">
        {ADD_ONS.map((addOn) => (
          <AddOnCard
            key={addOn.id}
            addOn={addOn}
            nights={nights}
            selected={selectedAddOns.includes(addOn.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
