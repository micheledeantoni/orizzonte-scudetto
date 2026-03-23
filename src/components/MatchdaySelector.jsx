function MatchdaySelector({ matchdays, selectedIndex, onSelectIndex }) {
  const selectedMatchday = matchdays[selectedIndex]

  return (
    <div className="matchday-selector">
      <div className="matchday-selector-top">
        <div>
          <p className="eyebrow">Navigazione</p>
          <h2>{selectedMatchday.label}</h2>
        </div>
        <div className="matchday-nav-buttons">
          <button
            type="button"
            className="ghost-button"
            onClick={() => onSelectIndex(selectedIndex - 1)}
            disabled={selectedIndex === 0}
          >
            Precedente
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => onSelectIndex(selectedIndex + 1)}
            disabled={selectedIndex === matchdays.length - 1}
          >
            Successiva
          </button>
        </div>
      </div>

      <label className="slider-label" htmlFor="matchday-slider">
        Giornata: <span>{selectedMatchday.id}</span>
      </label>
      <input
        id="matchday-slider"
        className="matchday-slider"
        type="range"
        min="0"
        max={matchdays.length - 1}
        step="1"
        value={selectedIndex}
        onChange={(event) => onSelectIndex(Number(event.target.value))}
        aria-valuetext={selectedMatchday.label}
      />

      <div className="matchday-markers" aria-hidden="true">
        {matchdays.map((matchday, index) => (
          <span
            key={matchday.id}
            className={index === selectedIndex ? 'matchday-marker is-active' : 'matchday-marker'}
          >
            {matchday.id}
          </span>
        ))}
      </div>
    </div>
  )
}

export default MatchdaySelector
