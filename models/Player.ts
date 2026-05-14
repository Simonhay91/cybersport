import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPlayer extends Document {
  nickname: string
  fullName?: string
  age?: number
  steam?: string
  faceit?: string
  telegram?: string
  discord?: string
  team?: mongoose.Types.ObjectId
  role?: string
  status: 'main' | 'reserve'
  photo?: string
}

const PlayerSchema = new Schema<IPlayer>({
  nickname: { type: String, required: true },
  fullName: String,
  age: Number,
  steam: String,
  faceit: String,
  telegram: String,
  discord: String,
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  role: String,
  status: { type: String, enum: ['main', 'reserve'], default: 'main' },
  photo: String,
}, { timestamps: true })

const Player: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema)
export default Player
