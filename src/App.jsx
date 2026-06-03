import React, { useEffect, useMemo, useState } from 'react';
import {
  ADD_ONS,
  INITIAL_GUEST,
  INITIAL_PAYMENT,
  INITIAL_STAY,
  ROOMS
} from './data/hotel';
import {
  AddOnsPanel,
  AvailabilityStrip,
  BookingSummary,
  CheckoutTrustRail,
  Field,
  GuestForm,
  HoldTimer,
  MobileBookingBar,
  PaymentForm,
  RoomCard,
  RoomProposal,
  Stepper
} from './components/BookingUi';
import {
  Confirmation,
  HeroSection,
  HotelDetailsSection,
  PortfolioSection,
  ReviewsSection,
  SiteHeader,
  SocialSection
} from './components/PageSections';
import {
  calculateTotals,
  createConfirmation,
  HOLD_DURATION_MS,
  getUnavailableStay,
  guestCount,
  nightsBetween,
  recommendRoom
} from './lib/booking';
import { validateGuest, validatePayment } from './lib/validation';

export default function App() {
  const [stay, setStay] = useState(INITIAL_STAY);
  const [selectedRoomId, setSelectedRoomId] = useState('lake-classic');
  const [selectedAddOns, setSelectedAddOns] = useState(['breakfast']);
  const [guest, setGuest] = useState(INITIAL_GUEST);
  const [payment, setPayment] = useState(INITIAL_PAYMENT);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({ guest: {}, payment: {} });
  const [confirmation, setConfirmation] = useState('');
  const [holdExpiresAt, setHoldExpiresAt] = useState(() => Date.now() + HOLD_DURATION_MS);
  const [now, setNow] = useState(Date.now());

  const room = ROOMS.find((item) => item.id === selectedRoomId) ?? ROOMS[0];
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  const guests = guestCount(stay);
  const proposal = recommendRoom(stay);
  const selectedUnavailable = getUnavailableStay(room.id, stay);
  const addOns = ADD_ONS.filter((addOn) => selectedAddOns.includes(addOn.id));
  const holdRemaining = Math.max(0, holdExpiresAt - now);
  const holdExpired = holdRemaining <= 0;

  const totals = useMemo(() => calculateTotals({
    room,
    nights,
    addOns,
    promo: stay.promo
  }), [addOns, nights, room, stay.promo]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const refreshHold = () => {
    setHoldExpiresAt(Date.now() + HOLD_DURATION_MS);
    setNow(Date.now());
    setError('');
  };

  const renewHold = refreshHold;

  const updateStay = (nextStay) => {
    setStay(nextStay);
    refreshHold();
  };

  const selectRoom = (roomId) => {
    setSelectedRoomId(roomId);
    refreshHold();
  };

  const toggleAddOn = (id) => {
    setSelectedAddOns((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
  };

  const requireGuest = () => {
    const guestErrors = validateGuest(guest);
    setFormErrors((current) => ({ ...current, guest: guestErrors }));
    if (Object.keys(guestErrors).length > 0) {
      setError('Fix the guest details before continuing.');
      return false;
    }
    return true;
  };

  const requirePayment = () => {
    const paymentErrors = validatePayment(payment);
    setFormErrors((current) => ({ ...current, payment: paymentErrors }));
    if (Object.keys(paymentErrors).length > 0) {
      setError('Fix the payment details before booking.');
      return false;
    }
    return true;
  };

  const resetBooking = () => {
    setStay(INITIAL_STAY);
    setSelectedRoomId('lake-classic');
    setSelectedAddOns(['breakfast']);
    setGuest(INITIAL_GUEST);
    setPayment(INITIAL_PAYMENT);
    setStep(0);
    setError('');
    setFormErrors({ guest: {}, payment: {} });
    setConfirmation('');
    setHoldExpiresAt(Date.now() + HOLD_DURATION_MS);
    setNow(Date.now());
  };

  const goToDetails = () => {
    if (holdExpired) {
      setError('Renew the room hold before continuing.');
      return;
    }
    if (selectedUnavailable) {
      setError('Choose an available room before continuing.');
      return;
    }
    setError('');
    setStep(1);
  };

  const goToCheckout = () => {
    if (holdExpired) {
      setError('Renew the room hold before checkout.');
      return;
    }
    if (selectedUnavailable) {
      setError('Choose an available room before checkout.');
      return;
    }
    if (!requireGuest()) return;
    setError('');
    setStep(2);
  };

  const bookStay = () => {
    if (holdExpired) {
      setError('Renew the room hold before booking.');
      return;
    }
    if (selectedUnavailable) {
      setError('Choose an available room before booking.');
      return;
    }
    if (!requireGuest() || !requirePayment()) return;
    setError('');
    setConfirmation(createConfirmation());
  };

  if (confirmation) {
    return (
      <Confirmation
        code={confirmation}
        guest={guest}
        stay={stay}
        room={room}
        totals={totals}
        nights={nights}
        onReset={resetBooking}
      />
    );
  }

  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        <HeroSection stay={stay} onStayChange={updateStay} roomId={selectedRoomId} />

        <section className="booking-layout" id="rooms">
          <div className="booking-main">
            <Stepper step={step} />
            <HoldTimer remaining={holdRemaining} duration={HOLD_DURATION_MS} onRenew={renewHold} />
            <AvailabilityStrip />
            <CheckoutTrustRail />
            <RoomProposal
              proposal={proposal}
              guests={guests}
              nights={nights}
              selected={selectedRoomId === proposal.room.id}
              onApply={() => selectRoom(proposal.room.id)}
            />

            <section className="panel">
              <div className="panel-title">
                <span>{nights} nights available</span>
                <h2>Choose your room</h2>
              </div>
              <div className="room-list">
                {ROOMS.map((item) => (
                  <RoomCard
                    room={item}
                    key={item.id}
                    nights={nights}
                    selected={selectedRoomId === item.id}
                    recommended={proposal.room.id === item.id}
                    unavailable={getUnavailableStay(item.id, stay)}
                    onSelect={selectRoom}
                  />
                ))}
              </div>
            </section>

            <AddOnsPanel selectedAddOns={selectedAddOns} nights={nights} onToggle={toggleAddOn} />

            <section className="panel promo-panel">
              <div className="panel-title">
                <span>Offer code</span>
                <h2>Promo</h2>
              </div>
              <Field
                label="Code"
                value={stay.promo}
                placeholder="Try MAZURY10"
                required={false}
                onChange={(promo) => setStay({ ...stay, promo })}
              />
              {stay.promo.trim() !== '' && (
                <div className={stay.promo.trim().toUpperCase() === 'MAZURY10' ? 'promo-feedback success' : 'promo-feedback error'}>
                  {stay.promo.trim().toUpperCase() === 'MAZURY10'
                    ? '10% discount applied.'
                    : 'Code not recognised.'}
                </div>
              )}
            </section>

            {step >= 1 && <GuestForm guest={guest} errors={formErrors.guest} onChange={setGuest} />}
            {step >= 2 && <PaymentForm payment={payment} errors={formErrors.payment} onChange={setPayment} />}
          </div>

          <BookingSummary
            stay={stay}
            room={room}
            proposedRoom={proposal.room}
            selectedUnavailable={selectedUnavailable}
            nights={nights}
            selectedAddOns={addOns}
            totals={totals}
            step={step}
            holdRemaining={holdRemaining}
            holdDuration={HOLD_DURATION_MS}
            error={error}
            onDetails={goToDetails}
            onCheckout={goToCheckout}
            onBook={bookStay}
            onRenewHold={renewHold}
          />
        </section>

        <HotelDetailsSection />
        <ReviewsSection />
        <SocialSection />
        <PortfolioSection />
      </main>
      <MobileBookingBar
        room={room}
        totals={totals}
        step={step}
        holdRemaining={holdRemaining}
        onDetails={goToDetails}
        onCheckout={goToCheckout}
        onBook={bookStay}
        onRenewHold={renewHold}
      />
    </div>
  );
}
