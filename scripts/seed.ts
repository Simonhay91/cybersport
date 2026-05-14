import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spl'

async function connect() {
  await mongoose.connect(MONGODB_URI)
}

// Models (inline schemas for seed)
const PlayerSchema = new mongoose.Schema({ nickname: String, fullName: String, role: String, status: String, team: mongoose.Schema.Types.ObjectId, steam: String, faceit: String })
const TeamSchema = new mongoose.Schema({ name: String, slug: String, tag: String, city: String, logo: String, status: String, wins: Number, losses: Number, roundsFor: Number, roundsAgainst: Number, captain: mongoose.Schema.Types.ObjectId, players: [mongoose.Schema.Types.ObjectId], description: String }, { timestamps: true })
const TournamentSchema = new mongoose.Schema({ name: String, slug: String, status: String, prizePool: Number, startDate: Date, endDate: Date, format: String, registrationOpen: Boolean, maxTeams: Number, teams: [mongoose.Schema.Types.ObjectId], description: String, prizeDistribution: [{ place: Number, amount: Number }] }, { timestamps: true })
const GroupSchema = new mongoose.Schema({ name: String, tournament: mongoose.Schema.Types.ObjectId, status: String, format: String, teams: [mongoose.Schema.Types.ObjectId], matches: [mongoose.Schema.Types.ObjectId], first: mongoose.Schema.Types.ObjectId, second: mongoose.Schema.Types.ObjectId })
const MatchSchema = new mongoose.Schema({ tournament: mongoose.Schema.Types.ObjectId, group: mongoose.Schema.Types.ObjectId, teamA: mongoose.Schema.Types.ObjectId, teamB: mongoose.Schema.Types.ObjectId, scoreA: Number, scoreB: Number, format: String, status: String, stage: String, round: Number, bracket: String, winner: mongoose.Schema.Types.ObjectId, loser: mongoose.Schema.Types.ObjectId, scheduledAt: Date }, { timestamps: true })
const ApplicationSchema = new mongoose.Schema({ teamName: String, tag: String, city: String, captain: Object, players: Array, reserve: Object, status: String, submittedAt: Date })

const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema)
const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema)
const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema)
const Group = mongoose.models.Group || mongoose.model('Group', GroupSchema)
const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema)
const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema)

const teamData = [
  // Group A (GSL): [0]=Aurora, [1]=Team NEXT, [2]=NAVI(placeholder groupA), [3]=9Pandas
  // Group B (DE):  [0]=Aurora 3W2L, [1]=TeamNEXT 3W1L, [2]=NAVI 3W0L, [3]=9P 1W2L,
  //                [4]=Heroic 2W2L, [5]=G2 0W2L, [6]=VP 1W2L, [7]=LynVision 0W2L
  // wins/losses = total across both groups
  { name: 'Aurora',        tag: 'AUR',  city: 'Санкт-Петербург', wins: 6,  losses: 2, roundsFor: 98,  roundsAgainst: 68,  players: ['S1mple', 'electroNic', 'Boombl4', 'Perfecto', 'b1t'] },
  { name: 'Team NEXT',     tag: 'NEXT', city: 'Москва',           wins: 4,  losses: 3, roundsFor: 76,  roundsAgainst: 72,  players: ['chopper', 'magixx', 'sh1ro', 'iDISBALANCE', 'zont1x'] },
  { name: 'Natus Vincere', tag: 'NAVI', city: 'Киев',             wins: 8,  losses: 0, roundsFor: 129, roundsAgainst: 56,  players: ['tN1R', 'w0nderful', 'Aleksib', 'JDC', 'im'] },
  { name: '9Pandas',       tag: '9P',   city: '—',                wins: 1,  losses: 5, roundsFor: 56,  roundsAgainst: 92,  players: ['karrigan', 'broky', 'ropz', 'rain', 'frozen'] },
  { name: 'Heroic',        tag: 'HER',  city: 'Копенгаген',       wins: 2,  losses: 2, roundsFor: 52,  roundsAgainst: 38,  players: ['cadiaN', 'stavn', 'jabbi', 'sjuush', 'TeSeS'] },
  { name: 'G2 Esports',    tag: 'G2',   city: 'Берлин',           wins: 0,  losses: 2, roundsFor: 22,  roundsAgainst: 40,  players: ['huNter', 'm0NESY', 'jks', 'NiKo', 'HooXi'] },
  { name: 'Virtus.pro',    tag: 'VP',   city: 'Москва',           wins: 1,  losses: 2, roundsFor: 36,  roundsAgainst: 42,  players: ['Jame', 'n0rb3r7', 'fame', 'FL1T', 'Qikert'] },
  { name: 'Lynn Vision',   tag: 'LV',   city: 'Шанхай',           wins: 2,  losses: 3, roundsFor: 58,  roundsAgainst: 62,  players: ['blameF', 'br0', 'k0nfig', 'Staehr', 'Buzz'] },
]

async function seed() {
  await connect()
  console.log('✅ Connected to MongoDB:', MONGODB_URI)

  // Clear existing data
  await Promise.all([
    Player.deleteMany({}),
    Team.deleteMany({}),
    Tournament.deleteMany({}),
    Group.deleteMany({}),
    Match.deleteMany({}),
    Application.deleteMany({}),
  ])
  console.log('🧹 Cleared existing data')

  // Create teams
  const teams: mongoose.Document[] = []
  for (const td of teamData) {
    const playerDocs = await Promise.all(
      td.players.map(nick => Player.create({ nickname: nick, role: 'rifler', status: 'main' }))
    )
    const captain = await Player.create({ nickname: td.tag + '-cap', role: 'IGL', status: 'main' })
    const team = await Team.create({
      name: td.name,
      slug: td.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tag: td.tag,
      city: td.city,
      status: 'confirmed',
      wins: td.wins,
      losses: td.losses,
      roundsFor: td.roundsFor,
      roundsAgainst: td.roundsAgainst,
      captain: captain._id,
      players: [captain._id, ...playerDocs.map(p => p._id)],
      description: `Профессиональная CS2 команда ${td.name}.`,
    })
    await Player.updateMany({ _id: { $in: [captain._id, ...playerDocs.map(p => p._id)] } }, { team: team._id })
    teams.push(team)
  }
  console.log(`✅ Created ${teams.length} teams`)

  // Create tournament
  const tournament = await Tournament.create({
    name: 'SPL Winter Season 1',
    slug: 'spl-winter-season-1',
    status: 'live',
    prizePool: 200000,
    startDate: new Date('2024-02-22'),
    endDate: new Date('2024-03-31'),
    format: 'BO1 / BO3',
    registrationOpen: true,
    maxTeams: 128,
    teams: teams.map(t => t._id),
    description: 'Первый сезон Siberian Pro League. 8 лучших команд СНГ борются за призовой фонд 200,000 ₽.',
    prizeDistribution: [{ place: 1, amount: 100000 }, { place: 2, amount: 60000 }, { place: 3, amount: 40000 }],
  })
  console.log('✅ Created tournament:', tournament.name)

  // Create groups
  const groupA = await Group.create({
    name: 'Группа А',
    tournament: tournament._id,
    status: 'live',
    format: 'gsl-4',
    teams: teams.slice(0, 4).map(t => t._id),
  })
  const groupB = await Group.create({
    name: 'Группа Б',
    tournament: tournament._id,
    status: 'live',
    format: 'de-8',
    teams: teams.map(t => t._id), // all 8 teams
  })
  console.log('✅ Created groups (A=GSL-4, B=DE-8)')

  const base = new Date('2025-05-16T15:00:00Z') // 18:00 МСК

  function addHours(h: number) {
    return new Date(base.getTime() + h * 3600000)
  }

  // GSL Group A: [0]=Aurora, [1]=Team NEXT, [3]=9Pandas, [7]=Lynn Vision
  // Опенеры
  const matchA1 = await Match.create({ tournament: tournament._id, group: groupA._id, teamA: teams[0]._id, teamB: teams[3]._id, scoreA: 2, scoreB: 0, format: 'BO3', status: 'finished', stage: 'Opening Match', round: 1, winner: teams[0]._id, loser: teams[3]._id, scheduledAt: addHours(0) })
  const matchA2 = await Match.create({ tournament: tournament._id, group: groupA._id, teamA: teams[1]._id, teamB: teams[7]._id, scoreA: 2, scoreB: 0, format: 'BO3', status: 'finished', stage: 'Opening Match', round: 1, winner: teams[1]._id, loser: teams[7]._id, scheduledAt: addHours(3) })
  // Матч победителей
  const matchA3 = await Match.create({ tournament: tournament._id, group: groupA._id, teamA: teams[0]._id, teamB: teams[1]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'Winners Match', round: 2, winner: teams[0]._id, loser: teams[1]._id, scheduledAt: addHours(24) })
  // Матч на вылет
  const matchA4 = await Match.create({ tournament: tournament._id, group: groupA._id, teamA: teams[3]._id, teamB: teams[7]._id, scoreA: 1, scoreB: 2, format: 'BO3', status: 'finished', stage: 'Elimination Match', round: 2, winner: teams[7]._id, loser: teams[3]._id, scheduledAt: addHours(27) })
  // Решающий матч
  const matchA5 = await Match.create({ tournament: tournament._id, group: groupA._id, teamA: teams[1]._id, teamB: teams[7]._id, scoreA: 1, scoreB: 2, format: 'BO3', status: 'finished', stage: 'Decider Match', round: 3, winner: teams[7]._id, loser: teams[1]._id, scheduledAt: addHours(46) })

  await Group.findByIdAndUpdate(groupA._id, {
    matches: [matchA1._id, matchA2._id, matchA3._id, matchA4._id, matchA5._id],
    first: teams[0]._id,
    second: teams[7]._id,
  })

  // ── Group B: Double Elimination, 8 teams ──────────────────────────────────
  // Teams in group B: [4]=Heroic, [5]=G2, [6]=VP, [2]=NAVI, [0]=Aurora, [1]=Team NEXT, [3]=9Pandas, [7]=Lynn Vision
  // WB Round 1 (QF) — 4 matches
  const bWB1M1 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[4]._id, teamB: teams[7]._id, scoreA: 2, scoreB: 0, format: 'BO3', status: 'finished', stage: 'WB Round 1', round: 1, bracket: 'WB', winner: teams[4]._id, loser: teams[7]._id, scheduledAt: addHours(72) })
  const bWB1M2 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[2]._id, teamB: teams[3]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'WB Round 1', round: 1, bracket: 'WB', winner: teams[2]._id, loser: teams[3]._id, scheduledAt: addHours(75) })
  const bWB1M3 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[6]._id, teamB: teams[1]._id, scoreA: 0, scoreB: 2, format: 'BO3', status: 'finished', stage: 'WB Round 1', round: 1, bracket: 'WB', winner: teams[1]._id, loser: teams[6]._id, scheduledAt: addHours(78) })
  const bWB1M4 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[0]._id, teamB: teams[5]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'WB Round 1', round: 1, bracket: 'WB', winner: teams[0]._id, loser: teams[5]._id, scheduledAt: addHours(81) })

  // WB Round 2 (SF) — 2 matches
  const bWB2M1 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[4]._id, teamB: teams[2]._id, scoreA: 1, scoreB: 2, format: 'BO3', status: 'finished', stage: 'WB Semifinal', round: 2, bracket: 'WB', winner: teams[2]._id, loser: teams[4]._id, scheduledAt: addHours(96) })
  const bWB2M2 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[1]._id, teamB: teams[0]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'WB Semifinal', round: 2, bracket: 'WB', winner: teams[1]._id, loser: teams[0]._id, scheduledAt: addHours(99) })

  // WB Final — 1 match
  const bWBFinal = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[2]._id, teamB: teams[1]._id, scoreA: 2, scoreB: 0, format: 'BO3', status: 'finished', stage: 'WB Final', round: 3, bracket: 'WB', winner: teams[2]._id, loser: teams[1]._id, scheduledAt: addHours(120) })

  // LB Round 1 — 2 matches (losers from WB QF)
  const bLB1M1 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[7]._id, teamB: teams[3]._id, scoreA: 1, scoreB: 2, format: 'BO3', status: 'finished', stage: 'LB Round 1', round: 1, bracket: 'LB', winner: teams[3]._id, loser: teams[7]._id, scheduledAt: addHours(97) })
  const bLB1M2 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[6]._id, teamB: teams[5]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'LB Round 1', round: 1, bracket: 'LB', winner: teams[6]._id, loser: teams[5]._id, scheduledAt: addHours(100) })

  // LB Round 2 — 2 matches (LB winners vs WB SF losers)
  const bLB2M1 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[4]._id, teamB: teams[3]._id, scoreA: 2, scoreB: 0, format: 'BO3', status: 'finished', stage: 'LB Round 2', round: 2, bracket: 'LB', winner: teams[4]._id, loser: teams[3]._id, scheduledAt: addHours(121) })
  const bLB2M2 = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[0]._id, teamB: teams[6]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'LB Round 2', round: 2, bracket: 'LB', winner: teams[0]._id, loser: teams[6]._id, scheduledAt: addHours(124) })

  // LB Semifinal — 1 match
  const bLBSF = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[4]._id, teamB: teams[0]._id, scoreA: 0, scoreB: 2, format: 'BO3', status: 'finished', stage: 'LB Semifinal', round: 3, bracket: 'LB', winner: teams[0]._id, loser: teams[4]._id, scheduledAt: addHours(144) })

  // LB Final — loser of WB Final vs LB SF winner
  const bLBFinal = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[1]._id, teamB: teams[0]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'LB Final', round: 4, bracket: 'LB', winner: teams[1]._id, loser: teams[0]._id, scheduledAt: addHours(168) })

  // Grand Final — WB Final winner vs LB Final winner
  const bGF = await Match.create({ tournament: tournament._id, group: groupB._id, teamA: teams[2]._id, teamB: teams[1]._id, format: 'BO5', status: 'upcoming', stage: 'Grand Final', round: 1, bracket: 'GF', scheduledAt: addHours(192) })

  await Group.findByIdAndUpdate(groupB._id, {
    status: 'live',
    matches: [bWB1M1._id, bWB1M2._id, bWB1M3._id, bWB1M4._id, bWB2M1._id, bWB2M2._id, bWBFinal._id, bLB1M1._id, bLB1M2._id, bLB2M1._id, bLB2M2._id, bLBSF._id, bLBFinal._id, bGF._id],
    first: teams[2]._id,
    second: teams[1]._id,
  })

  console.log('✅ Created matches for Group A and B')

  // Playoff bracket: QF (round 1) → SF (round 2) → Final (round 3)
  // QF — Round 1 (4 matches, 8 teams)
  await Match.create({ tournament: tournament._id, teamA: teams[2]._id, teamB: teams[7]._id, scoreA: 2, scoreB: 0, format: 'BO3', status: 'finished', stage: 'Quarterfinal', round: 1, winner: teams[2]._id, scheduledAt: addHours(96) })
  await Match.create({ tournament: tournament._id, teamA: teams[0]._id, teamB: teams[5]._id, scoreA: 2, scoreB: 1, format: 'BO3', status: 'finished', stage: 'Quarterfinal', round: 1, winner: teams[0]._id, scheduledAt: addHours(99) })
  await Match.create({ tournament: tournament._id, teamA: teams[4]._id, teamB: teams[6]._id, scoreA: 1, scoreB: 2, format: 'BO3', status: 'finished', stage: 'Quarterfinal', round: 1, winner: teams[6]._id, scheduledAt: addHours(102) })
  await Match.create({ tournament: tournament._id, teamA: teams[1]._id, teamB: teams[3]._id, scoreA: 0, scoreB: 2, format: 'BO3', status: 'finished', stage: 'Quarterfinal', round: 1, winner: teams[3]._id, scheduledAt: addHours(105) })

  // SF — Round 2 (2 matches)
  await Match.create({ tournament: tournament._id, teamA: teams[2]._id, teamB: teams[6]._id, scoreA: 2, scoreB: 0, format: 'BO3', status: 'finished', stage: 'Semifinal', round: 2, winner: teams[2]._id, scheduledAt: addHours(120) })
  await Match.create({ tournament: tournament._id, teamA: teams[0]._id, teamB: teams[3]._id, scoreA: 1, scoreB: 2, format: 'BO3', status: 'finished', stage: 'Semifinal', round: 2, winner: teams[3]._id, scheduledAt: addHours(123) })

  // Final — Round 3
  await Match.create({ tournament: tournament._id, teamA: teams[2]._id, teamB: teams[3]._id, format: 'BO5', status: 'upcoming', stage: 'Grand Final', round: 3, scheduledAt: addHours(168) })

  console.log('✅ Created playoff bracket (QF + SF + Final, 7 matches)')

  // Sample applications
  await Promise.all([
    Application.create({ teamName: 'Team Alpha', tag: 'ALPH', city: 'Москва', captain: { nickname: 'alpha_cap', telegram: '@alpha_cap' }, players: [{ nickname: 'alpha1' }, { nickname: 'alpha2' }, { nickname: 'alpha3' }, { nickname: 'alpha4' }], status: 'new', submittedAt: new Date() }),
    Application.create({ teamName: 'Wolves CS', tag: 'WLV', city: 'Новосибирск', captain: { nickname: 'wolfman', telegram: '@wolfman_cs' }, players: [{ nickname: 'wolf1' }, { nickname: 'wolf2' }, { nickname: 'wolf3' }, { nickname: 'wolf4' }], status: 'reviewing', submittedAt: new Date(Date.now() - 86400000) }),
    Application.create({ teamName: 'Phoenix Squad', tag: 'PHX', city: 'Екатеринбург', captain: { nickname: 'phoenix', telegram: '@phoenix_cs' }, players: [{ nickname: 'phx1' }, { nickname: 'phx2' }, { nickname: 'phx3' }, { nickname: 'phx4' }], status: 'new', submittedAt: new Date(Date.now() - 7200000) }),
  ])
  console.log('✅ Created 3 sample applications')

  console.log('\n🎉 Seed completed successfully!')
  console.log('📦 Data created:')
  console.log(`  - ${teams.length} teams`)
  console.log('  - 1 tournament (SPL Winter Season 1)')
  console.log('  - 2 GSL groups (A + Б)')
  console.log('  - 26 matches (5 GSL-A + 14 DE-B + 7 Playoffs)')
  console.log('  - 3 applications')
  console.log('\n🔑 Admin credentials:')
  console.log('  Email: admin@spl.gg')
  console.log('  Password: admin123')
  console.log('\n🌐 Open: http://localhost:3000')
  console.log('🔧 Admin: http://localhost:3000/admin')

  await mongoose.disconnect()
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
