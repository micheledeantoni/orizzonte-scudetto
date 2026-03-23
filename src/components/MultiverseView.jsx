import { useMemo, useState } from 'react'

function MultiverseView({ particles, teams }) {
  const [activeParticleId, setActiveParticleId] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 50, y: 50 })

  const fallbackParticle = particles[0] ?? null
  const activeParticle = useMemo(
    () => particles.find((particle) => particle.id === activeParticleId) ?? fallbackParticle,
    [activeParticleId, fallbackParticle, particles],
  )

  const updateTooltipPosition = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    setTooltipPosition({
      x: Math.min(Math.max(x, 10), 90),
      y: Math.min(Math.max(y, 12), 88),
    })
  }

  return (
    <div className="multiverse-layout">
      <div
        className="multiverse-stage"
        role="img"
        aria-label="Universi del titolo per squadra"
        onMouseLeave={() => setActiveParticleId(null)}
      >
        {particles.map((particle) => (
          <button
            key={particle.id}
            type="button"
            className="universe-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.secondaryColor
                ? `linear-gradient(135deg, ${particle.color} 0 58%, ${particle.secondaryColor} 58% 100%)`
                : particle.color,
              boxShadow: `0 0 0.9rem ${particle.glow}`,
              animationDelay: `${particle.delay}s`,
            }}
            onMouseEnter={(event) => {
              setActiveParticleId(particle.id)
              updateTooltipPosition(event)
            }}
            onMouseMove={updateTooltipPosition}
            onFocus={() => setActiveParticleId(particle.id)}
            onClick={() => setActiveParticleId(particle.id)}
            title={`${particle.teamName} • ${particle.probabilityLabel}`}
            aria-label={`${particle.teamName} universo ${particle.order}`}
          />
        ))}
        <div className="multiverse-grid" aria-hidden="true" />
        {activeParticle ? (
          <div
            className="multiverse-tooltip"
            style={{
              left: `${tooltipPosition.x}%`,
              top: `${tooltipPosition.y}%`,
              '--tooltip-accent': activeParticle.color,
              '--tooltip-secondary': activeParticle.secondaryColor ?? activeParticle.color,
            }}
          >
            <div className="multiverse-tooltip-top">
              {activeParticle.logo ? (
                <img
                  className="multiverse-tooltip-logo"
                  src={activeParticle.logo}
                  alt=""
                  aria-hidden="true"
                />
              ) : null}
              <div className="multiverse-tooltip-copy">
                <strong>{activeParticle.teamName}</strong>
                <span>{activeParticle.probabilityLabel}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <aside className="multiverse-aside">
        {activeParticle ? (
          <div className="universe-card">
            <p className="eyebrow">Universo Evidenziato</p>
            {activeParticle.logo ? (
              <img className="universe-logo" src={activeParticle.logo} alt="" aria-hidden="true" />
            ) : null}
            <h3>{activeParticle.teamName}</h3>
            <p className="universe-probability">{activeParticle.probabilityLabel}</p>
            <p className="section-copy">
              Questo mondo appartiene a {activeParticle.teamName}. Nello snapshot corrente controlla{' '}
              {activeParticle.probabilityLabel} del multiverso scudetto.
            </p>
          </div>
        ) : null}

        <div className="legend-list" aria-label="Legenda squadre">
          {teams.map((team) => (
            <div key={team.shortName} className="legend-item">
              {team.logo ? <img className="legend-logo" src={team.logo} alt="" aria-hidden="true" /> : null}
              <span
                className="legend-swatch"
                style={{
                  background: team.secondaryColor
                    ? `linear-gradient(135deg, ${team.color} 0 58%, ${team.secondaryColor} 58% 100%)`
                    : team.color,
                }}
                aria-hidden="true"
              />
              <span>{team.name}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default MultiverseView
