import { useMemo } from 'react'
import { formatProbability } from '../utils/dataHelpers'

const CHART_WIDTH = 720
const CHART_HEIGHT = 320
const PADDING = 28

function EvolutionChart({ series, allSeries, activeTeams, onToggleTeam, selectedMatchdayId }) {
  const matchdayIds = useMemo(
    () => Array.from(new Set(allSeries.flatMap((team) => team.values.map((value) => value.matchdayId)))),
    [allSeries],
  )

  const paths = useMemo(() => {
    if (matchdayIds.length <= 1) {
      return []
    }

    return series.map((team) => {
      const path = team.values
        .map((value, index) => {
          const x =
            PADDING + (index / (team.values.length - 1 || 1)) * (CHART_WIDTH - PADDING * 2)
          const y = CHART_HEIGHT - PADDING - value.probability * (CHART_HEIGHT - PADDING * 2)
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
        })
        .join(' ')

      return { ...team, path }
    })
  }, [matchdayIds.length, series])

  return (
    <div className="evolution-chart">
      <div className="team-toggle-list" aria-label="Mostra o nascondi squadre nel grafico">
        {allSeries.map((team) => {
          const isActive = activeTeams.includes(team.shortName)

          return (
            <button
              key={team.shortName}
              type="button"
              className={isActive ? 'team-toggle is-active' : 'team-toggle'}
              onClick={() => onToggleTeam(team.shortName)}
              style={{
                '--toggle-color': team.color,
              }}
            >
              <span className="legend-swatch" style={{ background: team.color }} aria-hidden="true" />
              {team.shortName}
            </button>
          )
        })}
      </div>

      <div className="chart-frame">
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Grafico evoluzione probabilita">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = CHART_HEIGHT - PADDING - tick * (CHART_HEIGHT - PADDING * 2)
            return (
              <g key={tick}>
                <line className="chart-gridline" x1={PADDING} y1={y} x2={CHART_WIDTH - PADDING} y2={y} />
                <text className="chart-axis-label" x="6" y={y + 4}>
                  {formatProbability(tick)}
                </text>
              </g>
            )
          })}

          {matchdayIds.map((matchdayId, index) => {
            const x = PADDING + (index / (matchdayIds.length - 1 || 1)) * (CHART_WIDTH - PADDING * 2)
            const isSelected = matchdayId === selectedMatchdayId

            return (
              <g key={matchdayId}>
                <line
                  className={isSelected ? 'chart-vertical is-selected' : 'chart-vertical'}
                  x1={x}
                  y1={PADDING}
                  x2={x}
                  y2={CHART_HEIGHT - PADDING}
                />
                <text className="chart-axis-label" x={x} y={CHART_HEIGHT - 8} textAnchor="middle">
                  G {matchdayId}
                </text>
              </g>
            )
          })}

          {paths.map((team) => (
            <g key={team.shortName}>
              <path d={team.path} fill="none" stroke={team.color} strokeWidth="3" strokeLinecap="round" />
              {team.values.map((value, index) => {
                const x =
                  PADDING + (index / (team.values.length - 1 || 1)) * (CHART_WIDTH - PADDING * 2)
                const y =
                  CHART_HEIGHT - PADDING - value.probability * (CHART_HEIGHT - PADDING * 2)
                const isSelected = value.matchdayId === selectedMatchdayId

                return (
                  <circle
                    key={`${team.shortName}-${value.matchdayId}`}
                    cx={x}
                    cy={y}
                    r={isSelected ? 5 : 3.5}
                    fill={team.color}
                    opacity={isSelected ? 1 : 0.8}
                  />
                )
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default EvolutionChart
