function Hero({ competition, season, title, subtitle, currentLabel, dateLabel }) {
  return (
    <section className="hero card">
      <div className="hero-copy">
        <p className="eyebrow">
          {competition} • {season}
        </p>
        <h1>{title ?? 'Orizzonte Scudetto'}</h1>
        <p className="hero-subtitle">
          {subtitle ??
            'Ogni universo rappresenta un possibile finale di stagione. Piu universi controlla una squadra, piu e probabile che vinca il titolo.'}
        </p>
      </div>

      <div className="hero-meta">
        <div className="hero-pill">
          <span className="hero-pill-label">Vista corrente</span>
          <strong>{currentLabel}</strong>
        </div>
        <div className="hero-pill">
          <span className="hero-pill-label">Data snapshot</span>
          <strong>{dateLabel}</strong>
        </div>
      </div>
    </section>
  )
}

export default Hero
