'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface TeamRef { _id: string; name: string; slug: string; logo?: string; tag: string }
interface MatchRef {
  _id: string
  teamA?: TeamRef
  teamB?: TeamRef
  scoreA: number
  scoreB: number
  status: string
  stage: string
  round?: number
  bracket?: 'WB' | 'LB' | 'GF'
  scheduledAt?: string
  winner?: { _id: string }
}
interface GroupTeam extends TeamRef {
  wins: number
  losses: number
  roundsFor: number
  roundsAgainst: number
  form?: ('W' | 'L')[]
  place?: number | null
}
interface GroupData {
  _id: string
  name: string
  status: string
  format?: 'gsl-4' | 'de-8' | 'round-robin'
  teams: GroupTeam[]
  matches: MatchRef[]
  first?: TeamRef
  second?: TeamRef
}

interface BracketViewProps {
  groups: GroupData[]
  playoffMatches: MatchRef[]
  activeView: string
  groupFilter?: string
  tournamentSlug: string
}

// ─── Date helper ──────────────────────────────────────────────────────────────
function formatMatchDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const months = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЯ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК']
  const day = d.getDate()
  const month = months[d.getMonth()]
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  return `${day} ${month}, ${hh}:${mm}`
}

// ─── Big GSL match card (matches screenshot) ─────────────────────────────────
function GSLMatchCard({ match, label }: { match?: MatchRef; label: string }) {
  if (!match) {
    return (
      <div style={{ width: '280px' }}>
        <div style={{
          fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          textAlign: 'center', marginBottom: '8px', fontWeight: 500,
        }}>
          {label}
        </div>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: '6px',
          padding: '14px 16px',
          height: '88px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
        </div>
      </div>
    )
  }

  const isFinished = match.status === 'finished'
  const winnerA = isFinished && match.winner?._id === match.teamA?._id
  const winnerB = isFinished && match.winner?._id === match.teamB?._id
  const dateLabel = formatMatchDate(match.scheduledAt)

  const TeamRow = ({ team, score, isWinner }: { team?: TeamRef; score: number; isWinner: boolean }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '8px', padding: '6px 0', minHeight: '30px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '24px', height: '24px', flexShrink: 0,
          background: 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '2px', overflow: 'hidden',
        }}>
          {team?.logo
            ? <Image src={team.logo} alt={team.name} width={24} height={24} style={{ objectFit: 'contain' }} />
            : <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>{team?.tag?.slice(0, 3) || '?'}</span>
          }
        </div>
        <span style={{
          fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.02em',
          color: !team ? 'var(--text-muted)' : 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {team?.name || 'TBD'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {isFinished && (
          <span style={{
            fontFamily: 'Rajdhani', fontSize: '20px', fontWeight: 700,
            color: isWinner ? 'var(--accent-yellow)' : 'var(--text-muted)',
            minWidth: '16px', textAlign: 'right',
          }}>
            {score}
          </span>
        )}
        {isWinner && (
          <span style={{
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'var(--accent-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontSize: '10px', fontWeight: 900, lineHeight: 1,
            flexShrink: 0,
          }}>✓</span>
        )}
      </div>
    </div>
  )

  return (
    <Link href={`/match/${match._id}`} style={{ textDecoration: 'none', display: 'block', width: '280px' }}>
      <div style={{
        fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        textAlign: 'center', marginBottom: '8px', fontWeight: 500,
      }}>
        {label}
      </div>
      <div style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${match.status === 'live' ? 'var(--accent-green)' : 'var(--border-default)'}`,
        borderRadius: '6px', padding: '8px 14px', position: 'relative',
        transition: 'border-color 0.15s',
      }}
        className="hover-yellow-border"
      >
        {/* Date stamp */}
        {dateLabel && (
          <div style={{
            position: 'absolute', top: '-9px', left: '12px',
            background: 'var(--bg-primary)',
            padding: '0 6px',
            fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <span style={{ fontSize: '10px' }}>⟲</span>
            <span>{dateLabel}</span>
          </div>
        )}
        <TeamRow team={match.teamA} score={match.scoreA} isWinner={winnerA} />
        <TeamRow team={match.teamB} score={match.scoreB} isWinner={winnerB} />
      </div>
    </Link>
  )
}

// ─── GSL Bracket layout with connectors ──────────────────────────────────────
function GSLBracket({ group }: { group: GroupData }) {
  const opener1 = group.matches[0]
  const opener2 = group.matches[1]
  const winnersMatch = group.matches[2]
  const elimMatch = group.matches[3]
  const decider = group.matches[4]

  // Coordinates for layout (within fixed-size relative container)
  // Card width 280, card height ~88
  const CARD_W = 280
  const CARD_H = 88
  const LABEL_H = 28 // space for the label above each card
  const COL_GAP = 60

  // Y centers (vertical center of each card body)
  const yOp1 = 60 + LABEL_H + CARD_H / 2   // ~132
  const yOp2 = 260 + LABEL_H + CARD_H / 2  // ~332
  const yWin = ((yOp1 + yOp2) / 2) - 80    // upper-mid ~152
  const yElim = ((yOp1 + yOp2) / 2) + 80   // lower-mid ~312
  const yDec = (yWin + yElim) / 2          // ~232

  const x1 = 0
  const x2 = CARD_W + COL_GAP
  const x3 = (CARD_W + COL_GAP) * 2

  // Top-left position for each card's WRAPPER (= label top)
  const topOp1 = 60
  const topOp2 = 260
  const topWin = yWin - CARD_H / 2 - LABEL_H
  const topElim = yElim - CARD_H / 2 - LABEL_H
  const topDec = yDec - CARD_H / 2 - LABEL_H

  const containerHeight = topOp2 + LABEL_H + CARD_H + 40
  const containerWidth = x3 + CARD_W

  const lineColor = '#c8ff00' // accent-yellow
  const lineThickness = 2

  // Connector path data
  // Each connector is a polyline through points.
  type Pt = { x: number; y: number }
  const connectors: Pt[][] = [
    // Opener1 → midpoint-1 (between Winners and Elim x), then split to Winners + Elim
    [
      { x: x1 + CARD_W, y: yOp1 },
      { x: x2 - COL_GAP / 2, y: yOp1 },
      { x: x2 - COL_GAP / 2, y: yWin },
      { x: x2, y: yWin },
    ],
    [
      { x: x1 + CARD_W, y: yOp1 },
      { x: x2 - COL_GAP / 2, y: yOp1 },
      { x: x2 - COL_GAP / 2, y: yElim },
      { x: x2, y: yElim },
    ],
    [
      { x: x1 + CARD_W, y: yOp2 },
      { x: x2 - COL_GAP / 2, y: yOp2 },
      { x: x2 - COL_GAP / 2, y: yWin },
      { x: x2, y: yWin },
    ],
    [
      { x: x1 + CARD_W, y: yOp2 },
      { x: x2 - COL_GAP / 2, y: yOp2 },
      { x: x2 - COL_GAP / 2, y: yElim },
      { x: x2, y: yElim },
    ],
    // Winners → Decider
    [
      { x: x2 + CARD_W, y: yWin },
      { x: x3 - COL_GAP / 2, y: yWin },
      { x: x3 - COL_GAP / 2, y: yDec },
      { x: x3, y: yDec },
    ],
    // Elim → Decider
    [
      { x: x2 + CARD_W, y: yElim },
      { x: x3 - COL_GAP / 2, y: yElim },
      { x: x3 - COL_GAP / 2, y: yDec },
      { x: x3, y: yDec },
    ],
  ]

  return (
    <div style={{
      position: 'relative',
      width: `${containerWidth}px`,
      height: `${containerHeight}px`,
      margin: '8px 0 32px',
    }}>
      {/* SVG connectors */}
      <svg
        width={containerWidth}
        height={containerHeight}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
      >
        {connectors.map((pts, i) => {
          const d = pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={lineColor}
              strokeWidth={lineThickness}
              strokeLinecap="square"
              strokeLinejoin="miter"
              opacity={0.85}
            />
          )
        })}
      </svg>

      {/* Cards (positioned absolutely) */}
      <div style={{ position: 'absolute', left: x1, top: topOp1, zIndex: 1 }}>
        <GSLMatchCard match={opener1} label="Открывающий матч" />
      </div>
      <div style={{ position: 'absolute', left: x1, top: topOp2, zIndex: 1 }}>
        <GSLMatchCard match={opener2} label="Открывающий матч" />
      </div>
      <div style={{ position: 'absolute', left: x2, top: topWin, zIndex: 1 }}>
        <GSLMatchCard match={winnersMatch} label="Матч победителей" />
      </div>
      <div style={{ position: 'absolute', left: x2, top: topElim, zIndex: 1 }}>
        <GSLMatchCard match={elimMatch} label="Матч на вылет" />
      </div>
      <div style={{ position: 'absolute', left: x3, top: topDec, zIndex: 1 }}>
        <GSLMatchCard match={decider} label="Решающий матч" />
      </div>
    </div>
  )
}

// ─── Standings table (matches screenshot) ────────────────────────────────────
function GSLStandingsTable({ group }: { group: GroupData }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-default)',
      borderRadius: '6px',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-default)' }}>
        <h3 style={{
          fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 700,
          textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.04em',
        }}>
          Турнирная таблица {group.name}
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              {[
                { label: '#', w: '40px' },
                { label: 'Команда', w: 'auto' },
                { label: 'Матчи', w: '80px' },
                { label: 'Победы', w: '90px' },
                { label: 'Поражения', w: '110px' },
                { label: 'За', w: '60px', group: 'РАУНДЫ' },
                { label: 'Против', w: '80px', group: 'РАУНДЫ' },
                { label: '+/-', w: '60px' },
                { label: 'Форма', w: '110px' },
              ].map(h => (
                <th key={h.label} style={{
                  padding: '12px 14px',
                  fontFamily: 'Inter', fontSize: '10px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontWeight: 600,
                  textAlign: h.label === '#' || h.label === 'Команда' ? 'left' : 'center',
                  width: h.w,
                }}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.teams.map((team, i) => {
              const played = team.wins + team.losses
              const diff = (team.roundsFor || 0) - (team.roundsAgainst || 0)
              const place = i + 1
              return (
                <tr key={team._id} style={{
                  borderBottom: i < group.teams.length - 1 ? '1px solid var(--border-default)' : 'none',
                }}>
                  <td style={{
                    padding: '14px',
                    fontFamily: 'Rajdhani', fontSize: '18px', fontWeight: 700,
                    color: place <= 2 ? 'var(--accent-yellow)' : 'var(--text-muted)',
                  }}>{place}</td>
                  <td style={{ padding: '14px' }}>
                    <Link href={`/teams/${team.slug}`} style={{
                      textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                      <div style={{
                        width: '24px', height: '24px',
                        background: 'var(--bg-tertiary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', borderRadius: '2px',
                      }}>
                        {team.logo
                          ? <Image src={team.logo} alt={team.name} width={24} height={24} style={{ objectFit: 'contain' }} />
                          : <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{team.tag?.slice(0, 3)}</span>
                        }
                      </div>
                      <span style={{
                        fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 700,
                        color: 'var(--text-primary)', textTransform: 'uppercase',
                      }}>{team.name}</span>
                    </Link>
                  </td>
                  <td style={{
                    padding: '14px', textAlign: 'center',
                    fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600,
                  }}>{played}</td>
                  <td style={{
                    padding: '14px', textAlign: 'center',
                    fontFamily: 'Rajdhani', fontSize: '16px', color: 'var(--accent-green)', fontWeight: 700,
                  }}>{team.wins}</td>
                  <td style={{
                    padding: '14px', textAlign: 'center',
                    fontFamily: 'Rajdhani', fontSize: '16px', color: 'var(--accent-red)', fontWeight: 700,
                  }}>{team.losses}</td>
                  <td style={{
                    padding: '14px', textAlign: 'center',
                    fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500,
                  }}>{team.roundsFor ?? 0}</td>
                  <td style={{
                    padding: '14px', textAlign: 'center',
                    fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500,
                  }}>{team.roundsAgainst ?? 0}</td>
                  <td style={{
                    padding: '14px', textAlign: 'center',
                    fontFamily: 'Rajdhani', fontSize: '15px',
                    color: diff > 0 ? 'var(--accent-green)' : diff < 0 ? 'var(--accent-red)' : 'var(--text-muted)',
                    fontWeight: 700,
                  }}>{diff > 0 ? `+${diff}` : diff}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      {(team.form ?? []).slice(-3).map((f, idx) => (
                        <span key={idx} style={{
                          width: '22px', height: '22px',
                          background: f === 'W' ? 'var(--accent-green)' : 'var(--accent-red)',
                          color: '#000',
                          fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: '3px',
                        }}>{f}</span>
                      ))}
                      {(team.form ?? []).length === 0 && (
                        <span style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── DE bracket section (WB or LB) — big GSL-style cards + SVG connectors ────
function DESection({
  rounds,
  byRound,
  labels,
  accentColor,
  sectionTitle,
}: {
  rounds: number[]
  byRound: Record<number, MatchRef[]>
  labels: Record<number, string>
  accentColor: string
  sectionTitle: string
}) {
  const CARD_W = 280
  const CARD_H = 100  // GSLMatchCard approximate height (label 28 + card body 72)
  const COL_GAP = 56

  if (rounds.length === 0) return null

  // Build layout: for each column, matches are evenly spread vertically
  // The first column has the most matches, each subsequent column halves
  const firstColCount = byRound[rounds[0]]?.length ?? 1

  // Calculate total height needed
  const totalRows = firstColCount
  const containerHeight = totalRows * CARD_H + (totalRows - 1) * 20 + 60

  // SVG connector paths: right-center of match → splits up/down → left-center of next match
  type Pt = { x: number; y: number }
  const connectors: Pt[][] = []

  rounds.forEach((round, colIdx) => {
    if (colIdx === rounds.length - 1) return // no connectors from last column
    const curMatches = byRound[round] ?? []
    const nextMatches = byRound[rounds[colIdx + 1]] ?? []
    const curCount = curMatches.length
    const nextCount = nextMatches.length
    const x1 = colIdx * (CARD_W + COL_GAP) + CARD_W
    const x2 = (colIdx + 1) * (CARD_W + COL_GAP)
    const xMid = x1 + COL_GAP / 2

    const getY = (count: number, idx: number) => {
      const spacing = containerHeight / count
      return spacing * idx + spacing / 2
    }

    // Each pair of current-col matches connects to one next-col match
    for (let ni = 0; ni < nextCount; ni++) {
      const src1 = ni * 2
      const src2 = ni * 2 + 1
      const yNext = getY(nextCount, ni)
      const y1 = getY(curCount, src1)
      const y2 = src2 < curCount ? getY(curCount, src2) : y1

      // From match src1 right edge → mid → next match left edge
      connectors.push([
        { x: x1, y: y1 },
        { x: xMid, y: y1 },
        { x: xMid, y: yNext },
        { x: x2, y: yNext },
      ])
      if (src2 < curCount) {
        connectors.push([
          { x: x1, y: y2 },
          { x: xMid, y: y2 },
          { x: xMid, y: yNext },
          { x: x2, y: yNext },
        ])
      }
    }
  })

  const totalWidth = rounds.length * (CARD_W + COL_GAP)

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '16px',
      }}>
        <div style={{ width: '4px', height: '20px', background: accentColor, borderRadius: '2px' }} />
        <span style={{
          fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor,
        }}>{sectionTitle}</span>
      </div>

      {/* Column headers */}
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        <div style={{ position: 'relative', minWidth: `${totalWidth}px` }}>
          {/* Headers row */}
          <div style={{ display: 'flex', marginBottom: '12px' }}>
            {rounds.map((round, colIdx) => (
              <div key={round} style={{
                width: `${CARD_W}px`, flexShrink: 0,
                marginRight: colIdx < rounds.length - 1 ? `${COL_GAP}px` : '0',
              }}>
                <div style={{
                  fontFamily: 'Inter', fontSize: '10px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--text-muted)', textAlign: 'center',
                }}>
                  {labels[round]}
                </div>
              </div>
            ))}
          </div>

          {/* SVG connectors */}
          <svg
            width={totalWidth}
            height={containerHeight}
            style={{ position: 'absolute', top: '30px', left: 0, pointerEvents: 'none', zIndex: 0 }}
          >
            {connectors.map((pts, i) => {
              const d = pts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={1.5}
                  strokeLinecap="square"
                  opacity={0.7}
                />
              )
            })}
          </svg>

          {/* Cards container */}
          <div style={{
            position: 'relative', height: `${containerHeight}px`, zIndex: 1,
          }}>
            {rounds.map((round, colIdx) => {
              const roundMatches = byRound[round] ?? []
              const count = roundMatches.length
              const x = colIdx * (CARD_W + COL_GAP)
              return roundMatches.map((match, matchIdx) => {
                const spacing = containerHeight / count
                const top = spacing * matchIdx + spacing / 2 - CARD_H / 2
                return (
                  <div
                    key={match._id}
                    style={{ position: 'absolute', left: `${x}px`, top: `${top}px`, width: `${CARD_W}px` }}
                  >
                    <GSLMatchCard match={match} label="" />
                  </div>
                )
              })
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function DoubleElimBracket({ group }: { group: GroupData }) {
  const matches = group.matches

  if (matches.length === 0) {
    return (
      <div style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '6px', marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>Матчи ещё не добавлены</p>
      </div>
    )
  }

  // Fallback: if bracket field not set on any match, use column view
  const hasBracketData = matches.some(m => m.bracket === 'WB' || m.bracket === 'LB' || m.bracket === 'GF')
  if (!hasBracketData) {
    return <GroupColumnBracket group={group} />
  }

  const wb = matches.filter(m => m.bracket === 'WB').sort((a, b) => (a.round ?? 0) - (b.round ?? 0))
  const lb = matches.filter(m => m.bracket === 'LB').sort((a, b) => (a.round ?? 0) - (b.round ?? 0))
  const gf = matches.filter(m => m.bracket === 'GF')

  const wbByRound: Record<number, MatchRef[]> = {}
  wb.forEach(m => { const r = m.round ?? 1; if (!wbByRound[r]) wbByRound[r] = []; wbByRound[r].push(m) })
  const wbRounds = Object.keys(wbByRound).map(Number).sort((a, b) => a - b)

  const lbByRound: Record<number, MatchRef[]> = {}
  lb.forEach(m => { const r = m.round ?? 1; if (!lbByRound[r]) lbByRound[r] = []; lbByRound[r].push(m) })
  const lbRounds = Object.keys(lbByRound).map(Number).sort((a, b) => a - b)

  const wbLabels: Record<number, string> = {}
  wbRounds.forEach((r, i) => {
    const rem = wbRounds.length - i
    if (rem === 1) wbLabels[r] = 'WB Final'
    else if (rem === 2) wbLabels[r] = 'WB Semifinal'
    else wbLabels[r] = `WB Round ${r}`
  })

  const lbLabels: Record<number, string> = {}
  lbRounds.forEach((r, i) => {
    const rem = lbRounds.length - i
    if (rem === 1) lbLabels[r] = 'LB Final'
    else if (rem === 2) lbLabels[r] = 'LB Semifinal'
    else lbLabels[r] = `LB Round ${r}`
  })

  return (
    <div style={{ marginBottom: '32px' }}>
      <DESection
        rounds={wbRounds}
        byRound={wbByRound}
        labels={wbLabels}
        accentColor="var(--accent-yellow)"
        sectionTitle="Winners Bracket"
      />
      <DESection
        rounds={lbRounds}
        byRound={lbByRound}
        labels={lbLabels}
        accentColor="var(--accent-red)"
        sectionTitle="Losers Bracket"
      />
      {gf.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '4px', height: '20px', background: 'var(--accent-green)', borderRadius: '2px' }} />
            <span style={{ fontFamily: 'Rajdhani', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-green)' }}>Grand Final</span>
          </div>
          <GSLMatchCard match={gf[0]} label="" />
        </div>
      )}
    </div>
  )
}

// ─── Column bracket for 5+ team groups (Flashscore columns by round) ─────────
function GroupColumnBracket({ group }: { group: GroupData }) {
  const roundMap: Record<number, MatchRef[]> = {}
  group.matches.forEach(m => {
    const r = m.round ?? 1
    if (!roundMap[r]) roundMap[r] = []
    roundMap[r].push(m)
  })
  const rounds = Object.keys(roundMap).map(Number).sort((a, b) => a - b)

  if (rounds.length === 0) {
    return (
      <div style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', borderRadius: '6px', marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>Матчи ещё не добавлены</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '16px', gap: '0', marginBottom: '32px' }}>
      {rounds.map((round, colIdx) => {
        const roundMatches = roundMap[round]
        const isLastCol = colIdx === rounds.length - 1
        const stageName = roundMatches[0]?.stage || `Раунд ${round}`
        return (
          <div key={round} style={{ minWidth: '220px', flexShrink: 0 }}>
            {/* Header */}
            <div style={{
              padding: '10px 12px',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-default)',
              borderRight: isLastCol ? 'none' : '1px solid var(--border-default)',
            }}>
              <span style={{ fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                {stageName}
              </span>
            </div>
            {/* Matches */}
            <div style={{ border: '1px solid var(--border-default)', borderTop: 'none', borderRight: isLastCol ? '1px solid var(--border-default)' : '1px solid var(--border-default)', background: 'var(--bg-primary)' }}>
              {roundMatches.map((match, matchIdx) => {
                const gapPx = colIdx === 0 ? 0 : Math.pow(2, colIdx - 1) * 56 - 56
                return (
                  <div key={match._id}>
                    {matchIdx > 0 && <div style={{ height: `${Math.max(gapPx, 0)}px` }} />}
                    <div style={{ position: 'relative' }}>
                      {colIdx > 0 && (
                        <>
                          <div style={{ position: 'absolute', left: '-1px', top: '14px', width: '12px', height: '1px', background: 'var(--border-default)', zIndex: 1 }} />
                          <div style={{ position: 'absolute', left: '-1px', bottom: '14px', width: '12px', height: '1px', background: 'var(--border-default)', zIndex: 1 }} />
                        </>
                      )}
                      <BracketMatchCard match={match} isTop={true} />
                      <BracketMatchCard match={match} isTop={false} />
                      {!isLastCol && (
                        <div style={{ position: 'absolute', right: '-1px', top: '14px', bottom: '14px', width: '1px', background: 'var(--border-default)' }} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Flashscore-style playoff bracket match card ─────────────────────────────
function BracketMatchCard({ match, isTop }: { match: MatchRef | null; isTop: boolean }) {
  if (!match) {
    return (
      <div style={{
        height: '28px',
        borderRight: '1px solid var(--border-default)',
        ...(isTop
          ? { borderBottom: '1px solid var(--border-default)' }
          : { borderTop: '1px solid var(--border-default)' }),
      }} />
    )
  }

  const isFinished = match.status === 'finished'
  const team = isTop ? match.teamA : match.teamB
  const score = isTop ? match.scoreA : match.scoreB
  const opponentScore = isTop ? match.scoreB : match.scoreA
  const isWinner = isFinished && match.winner?._id === team?._id

  return (
    <Link href={`/match/${match._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px', height: '28px',
        background: isWinner ? 'rgba(200,255,0,0.04)' : 'transparent',
        borderRight: '1px solid var(--border-default)',
        ...(isTop
          ? { borderBottom: '1px solid var(--border-default)' }
          : { borderTop: '1px solid var(--border-default)' }),
        cursor: 'pointer', transition: 'background 0.15s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
          <div style={{ width: '15px', height: '15px', flexShrink: 0, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {team?.logo
              ? <Image src={team.logo} alt={team.name} width={15} height={15} style={{ objectFit: 'contain' }} />
              : <span style={{ fontSize: '6px', color: 'var(--text-muted)', fontFamily: 'Rajdhani', fontWeight: 700 }}>{team?.tag?.slice(0, 3) || '?'}</span>
            }
          </div>
          <span style={{
            fontFamily: 'Rajdhani', fontSize: '13px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.02em',
            color: isWinner ? 'var(--accent-yellow)' : !team ? 'var(--text-muted)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px',
          }}>{team?.name || 'TBD'}</span>
        </div>
        {isFinished && (
          <span style={{
            fontFamily: 'Rajdhani', fontSize: '15px', fontWeight: 700,
            color: isWinner ? 'var(--text-primary)' : score > opponentScore ? 'var(--text-primary)' : 'var(--text-muted)',
            marginLeft: '8px', flexShrink: 0,
          }}>{score}</span>
        )}
      </div>
    </Link>
  )
}

// ─── Playoffs bracket ────────────────────────────────────────────────────────
function PlayoffsBracket({ matches }: { matches: MatchRef[] }) {
  const roundMap: Record<number, MatchRef[]> = {}
  matches.forEach(m => {
    const r = m.round ?? 1
    if (!roundMap[r]) roundMap[r] = []
    roundMap[r].push(m)
  })
  const rounds = Object.keys(roundMap).map(Number).sort((a, b) => a - b)

  if (rounds.length === 0) {
    return <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>Плей-офф матчи ещё не добавлены</p>
  }

  const [activeRound, setActiveRound] = useState<number>(rounds[0])
  const activeIdx = rounds.indexOf(activeRound)

  const roundLabels: Record<number, string> = {}
  rounds.forEach((r, i) => {
    const remaining = rounds.length - i
    if (remaining === 1) roundLabels[r] = 'Финал'
    else if (remaining === 2) roundLabels[r] = '1/2'
    else if (remaining === 3) roundLabels[r] = '1/4'
    else if (remaining === 4) roundLabels[r] = '1/8'
    else roundLabels[r] = `Раунд ${r}`
  })

  const visibleRounds = rounds.slice(Math.max(0, activeIdx - 1), activeIdx + 2)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px', border: '1px solid var(--border-default)', background: 'var(--bg-secondary)', overflow: 'hidden', width: 'fit-content' }}>
        <button
          onClick={() => activeIdx > 0 && setActiveRound(rounds[activeIdx - 1])}
          disabled={activeIdx === 0}
          style={{
            padding: '10px 16px', fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
            color: activeIdx === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
            background: 'transparent', border: 'none', borderRight: '1px solid var(--border-default)',
            cursor: activeIdx === 0 ? 'default' : 'pointer',
          }}
        >← ПРЕД. СТАДИЯ</button>
        <div style={{ display: 'flex' }}>
          {rounds.map(r => (
            <button
              key={r}
              onClick={() => setActiveRound(r)}
              style={{
                padding: '10px 20px', fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700,
                color: r === activeRound ? '#000' : 'var(--text-secondary)',
                background: r === activeRound ? 'var(--accent-yellow)' : 'transparent',
                border: 'none', borderRight: '1px solid var(--border-default)',
                cursor: 'pointer', textTransform: 'uppercase',
              }}
            >{roundLabels[r]}</button>
          ))}
        </div>
        <button
          onClick={() => activeIdx < rounds.length - 1 && setActiveRound(rounds[activeIdx + 1])}
          disabled={activeIdx === rounds.length - 1}
          style={{
            padding: '10px 16px', fontFamily: 'Inter', fontSize: '12px', fontWeight: 600,
            color: activeIdx === rounds.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
            background: 'transparent', border: 'none',
            cursor: activeIdx === rounds.length - 1 ? 'default' : 'pointer',
          }}
        >СЛЕД. СТАДИЯ →</button>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '16px', gap: '0' }}>
        {visibleRounds.map((round, colIdx) => {
          const roundMatches = roundMap[round] ?? []
          const isLastCol = colIdx === visibleRounds.length - 1
          return (
            <div key={round} style={{ minWidth: '220px', flexShrink: 0 }}>
              <div style={{
                padding: '10px 12px', background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-default)',
                borderRight: isLastCol ? 'none' : '1px solid var(--border-default)',
              }}>
                <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  {roundLabels[round]}
                </span>
              </div>
              <div style={{ border: '1px solid var(--border-default)', borderTop: 'none', background: 'var(--bg-primary)' }}>
                {roundMatches.map((match, matchIdx) => {
                  const gapPx = colIdx === 0 ? 0 : Math.pow(2, colIdx - 1) * 56 - 56
                  return (
                    <div key={match._id}>
                      {matchIdx > 0 && <div style={{ height: `${gapPx}px` }} />}
                      <div style={{ position: 'relative' }}>
                        {colIdx > 0 && (
                          <>
                            <div style={{ position: 'absolute', left: '-1px', top: '14px', width: '12px', height: '1px', background: 'var(--border-default)', zIndex: 1 }} />
                            <div style={{ position: 'absolute', left: '-1px', bottom: '14px', width: '12px', height: '1px', background: 'var(--border-default)', zIndex: 1 }} />
                          </>
                        )}
                        <BracketMatchCard match={match} isTop={true} />
                        <BracketMatchCard match={match} isTop={false} />
                        {!isLastCol && (
                          <div style={{ position: 'absolute', right: '-1px', top: '14px', bottom: '14px', width: '1px', background: 'var(--border-default)' }} />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BracketView({ groups, playoffMatches, activeView, groupFilter, tournamentSlug }: BracketViewProps) {
  const selectedGroup = groupFilter ? groups.find(g => g._id === groupFilter) : groups[0]

  return (
    <div>
      {/* View toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[{ key: 'playoffs', label: 'Playoffs' }, { key: 'gsl', label: 'GSL Группы' }].map(v => (
          <a
            key={v.key}
            href={`/tournament/${tournamentSlug}/bracket?view=${v.key}`}
            style={{
              padding: '8px 20px',
              fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700,
              textTransform: 'uppercase', textDecoration: 'none',
              background: activeView === v.key ? 'var(--accent-yellow)' : 'transparent',
              color: activeView === v.key ? '#000' : 'var(--text-muted)',
              border: `1px solid ${activeView === v.key ? 'var(--accent-yellow)' : 'var(--border-default)'}`,
              borderRadius: '4px',
            }}
          >
            {v.label}
          </a>
        ))}
      </div>

      {/* GSL Groups view */}
      {activeView === 'gsl' && (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Sidebar: group list */}
          <div style={{ minWidth: '200px' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>Группы</p>
            {groups.map(g => (
              <a
                key={g._id}
                href={`/tournament/${tournamentSlug}/bracket?view=gsl&group=${g._id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', marginBottom: '4px',
                  textDecoration: 'none',
                  background: selectedGroup?._id === g._id ? 'rgba(200,255,0,0.06)' : 'transparent',
                  borderLeft: `3px solid ${selectedGroup?._id === g._id ? 'var(--accent-yellow)' : 'transparent'}`,
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.status === 'live' ? 'var(--accent-green)' : 'var(--text-muted)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Rajdhani', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{g.name}</span>
                <span style={{ fontFamily: 'Inter', fontSize: '10px', color: g.status === 'live' ? 'var(--accent-green)' : 'var(--text-muted)', marginLeft: 'auto' }}>
                  {g.status === 'live' ? 'Играется' : g.status === 'finished' ? 'Завершена' : 'Скоро'}
                </span>
              </a>
            ))}
            {groups.length === 0 && <p style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--text-muted)' }}>Групп нет</p>}
          </div>

          {/* Main content */}
          {selectedGroup ? (
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                  {selectedGroup.name}
                </h2>
                <span style={{
                  fontFamily: 'Inter', fontSize: '11px', fontWeight: 600,
                  color: selectedGroup.status === 'live' ? 'var(--accent-green)' : 'var(--text-muted)',
                  border: `1px solid ${selectedGroup.status === 'live' ? 'var(--accent-green)' : 'var(--border-default)'}`,
                  padding: '4px 10px', borderRadius: '3px',
                  background: selectedGroup.status === 'live' ? 'rgba(57,211,83,0.1)' : 'transparent',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {selectedGroup.status === 'live' ? 'Играется' : selectedGroup.status === 'finished' ? 'Завершена' : 'Скоро'}
                </span>
              </div>
              {(() => {
                const groupFormat = (selectedGroup as GroupData & { format?: string }).format ?? (
                  selectedGroup.teams.length === 4 ? 'gsl-4' :
                  selectedGroup.teams.length === 8 ? 'de-8' : 'round-robin'
                )
                const isGSL = groupFormat === 'gsl-4'
                const isDE = groupFormat === 'de-8'
                const formatLabel = isGSL
                  ? 'GSL (4 команды)'
                  : isDE
                    ? 'Double Elimination (8 команд)'
                    : 'Round Robin'

                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Inter', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        Формат: {formatLabel}
                      </span>
                      {isGSL && (
                        <a href="#gsl-rules" style={{
                          fontFamily: 'Inter', fontSize: '11px', color: 'var(--accent-yellow)',
                          textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700,
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                        }}>
                          Правила GSL <span style={{ fontSize: '12px' }}>ⓘ</span>
                        </a>
                      )}
                    </div>

                    {/* Bracket: switch by group.format */}
                    {isGSL ? (
                      <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
                        <GSLBracket group={selectedGroup} />
                      </div>
                    ) : isDE ? (
                      <DoubleElimBracket group={selectedGroup} />
                    ) : (
                      <GroupColumnBracket group={selectedGroup} />
                    )}

                    {/* Standings table — always shown */}
                    <GSLStandingsTable group={selectedGroup} />
                  </>
                )
              })()}
            </div>
          ) : (
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--text-muted)' }}>Группы ещё не созданы</p>
          )}
        </div>
      )}

      {/* Playoffs view */}
      {activeView === 'playoffs' && <PlayoffsBracket matches={playoffMatches} />}
    </div>
  )
}
