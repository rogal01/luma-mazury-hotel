import { CUSTOMER_REVIEWS, HOTEL, HOTEL_DETAILS, PORTFOLIO_NOTES, SOCIAL_LINKS } from '../data/hotel';
import { money } from '../lib/booking';
import { SearchBar } from './BookingUi';

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        <span>LM</span>
        {HOTEL.name}
      </a>
      <nav aria-label="Primary navigation">
        <a href="#rooms">Rooms</a>
        <a href="#hotel">Hotel</a>
        <a href="#reviews">Reviews</a>
        <a href="#portfolio">Portfolio</a>
      </nav>
    </header>
  );
}

export function HeroSection({ stay, onStayChange, roomId }) {
  return (
    <section className="hero" style={{ '--hero-image': `url(${HOTEL.heroImage})` }}>
      <div className="hero-copy">
        <span className="eyebrow">{HOTEL.location}</span>
        <h1>{HOTEL.name}</h1>
        <p>Book a lakeside escape in Mazury with smart room proposals, add-ons, reviews, and a complete demo checkout.</p>
        <div className="rating-pill">
          <strong>{HOTEL.rating}</strong>
          <span>{HOTEL.reviews} guest reviews</span>
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
        <span className="eyebrow">Hotel details</span>
        <h2>A calm base in the Mazury lake district</h2>
      </div>
      <div className="hotel-grid">
        <div className="location-panel">
          <img src={HOTEL.mapImage} alt="Mazury lake landscape near the hotel" />
          <div>
            <span>{HOTEL.location}</span>
            <strong>4 min to the marina</strong>
          </div>
        </div>
        <div className="detail-grid">
          {HOTEL_DETAILS.map((detail) => (
            <article key={detail.title}>
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
        <span className="eyebrow">Guest reviews</span>
        <h2>Recent stays in Mazury</h2>
      </div>
      <div className="review-grid">
        {CUSTOMER_REVIEWS.map((review) => (
          <article className="review-card" key={review.name}>
            <div>
              <strong>{review.rating}</strong>
              <span>{review.trip}</span>
            </div>
            <p>{review.quote}</p>
            <footer>
              <h3>{review.name}</h3>
              <span>{review.stay} / {review.date}</span>
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
        <span className="eyebrow">Socials</span>
        <h2>Follow the fake hotel</h2>
      </div>
      <div className="social-links">
        {SOCIAL_LINKS.map((link) => (
          <a href={link.url} target="_blank" rel="noreferrer" key={link.name}>
            {link.name}
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
        <span className="eyebrow">Portfolio case</span>
        <h2>Implementation notes</h2>
      </div>
      <div className="portfolio-grid">
        {PORTFOLIO_NOTES.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Confirmation({ code, guest, stay, room, totals, nights, onReset }) {
  return (
    <main className="confirmation">
      <section className="confirmation-card">
        <span className="eyebrow">Booking confirmed</span>
        <h1>{HOTEL.name} is ready for you, {guest.firstName || 'traveler'}.</h1>
        <p>Your demo confirmation number is <strong>{code}</strong>.</p>
        <div className="confirm-grid">
          <div>
            <span>Room</span>
            <strong>{room.name}</strong>
          </div>
          <div>
            <span>Dates</span>
            <strong>{stay.checkIn} to {stay.checkOut}</strong>
          </div>
          <div>
            <span>Length</span>
            <strong>{nights} nights</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{money(totals.total)}</strong>
          </div>
        </div>
        <button type="button" className="btn secondary" onClick={onReset}>Start another booking</button>
      </section>
    </main>
  );
}
