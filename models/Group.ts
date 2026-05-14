import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IGroup extends Document {
  name: string
  tournament: mongoose.Types.ObjectId
  teams: mongoose.Types.ObjectId[]
  matches: mongoose.Types.ObjectId[]
  first?: mongoose.Types.ObjectId
  second?: mongoose.Types.ObjectId
  status: 'upcoming' | 'live' | 'finished'
  format: 'gsl-4' | 'de-8' | 'round-robin'
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
  first: { type: Schema.Types.ObjectId, ref: 'Team' },
  second: { type: Schema.Types.ObjectId, ref: 'Team' },
  status: { type: String, enum: ['upcoming', 'live', 'finished'], default: 'upcoming' },
  format: { type: String, enum: ['gsl-4', 'de-8', 'round-robin'], default: 'gsl-4' },
}, { timestamps: true })

const Group: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema)
export default Group
