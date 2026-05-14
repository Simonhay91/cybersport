import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPrizeDistribution {
  place: number
  amount: number
}

export interface ITournament extends Document {
  name: string
  slug: string
  status: 'upcoming' | 'live' | 'finished'
  description?: string
  startDate?: Date
  endDate?: Date
  prizePool: number
  prizeDistribution: IPrizeDistribution[]
  format?: string
  banner?: string
  teams: mongoose.Types.ObjectId[]
  registrationOpen: boolean
  maxTeams: number
  createdAt: Date
}

const TournamentSchema = new Schema<ITournament>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['upcoming', 'live', 'finished'], default: 'upcoming' },
  description: String,
  startDate: Date,
  endDate: Date,
  prizePool: { type: Number, default: 0 },
  prizeDistribution: [{
    place: Number,
    amount: Number,
  }],
  format: String,
  banner: String,
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  registrationOpen: { type: Boolean, default: true },
  maxTeams: { type: Number, default: 128 },
}, { timestamps: true })

const Tournament: Model<ITournament> = mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', TournamentSchema)
export default Tournament
