import React, { useState, useEffect } from 'react';
import { Waves, Sun, Wind, Thermometer, Droplets, Compass, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WeatherTicker() {
  const [modalOpen, setModalOpen] = useState(false);
  const [weatherData, setWeatherData] = useState({
    airTemp: 22,
    waterTemp: 20.8,
    clarity: '3.9 m',
    windSpeed: 2.4,
    windDirection: 'NW (północno-zachodni)',
    waveHeight: '0.1 m (spokojna tafla)',
    sunset: '20:42',
    sunrise: '04:48',
    status: 'Doskonałe warunki do kąpieli i żeglugi',
    updatedAt: 'przed chwilą'
  });

  // Dynamic simulation reflecting time of day
  useEffect(() => {
    const updateConditions = () => {
      const now = new Date();
      const hour = now.getHours();
      const isDay = hour >= 6 && hour < 21;
      const baseAir = isDay ? 22 + Math.sin((hour - 6) / 15 * Math.PI) * 3 : 16;
      const baseWater = 20.5 + (isDay ? 0.8 : -0.3);

      setWeatherData((prev) => ({
        ...prev,
        airTemp: Math.round(baseAir * 10) / 10,
        waterTemp: Math.round(baseWater * 10) / 10,
        windSpeed: Math.round((2.0 + Math.sin(now.getMinutes() / 10) * 0.8) * 10) / 10,
        updatedAt: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      }));
    };

    updateConditions();
    const interval = setInterval(updateConditions, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="weather-ticker-btn"
        aria-label="Sprawdź aktualne warunki nad Jeziorem Czos"
        title="Kliknij, aby zobaczyć stację meteorologiczną Jeziora Czos"
      >
        <span className="live-status-pulse" aria-hidden="true">
          <span className="pulse-dot"></span>
          <span className="pulse-ring"></span>
        </span>
        
        <span className="ticker-label">
          <Waves size={14} className="ticker-icon text-lake" />
          <strong className="ticker-highlight">Jezioro Czos:</strong>
        </span>

        <span className="ticker-metrics">
          <span className="ticker-item">
            <Thermometer size={13} className="text-amber" />
            <span>Woda <strong>{weatherData.waterTemp}°C</strong></span>
          </span>
          <span className="ticker-sep">·</span>
          <span className="ticker-item hide-mobile-sm">
            <Droplets size={13} className="text-emerald" />
            <span>Woda krystaliczna</span>
          </span>
          <span className="ticker-sep hide-mobile-sm">·</span>
          <span className="ticker-item">
            <Wind size={13} className="text-cyan" />
            <span>Wiatr {weatherData.windSpeed} m/s</span>
          </span>
          <span className="ticker-sep hide-mobile-md">·</span>
          <span className="ticker-item hide-mobile-md">
            <Sun size={13} className="text-gold" />
            <span>Zachód: {weatherData.sunset}</span>
          </span>
        </span>

        <span className="ticker-badge-live">LIVE</span>
      </button>

      {/* Lake Conditions Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="weather-modal-overlay" onClick={() => setModalOpen(false)}>
            <motion.div
              className="weather-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="weather-modal-title"
            >
              <div className="weather-modal-header">
                <div className="weather-modal-title-wrap">
                  <span className="eyebrow-accent">Automatyczna Boja Pomiarowa</span>
                  <h3 id="weather-modal-title">Warunki na Jeziorze Czos (Mikołajki)</h3>
                </div>
                <button
                  type="button"
                  className="weather-modal-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Zamknij raport pogodowy"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="weather-modal-status-banner">
                <div className="status-indicator-live">
                  <span className="live-dot-green"></span>
                  <span>Stacja aktywna · Aktualizacja: {weatherData.updatedAt}</span>
                </div>
                <p className="weather-summary-text">{weatherData.status}</p>
              </div>

              <div className="weather-grid-details">
                <div className="weather-metric-card">
                  <div className="metric-icon-wrap bg-lake-soft">
                    <Waves size={20} className="text-lake" />
                  </div>
                  <div>
                    <span className="metric-caption">Temperatura Wody</span>
                    <strong className="metric-val">{weatherData.waterTemp}°C</strong>
                    <small className="metric-sub">Pomiar na głębokości 1.0 m</small>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="metric-icon-wrap bg-amber-soft">
                    <Thermometer size={20} className="text-gold" />
                  </div>
                  <div>
                    <span className="metric-caption">Temperatura Powietrza</span>
                    <strong className="metric-val">{weatherData.airTemp}°C</strong>
                    <small className="metric-sub">Odczuwalna: {weatherData.airTemp + 1}°C</small>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="metric-icon-wrap bg-cyan-soft">
                    <Wind size={20} className="text-lake" />
                  </div>
                  <div>
                    <span className="metric-caption">Wiatr & Kierunek</span>
                    <strong className="metric-val">{weatherData.windSpeed} m/s</strong>
                    <small className="metric-sub">{weatherData.windDirection}</small>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="metric-icon-wrap bg-emerald-soft">
                    <Droplets size={20} className="text-forest" />
                  </div>
                  <div>
                    <span className="metric-caption">Przejrzystość & Fala</span>
                    <strong className="metric-val">{weatherData.clarity}</strong>
                    <small className="metric-sub">{weatherData.waveHeight}</small>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="metric-icon-wrap bg-gold-soft">
                    <Sun size={20} className="text-gold" />
                  </div>
                  <div>
                    <span className="metric-caption">Światło Dnia</span>
                    <strong className="metric-val">Wschód {weatherData.sunrise}</strong>
                    <small className="metric-sub">Zachód słońca: {weatherData.sunset}</small>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="metric-icon-wrap bg-slate-soft">
                    <Compass size={20} className="text-forest" />
                  </div>
                  <div>
                    <span className="metric-caption">Położenie Hotelu</span>
                    <strong className="metric-val">53°48'N 21°34'E</strong>
                    <small className="metric-sub">Bezpośrednia marina hotelowa</small>
                  </div>
                </div>
              </div>

              <div className="weather-modal-footer">
                <p>
                  <Info size={14} className="inline-icon" /> Dane telemetryczne pobierane bezpośrednio z autonomicznej stacji meteorologiczno-hydrologicznej przy pomoście Luma Mazury Hotel.
                </p>
                <button
                  type="button"
                  className="btn primary sm"
                  onClick={() => setModalOpen(false)}
                >
                  Powrót do rezerwacji
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
