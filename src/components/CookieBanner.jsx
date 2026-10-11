import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X, Check, Lock, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'luma_mazury_cookie_consent_v1';

export function CookieBanner() {
  const [consent, setConsent] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Granular settings state
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    functional: true
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsent(parsed);
        setPreferences(parsed);
      } else {
        // First visit -> show banner
        setShowBanner(true);
      }
    } catch (e) {
      setShowBanner(true);
    }

    // Listen for custom event to open preferences from footer
    const handleOpenModal = () => setModalOpen(true);
    window.addEventListener('open-cookie-settings', handleOpenModal);
    return () => window.removeEventListener('open-cookie-settings', handleOpenModal);
  }, []);

  const saveConsent = (prefs) => {
    const consentObject = {
      ...prefs,
      essential: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentObject));
    } catch (e) {}
    setConsent(consentObject);
    setShowBanner(false);
    setModalOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, functional: true });
  };

  const handleAcceptEssentialOnly = () => {
    saveConsent({ essential: true, analytics: false, functional: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  return (
    <>
      {/* Fixed Bottom Banner */}
      <AnimatePresence>
        {showBanner && !consent && (
          <motion.div
            className="cookie-banner-wrap"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            role="region"
            aria-label="Powiadomienie o plikach cookies i RODO"
          >
            <div className="cookie-banner">
              <div className="cookie-content">
                <div className="cookie-icon-header">
                  <div className="cookie-badge">
                    <ShieldCheck size={18} className="text-forest" />
                    <span>Prywatność & RODO</span>
                  </div>
                  <span className="cookie-standard-tag">Zgodność UODO / UOKiK</span>
                </div>
                <h3>Szanujemy Twoją prywatność i czas wypoczynku</h3>
                <p>
                  Strona Luma Mazury Hotel & Spa wykorzystuje niezbędne pliki cookies do prawidłowego działania silnika rezerwacji, utrzymania blokady terminów oraz zapewnienia bezpieczeństwa transakcji. Za Twoją zgodą używamy również ciasteczek analitycznych i funkcjonalnych, aby dostosować ofertę do Twoich preferencji.
                </p>
                <div className="cookie-meta-links">
                  <button
                    type="button"
                    className="cookie-link-btn"
                    onClick={() => setModalOpen(true)}
                  >
                    <Settings size={14} /> Dostosuj zgody granularnie
                  </button>
                  <span className="sep">·</span>
                  <button
                    type="button"
                    className="cookie-link-btn"
                    onClick={() => setModalOpen(true)}
                  >
                    Pełna Polityka Prywatności
                  </button>
                </div>
              </div>

              {/* Strict Anti-Slop: Equal-weight buttons (no dark patterns) */}
              <div className="cookie-actions">
                <button
                  type="button"
                  className="btn cookie-btn-reject"
                  onClick={handleAcceptEssentialOnly}
                >
                  Tylko Niezbędne
                </button>
                <button
                  type="button"
                  className="btn cookie-btn-accept"
                  onClick={handleAcceptAll}
                >
                  Zaakceptuj Wszystkie
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences & Privacy Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="cookie-modal-overlay" onClick={() => setModalOpen(false)}>
            <motion.div
              className="cookie-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-modal-heading"
            >
              <div className="cookie-modal-header">
                <div>
                  <span className="eyebrow-accent">RODO & Ochrona Danych</span>
                  <h2 id="cookie-modal-heading">Centrum Preferencji Prywatności</h2>
                </div>
                <button
                  type="button"
                  className="cookie-modal-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Zamknij okno preferencji"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="cookie-modal-body">
                <div className="privacy-intro-box">
                  <p>
                    <strong>Administrator Danych:</strong> Luma Mazury Hotel & Spa Sp. z o.o., ul. Spacerowa 14, 11-730 Mikołajki. Przetwarzamy Twoje dane zgodnie z art. 6 ust. 1 lit. a i f RODO. Przysługuje Ci prawo wglądu, sprostowania, usunięcia danych oraz wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).
                  </p>
                </div>

                <div className="cookie-category-list">
                  {/* Category 1: Essential */}
                  <div className="cookie-category-card">
                    <div className="category-card-top">
                      <div className="category-info">
                        <div className="category-badge-wrap">
                          <Lock size={15} className="text-forest" />
                          <strong>Niezbędne techniczne</strong>
                          <span className="pill-required">Zawsze aktywne</span>
                        </div>
                        <p>Kluczowe dla działania koszyka, blokady pokoju w czasie rzeczywistym i ochrony przed atakami CSRF.</p>
                      </div>
                      <div className="toggle-switch disabled">
                        <input type="checkbox" checked disabled readOnly aria-label="Niezbędne pliki cookie" />
                        <span className="switch-slider active"></span>
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Analytics */}
                  <div className="cookie-category-card">
                    <div className="category-card-top">
                      <div className="category-info">
                        <div className="category-badge-wrap">
                          <ShieldCheck size={15} className="text-lake" />
                          <strong>Wydajność & Analityka</strong>
                          <span className="pill-optional">Opcjonalne</span>
                        </div>
                        <p>Pomagają nam badać przepustowość formularza rezerwacji i eliminować błędy interfejsu (anonimowe metryki).</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences((p) => ({ ...p, analytics: e.target.checked }))}
                          aria-label="Analityczne pliki cookie"
                        />
                        <span className={`switch-slider ${preferences.analytics ? 'active' : ''}`}></span>
                      </label>
                    </div>
                  </div>

                  {/* Category 3: Functional */}
                  <div className="cookie-category-card">
                    <div className="category-card-top">
                      <div className="category-info">
                        <div className="category-badge-wrap">
                          <Settings size={15} className="text-gold" />
                          <strong>Funkcjonalne & Personalizacja</strong>
                          <span className="pill-optional">Opcjonalne</span>
                        </div>
                        <p>Zapamiętują wybrane daty pobytu, liczbę gości oraz preferowany stan pejzażu dźwiękowego fal.</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => setPreferences((p) => ({ ...p, functional: e.target.checked }))}
                          aria-label="Funkcjonalne pliki cookie"
                        />
                        <span className={`switch-slider ${preferences.functional ? 'active' : ''}`}></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Table of Cookies */}
                <div className="cookie-table-wrap">
                  <h4>Wykaz wykorzystywanych identyfikatorów cookie</h4>
                  <table className="cookie-table">
                    <thead>
                      <tr>
                        <th>Nazwa</th>
                        <th>Dostawca</th>
                        <th>Cel</th>
                        <th>Wygasa</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>luma_hold_session</code></td>
                        <td>Luma Mazury</td>
                        <td>Utrzymanie blokady apartamentu</td>
                        <td>10 minut</td>
                      </tr>
                      <tr>
                        <td><code>luma_mazury_cookie_consent_v1</code></td>
                        <td>Luma Mazury</td>
                        <td>Zapamiętanie wyboru zgód RODO</td>
                        <td>12 miesięcy</td>
                      </tr>
                      <tr>
                        <td><code>luma_analytics_stat</code></td>
                        <td>Luma Mazury</td>
                        <td>Anonimowe statystyki ścieżki zakupu</td>
                        <td>30 dni</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="cookie-modal-footer">
                <button
                  type="button"
                  className="btn secondary sm"
                  onClick={handleAcceptEssentialOnly}
                >
                  Odrzuć Opcjonalne
                </button>
                <button
                  type="button"
                  className="btn secondary sm"
                  onClick={handleSaveCustom}
                >
                  Zapisz Wybrane
                </button>
                <button
                  type="button"
                  className="btn primary sm"
                  onClick={handleAcceptAll}
                >
                  Zaakceptuj Wszystkie
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
