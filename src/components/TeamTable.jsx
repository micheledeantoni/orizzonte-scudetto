import { formatPoints, formatProbability, formatSignedDelta } from '../utils/dataHelpers'

function TeamTable({ teams, showDelta }) {
  return (
    <div className="team-table" role="table" aria-label="Probabilita scudetto">
      <div className="team-table-head" role="rowgroup">
        <div className="team-row team-row-header" role="row">
          <span role="columnheader">Squadra</span>
          <span role="columnheader">Probabilita titolo</span>
          <span role="columnheader">Punti attesi</span>
          <span role="columnheader">{showDelta ? 'Delta' : 'Base'}</span>
        </div>
      </div>

      <div className="team-table-body" role="rowgroup">
        {teams.map((team) => (
          <div key={team.shortName} className="team-row" role="row">
            <div className="team-cell team-identity" role="cell">
              {team.logo ? (
                <img className="team-logo" src={team.logo} alt="" aria-hidden="true" />
              ) : null}
              <span
                className="team-color"
                style={{
                  background: team.secondaryColor
                    ? `linear-gradient(180deg, ${team.color} 0 58%, ${team.secondaryColor} 58% 100%)`
                    : team.color,
                }}
                aria-hidden="true"
              />
              <div className="team-text">
                <strong className="team-name">{team.name}</strong>
                <span className="team-code">{team.shortName}</span>
              </div>
            </div>

            <div className="team-cell probability-cell" role="cell">
              <strong>{formatProbability(team.probability)}</strong>
              <div className="probability-bar-track" aria-hidden="true">
                <div
                  className="probability-bar-fill"
                  style={{
                    width: `${team.probability * 100}%`,
                    background: team.secondaryColor
                      ? `linear-gradient(90deg, ${team.color} 0 70%, ${team.secondaryColor} 70% 100%)`
                      : team.color,
                  }}
                />
              </div>
            </div>

            <div className="team-cell" role="cell">
              <strong>{formatPoints(team.projectedPoints)}</strong>
              {team.pointsCI95?.length === 2 ? (
                <span className="team-subvalue">
                  IC 95%: {formatPoints(team.pointsCI95[0])}-{formatPoints(team.pointsCI95[1])}
                </span>
              ) : null}
            </div>

            <div className="team-cell" role="cell">
              {showDelta && typeof team.delta === 'number' ? (
                <span className={team.delta >= 0 ? 'delta-pill is-positive' : 'delta-pill is-negative'}>
                  {formatSignedDelta(team.delta)}
                </span>
              ) : (
                <span className="delta-placeholder">Primo snapshot</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamTable
