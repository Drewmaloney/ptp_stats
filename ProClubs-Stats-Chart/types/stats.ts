export type TeamStats = {
  name: string
  seasons: number
  wins: number
  losses: number
  otl: number
  goals: number
  goalsAgainst: number
  record: string
  rankingPoints: string
  promotions: string
  relegations: string
  bestDivision: number
  currentDivision: number
  divGroupsWon: string
  leaguesWon: string
  titlesWon: string
  starLevel: string
}

export type PlayerStats = {
  name: string
  favoritePosition: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  plusMinus: number
  shots: number
  shotPct: number
  saves: number
  savesPct: number
  gaa: number
  breakaways: number
  breakawaysSaved: number
  breakawayPct: number
  passes: number
  passesAttempted: number
  passPct: number
  hits: number
  takeaways: number
  interceptions: number
  blocks: number
  record: string
  winPct: number
  pointspg: number
  gwg: number
  hitspg: number
}

