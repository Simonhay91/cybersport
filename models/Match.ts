import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMatch extends Document {
  name?: string
  tournament: mongoose.Types.ObjectId
  stage: string
  group?: mongoose.Types.ObjectId
  round?: number
  teamA?: mongoose.Types.ObjectId
  teamB?: mongoose.Types.ObjectId
  scoreA: number
  scoreB: number
  format: 'BO1' | 'BO3' | 'BO5'
  status: 'upcoming' | 'live' | 'finished'
  bracket?: 'WB' | 'LB' | 'GF'
  winner?: mongoose.Types.ObjectId
  loser?: mongoose.Types.ObjectId
  scheduledAt?: Date
  nextMatchWinner?: mongoose.Types.ObjectId
  nextMatchWinnerSlot?: 'A' | 'B'
  nextMatchLoser?: mongoose.Types.ObjectId
  nextMatchLoserSlot?: 'A' | 'B'
  adminNote?: string
  maps?: { name: string; scoreA: number; scoreB: number }[]
}

const MatchSchema = new Schema<IMatch>({
  name: String,
  tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
  stage: { type: String, required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group' },
  round: Number,
  teamA: { type: Schema.Types.ObjectId, ref: 'Team' },
  teamB: { type: Schema.Types.ObjectId, ref: 'Team' },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  format: { type: String, enum: ['BO1', 'BO3', 'BO5'], default: 'BO3' },
  status: { type: String, enum: ['upcoming', 'live', 'finished'], default: 'upcoming' },
  bracket: { type: String, enum: ['WB', 'LB', 'GF'] },
  winner: { type: Schema.Types.ObjectId, ref: 'Team' },
  loser: { type: Schema.Types.ObjectId, ref: 'Team' },
  scheduledAt: Date,
  nextMatchWinner: { type: Schema.Types.ObjectId, ref: 'Match' },
  nextMatchWinnerSlot: { type: String, enum: ['A', 'B'] },
  nextMatchLoser: { type: Schema.Types.ObjectId, ref: 'Match' },
  nextMatchLoserSlot: { type: String, enum: ['A', 'B'] },
  adminNote: String,
  maps: [{
    name: String,
    scoreA: Number,
    scoreB: Number,
  }],
}, { timestamps: true })

const Match: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema)
export default Match
