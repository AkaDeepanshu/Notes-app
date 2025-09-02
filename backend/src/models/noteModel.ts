import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

export interface INote extends Document {
  content: string;
  user: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    content: {
      type: String,
      required: [true, 'Note content is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INote>('Note', noteSchema);
