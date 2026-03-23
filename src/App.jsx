import { useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import MatchdaySelector from './components/MatchdaySelector'
import MultiverseView from './components/MultiverseView'
import TeamTable from './components/TeamTable'
import EvolutionChart from './components/EvolutionChart'
import NarrativeNote from './components/NarrativeNote'
import seasonData from './data/seasons/serie-a-2025.json'
import {
  buildEvolutionSeries,
  buildUniverseParticles,
  formatDateLabel,
  getMatchdayIndexFromQuery,
  getTeamDeltas,
  updateMatchdayQuery,
} from './utils/dataHelpers'

function App() {
  const season = seasonData
  const initialIndex = getMatchdayIndexFromQuery(season.matchdays)
  const [selectedIndex, setSelectedIndex] = useState(initialIndex)
  const [activeTeams, setActiveTeams] = useState([])

  const selectedMatchday = season.matchdays[selectedIndex]
  const previousMatchday = selectedIndex > 0 ? season.matchdays[selectedIndex - 1] : null

  const rankedTeams = useMemo(() => {
    const deltas = getTeamDeltas(selectedMatchday, previousMatchday)

    return [...selectedMatchday.teams]
      .sort((firstTeam, secondTeam) => secondTeam.probability - firstTeam.probability)
      .map((team) => ({
        ...team,
        delta: deltas.get(team.shortName),
      }))
  }, [previousMatchday, selectedMatchday])

  const particles = useMemo(
    () => buildUniverseParticles(rankedTeams, selectedMatchday.id),
    [rankedTeams, selectedMatchday.id],
  )

  const series = useMemo(() => buildEvolutionSeries(season.matchdays), [season.matchdays])

  useEffect(() => {
    if (activeTeams.length === 0) {
      setActiveTeams(series.map((team) => team.shortName))
    }
  }, [series, activeTeams.length])

  useEffect(() => {
    updateMatchdayQuery(selectedMatchday.id)
  }, [selectedMatchday.id])

  const visibleSeries = series.filter((team) => activeTeams.includes(team.shortName))

  const handleToggleTeam = (shortName) => {
    setActiveTeams((currentTeams) =>
      currentTeams.includes(shortName)
        ? currentTeams.filter((team) => team !== shortName)
        : [...currentTeams, shortName],
    )
  }

  const handleSelectIndex = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= season.matchdays.length) {
      return
    }

    setSelectedIndex(nextIndex)
  }

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" aria-hidden="true" />
      <div className="background-orb background-orb-right" aria-hidden="true" />
      <main className="page">
        <Hero
          competition={season.competition}
          season={season.season}
          title={season.hero?.title}
          subtitle={season.hero?.subtitle}
          currentLabel={selectedMatchday.label}
          dateLabel={formatDateLabel(selectedMatchday.date)}
        />

        <section className="card controls-card" aria-label="Matchday controls">
          <MatchdaySelector
            matchdays={season.matchdays}
            selectedIndex={selectedIndex}
            onSelectIndex={handleSelectIndex}
          />
        </section>

        <section className="card multiverse-card">
          <div className="section-heading section-heading-featured">
            <div>
              <p className="eyebrow">Il Multiverso</p>
              <h2>100 universi, un solo scudetto</h2>
            </div>
            <p className="section-copy">
              Ogni particella rappresenta un possibile finale di stagione. Passa sopra o tocca un
              universo per vedere quale squadra controlla quel mondo.
            </p>
          </div>
          <MultiverseView particles={particles} teams={rankedTeams} />
        </section>

        <section className="content-grid lower-grid">
          <div className="stack">

            <section className="card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Evoluzione</p>
                  <h2>Come si muove la corsa scudetto</h2>
                </div>
                <p className="section-copy">
                  Una cronologia costruita a mano delle probabilita Bayesiane di titolo giornata per
                  giornata.
                </p>
              </div>
              <EvolutionChart
                series={visibleSeries}
                allSeries={series}
                activeTeams={activeTeams}
                onToggleTeam={handleToggleTeam}
                selectedMatchdayId={selectedMatchday.id}
              />
            </section>
          </div>

          <div className="stack">
            <section className="card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Classifica Probabilistica</p>
                  <h2>Quadro attuale</h2>
                </div>
                <p className="section-copy">
                  Ordinata per probabilita di vincere il titolo, con punti attesi e variazione
                  rispetto alla giornata precedente.
                </p>
              </div>
              <TeamTable teams={rankedTeams} showDelta={Boolean(previousMatchday)} />
            </section>

            <section className="card">
              <NarrativeNote
                note={selectedMatchday.note}
                title={selectedMatchday.storyTitle}
                summaryStats={selectedMatchday.summaryStats}
              />
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
