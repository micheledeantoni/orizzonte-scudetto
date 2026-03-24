export function formatProbability(probability) {
  return `${(probability * 100).toFixed(probability * 100 % 1 === 0 ? 0 : 1)}%`
}

export function formatPoints(points) {
  return Number.isInteger(points) ? `${points}` : `${points.toFixed(1)}`
}

export function formatSignedDelta(delta) {
  const value = delta * 100
  const display = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)
  return `${delta >= 0 ? '+' : ''}${display} pp`
}

export function formatDateLabel(dateString) {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function buildEvolutionSeries(matchdays) {
  const teamMap = new Map()

  matchdays.forEach((matchday) => {
    matchday.teams.forEach((team) => {
      if (!teamMap.has(team.shortName)) {
        teamMap.set(team.shortName, {
          name: team.name,
          shortName: team.shortName,
          color: team.color ?? '#ffffff',
          values: [],
        })
      }

      teamMap.get(team.shortName).values.push({
        matchdayId: matchday.id,
        probability: team.probability,
      })
    })
  })

  return [...teamMap.values()]
}

export function getTeamDeltas(currentMatchday, previousMatchday) {
  const deltas = new Map()

  if (!previousMatchday) {
    return deltas
  }

  currentMatchday.teams.forEach((team) => {
    const previousTeam = previousMatchday.teams.find(
      (candidate) => candidate.shortName === team.shortName,
    )

    if (previousTeam) {
      deltas.set(team.shortName, team.probability - previousTeam.probability)
    }
  })

  return deltas
}

export function buildUniverseParticles(teams, seed = 0) {
  const universeCount = 1000
  const totalProbability = teams.reduce((sum, team) => sum + Math.max(team.probability, 0), 0) || 1
  const normalizedTeams = teams.map((team) => ({
    ...team,
    normalizedProbability: Math.max(team.probability, 0) / totalProbability,
  }))

  const counts = normalizedTeams.map((team) => ({
    ...team,
    count: Math.floor(team.normalizedProbability * universeCount),
  }))

  let assignedCount = counts.reduce((total, team) => total + team.count, 0)
  const sortedByRemainder = [...normalizedTeams]
    .map((team) => ({
      ...team,
      remainder:
        team.normalizedProbability * universeCount -
        Math.floor(team.normalizedProbability * universeCount),
    }))
    .sort((firstTeam, secondTeam) => secondTeam.remainder - firstTeam.remainder)

  let cursor = 0
  while (assignedCount < universeCount && sortedByRemainder.length > 0) {
    const shortName = sortedByRemainder[cursor % sortedByRemainder.length].shortName
    const target = counts.find((team) => team.shortName === shortName)
    target.count += 1
    assignedCount += 1
    cursor += 1
  }

  const particles = []
  let particleIndex = 0

  counts.forEach((team) => {
    for (let order = 1; order <= team.count; order += 1) {
      particles.push({
        id: `${team.shortName}-${order}-${seed}`,
        order,
        teamName: team.name,
        shortName: team.shortName,
        color: team.color,
        secondaryColor: team.secondaryColor,
        logo: team.logo,
        narrative: team.universeNarrative,
        shareLabel: `${team.count} / ${universeCount} universi`,
        probabilityLabel: formatProbability(team.probability),
      })

      particleIndex += 1
    }
  })

  return shuffleParticles(particles, seed)
}

function shuffleParticles(particles, seed) {
  const shuffledParticles = [...particles]
  let state = (seed || 1) * 2147483647

  const nextRandom = () => {
    state = (state * 48271) % 2147483647
    return state / 2147483647
  }

  for (let index = shuffledParticles.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(nextRandom() * (index + 1))
    const currentParticle = shuffledParticles[index]
    shuffledParticles[index] = shuffledParticles[randomIndex]
    shuffledParticles[randomIndex] = currentParticle
  }

  return shuffledParticles
}

export function getMatchdayIndexFromQuery(matchdays) {
  const params = new URLSearchParams(window.location.search)
  const matchdayId = Number(params.get('matchday'))
  const index = matchdays.findIndex((matchday) => matchday.id === matchdayId)
  return index >= 0 ? index : matchdays.length - 1
}

export function updateMatchdayQuery(matchdayId) {
  const url = new URL(window.location.href)
  url.searchParams.set('matchday', `${matchdayId}`)
  window.history.replaceState({}, '', url)
}
