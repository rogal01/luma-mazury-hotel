import React from 'react';
import { HOTEL } from '../data/hotel';
import { ShieldCheck, Anchor, MapPin, Phone, Mail, Sparkles, ExternalLink, Sliders } from 'lucide-react';

export function RogalFooter() {
  const openCookieSettings = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  return (
    <footer className="rogal-footer">
      <div className="rogal-footer-top">
        {/* Brand & Mission */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-monogram">LM</span>
            <div>
              <h3>{HOTEL.name}</h3>
              <p className="brand-tagline">{HOTEL.tagline}</p>
            </div>
          </div>
          <p className="footer-desc">
            Kameralny resort wypoczynkowy & SPA bezpośrednio nad brzegiem Jeziora Czos w Mikołajkach. Autentyczna mazurska gościnność, prywatny pomost, rytuały saunowe i bezpośrednia rezerwacja bez pośredników.
          </p>
          <div className="footer-guarantees">
            <div className="guarantee-item">
              <ShieldCheck size={16} className="text-emerald" />
              <span>Gwarancja najniższej ceny bezpośredniej</span>
            </div>
            <div className="guarantee-item">
              <Anchor size={16} className="text-lake" />
              <span>Prywatna marina i pomost hotelowy</span>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="footer-col">
          <h4>Kontakt & Lokalizacja</h4>
          <ul className="footer-list">
            <li>
              <MapPin size={15} className="footer-icon text-gold" />
              <span>{HOTEL.address}</span>
            </li>
            <li>
              <Anchor size={15} className="footer-icon text-lake" />
              <span>Współrzędne mariny: <strong>{HOTEL.coordinates}</strong></span>
            </li>
            <li>
              <Phone size={15} className="footer-icon text-forest" />
              <a href={`tel:${HOTEL.phone.replace(/\s+/g, '')}`}>{HOTEL.phone}</a>
            </li>
            <li>
              <Mail size={15} className="footer-icon text-cyan" />
              <a href={`mailto:${HOTEL.email}`}>{HOTEL.email}</a>
            </li>
          </ul>
        </div>

        {/* Legal & Preferences */}
        <div className="footer-col">
          <h4>Prywatność & Informacje Prawne</h4>
          <ul className="footer-list">
            <li>
              <button
                type="button"
                className="footer-link-btn"
                onClick={openCookieSettings}
              >
                <Sliders size={14} /> Ustawienia Cookies & RODO
              </button>
            </li>
            <li>
              <a href="#hotel" className="footer-link">Regulamin hotelu & polityka pobytu</a>
            </li>
            <li>
              <a href="#rooms" className="footer-link">Procedura anulacji rezerwacji</a>
            </li>
            <li>
              <span className="footer-subtext">NIP: 842-178-90-21 · REGON: 382910482</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Signature & Studio Watermark */}
      <div className="rogal-signature-bar">
        <div className="signature-left">
          <div className="rogal-badge">
            <Sparkles size={13} className="text-gold" />
            <span>WYKONANIE: ROGAL STUDIO · INŻYNIERIA WEBOWA · 2026</span>
          </div>
          <p className="rogal-motto">
            „Pokaż swój biznes z perspektywy, która budzi natychmiastowe zaufanie.”
          </p>
        </div>

        <div className="signature-right">
          <a
            href="https://rogalstudio.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="rogal-watermark-link"
            title="Przejdź do strony Rogal Studio"
          >
            <span>Wykonanie &amp; Architektura Kodu: <strong>Rogal Studio</strong></span>
            <ExternalLink size={14} className="rogal-arrow" />
          </a>
        </div>
      </div>
    </footer>
  );
}
