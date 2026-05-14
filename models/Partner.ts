import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPartner extends Document {
  name: string
  logo?: string
  url?: string
  tier: 'title' | 'main' | 'general' | 'media'
  active: boolean
  order: number
}

const PartnerSchema = new Schema<IPartner>({
  name: { type: String, required: true },
  logo: String,
  url: String,
  tier: { type: String, enum: ['title', 'main', 'general', 'media'], default: 'general' },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true })

const Partner: Model<IPartner> = mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema)
export default Partner
