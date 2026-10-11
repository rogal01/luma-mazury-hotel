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
import { CookieBanner } from './components/CookieBanner';
import { RogalFooter } from './components/RogalFooter';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

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
      setError('Uzupełnij wymagane dane Gościa przed przejściem do płatności.');
      return false;
    }
    return true;
  };

  const requirePayment = () => {
    const paymentErrors = validatePayment(payment);
    setFormErrors((current) => ({ ...current, payment: paymentErrors }));
    if (Object.keys(paymentErrors).length > 0) {
      setError('Popraw dane karty demonstracyjnej przed potwierdzeniem rezerwacji.');
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
      setError('Odnów blokadę terminu przed kontynuacją.');
      return;
    }
    if (selectedUnavailable) {
      setError('Wybierz dostępny apartament przed przejściem dalej.');
      return;
    }
    setError('');
    setStep(1);
    const roomsElem = document.getElementById('rooms');
    if (roomsElem) roomsElem.scrollIntoView({ behavior: 'smooth' });
  };

  const goToCheckout = () => {
    if (holdExpired) {
      setError('Odnów blokadę terminu przed przejściem do kasy.');
      return;
    }
    if (selectedUnavailable) {
      setError('Wybierz dostępny apartament przed przejściem do kasy.');
      return;
    }
    if (!requireGuest()) return;
    setError('');
    setStep(2);
    const roomsElem = document.getElementById('rooms');
    if (roomsElem) roomsElem.scrollIntoView({ behavior: 'smooth' });
  };

  const bookStay = () => {
    if (holdExpired) {
      setError('Odnów blokadę terminu przed złożeniem rezerwacji.');
      return;
    }
    if (selectedUnavailable) {
      setError('Wybierz dostępny apartament przed złożeniem rezerwacji.');
      return;
    }
    if (!requireGuest() || !requirePayment()) return;
    setError('');
    setConfirmation(createConfirmation());
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const isPromoValid = stay.promo.trim().toUpperCase() === 'MAZURY10';
  const hasPromoText = stay.promo.trim() !== '';

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
                <span>Dostępne apartamenty ({nights} {nights === 1 ? 'noc' : nights < 5 ? 'noce' : 'nocy'})</span>
                <h2>Wybierz swój widok na Jezioro Czos</h2>
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

            <AddOnsPanel
              selectedAddOns={selectedAddOns}
              selectedRoomId={selectedRoomId}
              nights={nights}
              onToggle={toggleAddOn}
            />

            {/* Promo Code Engine with Framer Motion Spring Transitions */}
            <section className="panel promo-panel">
              <div className="panel-title">
                <span>Oferta Specjalna</span>
                <h2>Kod Rabatowy</h2>
              </div>
              <div className="promo-input-row">
                <Field
                  label="Wpisz kod promocyjny"
                  value={stay.promo}
                  placeholder="Wpisz kod np. MAZURY10"
                  required={false}
                  onChange={(promo) => setStay({ ...stay, promo })}
                />
              </div>

              <AnimatePresence mode="wait">
                {hasPromoText && (
                  <motion.div
                    key={isPromoValid ? 'valid' : 'invalid'}
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`promo-feedback ${isPromoValid ? 'success' : 'error'}`}
                  >
                    {isPromoValid ? (
                      <div className="promo-feedback-inner">
                        <CheckCircle2 size={16} className="text-forest" />
                        <div>
                          <strong>Kod MAZURY10 aktywny!</strong>
                          <p>Naliczono 10% rabatu na cały pobyt w Luma Mazury.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="promo-feedback-inner">
                        <AlertCircle size={16} className="text-rose" />
                        <div>
                          <strong>Niepoprawny kod</strong>
                          <p>Wpisz kod promocyjny <strong>MAZURY10</strong>, aby odebrać 10% zniżki.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.35 }}
                >
                  <GuestForm guest={guest} errors={formErrors.guest} onChange={setGuest} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.35 }}
                >
                  <PaymentForm payment={payment} errors={formErrors.payment} onChange={setPayment} />
                </motion.div>
              )}
            </AnimatePresence>
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

      <RogalFooter />
      <CookieBanner />
    </div>
  );
}
