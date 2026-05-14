import mongoose, { Schema, Document, Model } from 'mongoose'

interface PlayerInfo {
  nickname: string
  fullName?: string
  age?: number
  steam?: string
  faceit?: string
  telegram?: string
  discord?: string
}

interface CaptainInfo extends PlayerInfo {
  email?: string
}

export interface IApplication extends Document {
  teamName: string
  tag: string
  logo?: string
  city?: string
  socialLinks?: {
    telegram?: string
    vk?: string
    twitch?: string
  }
  captain: CaptainInfo
  players: PlayerInfo[]
  reserve?: PlayerInfo
  status: 'new' | 'reviewing' | 'confirmed' | 'rejected' | 'cancelled'
  tournament?: mongoose.Types.ObjectId
  adminNote?: string
  submittedAt: Date
  convertedTeam?: mongoose.Types.ObjectId
}

const PlayerInfoSchema = new Schema({
  nickname: String,
  fullName: String,
  age: Number,
  steam: String,
  faceit: String,
  telegram: String,
  discord: String,
}, { _id: false })

const CaptainInfoSchema = new Schema({
  nickname: String,
  fullName: String,
  age: Number,
  steam: String,
  faceit: String,
  telegram: String,
  discord: String,
  email: String,
}, { _id: false })

const ApplicationSchema = new Schema<IApplication>({
  teamName: { type: String, required: true },
  tag: { type: String, required: true },
  logo: String,
  city: String,
  socialLinks: {
    telegram: String,
    vk: String,
    twitch: String,
  },
  captain: { type: CaptainInfoSchema, required: true },
  players: [PlayerInfoSchema],
  reserve: PlayerInfoSchema,
  status: {
    type: String,
    enum: ['new', 'reviewing', 'confirmed', 'rejected', 'cancelled'],
    default: 'new',
  },
  tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  adminNote: String,
  submittedAt: { type: Date, default: Date.now },
  convertedTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true })

const Application: Model<IApplication> = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)
export default Application
