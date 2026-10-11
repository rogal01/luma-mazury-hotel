import React, { useEffect } from 'react';
import { CUSTOMER_REVIEWS, HOTEL, HOTEL_DETAILS, PORTFOLIO_NOTES, SOCIAL_LINKS } from '../data/hotel';
import { money } from '../lib/booking';
import { SearchBar } from './BookingUi';
import { WeatherTicker } from './WeatherTicker';
import { SoundscapeToggle } from './SoundscapeToggle';
import { RogalFooter } from './RogalFooter';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Bed,
  MapPin,
  Clock,
  Shield,
  Download,
  RotateCcw,
  Star,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-left">
        <a className="brand" href="/">
          <span className="brand-monogram">LM</span>
          <div className="brand-text">
            <strong>{HOTEL.name}</strong>
            <small>Mikołajki · Jezioro Czos</small>
          </div>
        </a>
      </div>

      <div className="header-center">
        <WeatherTicker />
      </div>

      <div className="header-right">
        <SoundscapeToggle />
        <nav aria-label="Nawigacja główna" className="main-nav">
          <a href="#rooms">Apartamenty</a>
          <a href="#hotel">O Resorcie</a>
          <a href="#reviews">Opinie</a>
          <a href="#portfolio">Architektura</a>
        </nav>
      </div>
    </header>
  );
}

export function HeroSection({ stay, onStayChange, roomId }) {
  return (
    <section className="hero" style={{ '--hero-image': `url(${HOTEL.heroImage})` }}>
      <div className="hero-copy">
        <div className="hero-eyebrow-wrap">
          <MapPin size={14} className="text-gold" />
          <span className="eyebrow">{HOTEL.location} · {HOTEL.coordinates}</span>
        </div>
        <h1>{HOTEL.name}</h1>
        <p className="hero-description">
          Zarezerwuj bezpośrednio kameralny pobyt nad krystaliczną taflą Jeziora Czos. Autentyczna mazurska gościnność, sauna fińska na pomoście o zachodzie słońca i gwarancja najniższej ceny bez prowizji pośredników.
        </p>
        <div className="rating-pill">
          <div className="stars-wrap">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="star-filled text-gold" />
            ))}
          </div>
          <strong>{HOTEL.rating}</strong>
          <span>· {HOTEL.reviews} zweryfikowanych opinii Gości</span>
        </div>
      </div>
      <SearchBar stay={stay} onChange={onStayChange} roomId={roomId} />
    </section>
  );
}

export function HotelDetailsSection() {
  return (
    <section className="hotel-section" id="hotel">
      <div className="section-heading">
        <span className="eyebrow-accent">Boutique Resort &amp; Spa</span>
        <h2>Kameralna przystań w sercu Krainy Wielkich Jezior</h2>
      </div>
      <div className="hotel-grid">
        <div className="location-panel">
          <img src={HOTEL.mapImage} alt="Krajobraz Jeziora Czos w Mikołajkach wokół hotelu Luma Mazury" />
          <div className="location-overlay-card">
            <span>{HOTEL.location}</span>
            <strong>Prywatny pomost &amp; 4 min do Mariny Mikołajki</strong>
          </div>
        </div>
        <div className="detail-grid">
          {HOTEL_DETAILS.map((detail) => (
            <article key={detail.title} className="detail-card">
              <h3>{detail.title}</h3>
              <p>{detail.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="section-heading">
        <span className="eyebrow-accent">Doświadczenia Gości</span>
        <h2>Prawdziwe wspomnienia z pobytów nad Jeziorem Czos</h2>
      </div>
      <div className="review-grid">
        {CUSTOMER_REVIEWS.map((review) => (
          <article className="review-card" key={review.name}>
            <div className="review-header">
              <div className="stars-wrap">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="star-filled text-gold" />
                ))}
              </div>
              <strong className="review-rating">{review.rating} / 5.0</strong>
              <span className="review-trip">{review.trip}</span>
            </div>
            <p className="review-quote">„{review.quote}”</p>
            <footer className="review-footer">
              <div className="review-author">
                <h3>{review.name}</h3>
                <span>{review.stay} · {review.date}</span>
              </div>
              <span className="verified-badge">
                <CheckCircle2 size={13} className="text-emerald" /> Zweryfikowany pobyt
              </span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SocialSection() {
  return (
    <section className="social-section" id="socials">
      <div>
        <span className="eyebrow-accent">Społeczność Resortu</span>
        <h2>Odkryj codzienne życie nad Jeziorem Czos</h2>
      </div>
      <div className="social-links">
        {SOCIAL_LINKS.map((link) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={link.name} className="social-pill">
            <span>{link.name}</span>
            <ExternalLink size={13} />
          </a>
        ))}
      </div>
    </section>
  );
}

export function PortfolioSection() {
  return (
    <section className="portfolio-section" id="portfolio">
      <div className="section-heading">
        <span className="eyebrow-accent">Inżynieria Frontendowa</span>
        <h2>Specyfikacja Architektury &amp; Standardy Jakości</h2>
      </div>
      <div className="portfolio-grid">
        {PORTFOLIO_NOTES.map((item) => (
          <article key={item.label} className="portfolio-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Confirmation({ code, guest, stay, room, totals, nights, onReset }) {
  useEffect(() => {
    // Multi-burst gold & emerald celebratory confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#bd7e2d', '#1f4f3d', '#2f6f7f', '#e6be8a', '#ffffff', '#10b981']
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <main className="confirmation">
      <motion.section
        className="confirmation-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
      >
        <div className="confirmation-badge">
          <CheckCircle2 size={24} className="text-emerald" />
          <span className="eyebrow">Rezerwacja Bezpośrednia Potwierdzona</span>
        </div>

        <h1>
          Czekamy na Ciebie w Luma Mazury, {guest.firstName || 'Drogi Gościu'}.
        </h1>
        <p className="confirmation-sub">
          Twój demonstracyjny numer rezerwacji to: <strong className="code-pill">{code}</strong>.
          Potwierdzenie wraz ze szczegółami dojazdu do Mikołajek zostało wygenerowane.
        </p>

        <div className="confirm-grid">
          <div className="confirm-item">
            <span className="confirm-label"><Bed size={15} /> Wybrany Apartament</span>
            <strong>{room.name}</strong>
          </div>
          <div className="confirm-item">
            <span className="confirm-label"><Calendar size={15} /> Termin Pobytu</span>
            <strong>{stay.checkIn} — {stay.checkOut}</strong>
          </div>
          <div className="confirm-item">
            <span className="confirm-label"><Clock size={15} /> Długość Pobytu</span>
            <strong>{nights} {nights === 1 ? 'noc' : nights < 5 ? 'noce' : 'nocy'}</strong>
          </div>
          <div className="confirm-item highlight">
            <span className="confirm-label"><Shield size={15} /> Rozliczenie Rezerwacji</span>
            <strong>{money(totals.total)}</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button type="button" className="btn primary" onClick={() => window.print()}>
            <Download size={15} className="inline-icon" /> Pobierz / Drukuj Potwierdzenie
          </button>
          <button type="button" className="btn secondary" onClick={onReset}>
            <RotateCcw size={15} className="inline-icon" /> Nowa Rezerwacja
          </button>
        </div>
      </motion.section>
    </main>
  );
}
