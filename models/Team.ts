import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITeam extends Document {
  name: string
  slug: string
  tag: string
  logo?: string
  city?: string
  description?: string
  captain?: mongoose.Types.ObjectId
  players: mongoose.Types.ObjectId[]
  socialLinks?: {
    telegram?: string
    vk?: string
    twitch?: string
    twitter?: string
  }
  status: 'pending' | 'confirmed' | 'rejected'
  tournaments: mongoose.Types.ObjectId[]
  wins: number
  losses: number
  roundsFor: number
  roundsAgainst: number
  createdAt: Date
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tag: { type: String, required: true },
  logo: String,
  city: String,
  description: String,
  captain: { type: Schema.Types.ObjectId, ref: 'Player' },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  socialLinks: {
    telegram: String,
    vk: String,
    twitch: String,
    twitter: String,
  },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  tournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }],
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  roundsFor: { type: Number, default: 0 },
  roundsAgainst: { type: Number, default: 0 },
}, { timestamps: true })

TeamSchema.virtual('played').get(function () {
  return this.wins + this.losses
})

TeamSchema.virtual('winRate').get(function () {
  const total = this.wins + this.losses
  if (total === 0) return 0
  return Math.round((this.wins / total) * 100)
})

const Team: Model<ITeam> = mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema)
export default Team
