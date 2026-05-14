import connectDB from './mongodb'
import Match from '@/models/Match'
import Team from '@/models/Team'
import mongoose from 'mongoose'

/**
 * Вызывается после сохранения матча с выбранным победителем.
 * Автоматически продвигает победителя/проигравшего по сетке
 * и пересчитывает статистику команд.
 */
export async function processMatchResult(matchId: string) {
  await connectDB()

  const match = await Match.findById(matchId)
  if (!match || match.status !== 'finished' || !match.winner) return

  const winnerId = match.winner
  const loserId = match.teamA?.toString() === winnerId.toString()
    ? match.teamB
    : match.teamA

  // Сохраняем проигравшего в матче
  if (loserId && !match.loser) {
    match.loser = loserId as mongoose.Types.ObjectId
    await match.save()
  }

  // Продвигаем победителя в следующий матч
  if (match.nextMatchWinner) {
    const slot = match.nextMatchWinnerSlot === 'A' ? 'teamA' : 'teamB'
    await Match.findByIdAndUpdate(match.nextMatchWinner, {
      [slot]: winnerId,
    })
  }

  // Продвигаем проигравшего в следующий матч
  if (match.nextMatchLoser && loserId) {
    const slot = match.nextMatchLoserSlot === 'A' ? 'teamA' : 'teamB'
    await Match.findByIdAndUpdate(match.nextMatchLoser, {
      [slot]: loserId,
    })
  }

  // Пересчёт статистики обеих команд
  if (winnerId) await recalcTeamStats(winnerId.toString())
  if (loserId) await recalcTeamStats(loserId.toString())
}

/**
 * Пересчитывает wins/losses команды на основе всех завершённых матчей.
 */
export async function recalcTeamStats(teamId: string) {
  await connectDB()

  const wins = await Match.countDocuments({
    winner: teamId,
    status: 'finished',
  })

  const losses = await Match.countDocuments({
    loser: teamId,
    status: 'finished',
  })

  await Team.findByIdAndUpdate(teamId, { wins, losses })
}
