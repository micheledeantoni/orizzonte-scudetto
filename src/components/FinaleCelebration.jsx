function FinaleCelebration({ celebration, team }) {
  if (!celebration) {
    return null
  }

  const fireworks = Array.from({ length: 9 }, (_, index) => index)

  return (
    <section className="card finale-card" aria-label="Celebrazione finale">
      <div className="finale-fireworks" aria-hidden="true">
        {fireworks.map((index) => (
          <span
            key={index}
            className={`firework firework-${index + 1}`}
            style={{
              '--firework-primary': team?.color ?? '#6EC5FF',
              '--firework-secondary': team?.secondaryColor ?? '#111111',
            }}
          />
        ))}
      </div>

      <div className="finale-copy">
        <p className="eyebrow">{celebration.eyebrow ?? 'Celebrazione'}</p>
        <h2>{celebration.title}</h2>
        <p className="section-copy finale-lead">{celebration.message}</p>
        <p className="finale-thanks">{celebration.thanks}</p>
      </div>
    </section>
  )
}

export default FinaleCelebration
