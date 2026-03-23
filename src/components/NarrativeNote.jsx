function NarrativeNote({ note, title, summaryStats }) {
  return (
    <div className="note-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Nota Editoriale</p>
          <h2>{title ?? 'Nota narrativa'}</h2>
        </div>
      </div>

      <p className="note-copy">
        {note ??
          'Aggiungi qui una breve sintesi editoriale per spiegare perche le probabilita si sono mosse e che cosa e cambiato nella corsa scudetto.'}
      </p>

      {summaryStats?.length ? (
        <div className="summary-stats">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="summary-stat">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default NarrativeNote
