import mongoose, { Document, Schema } from 'mongoose'
import { ISnippet } from '../types/snippet.types'

const snippetSchema = new Schema<ISnippet>(
  {
    text: {
      type: String,
      required: [true, 'Text is required'],
      trim: true,
      minlength: [1, 'Text cannot be empty'],
      maxlength: [50000, 'Text too long'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
      maxlength: [500, 'Summary too long'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  }
)

export const Snippet = mongoose.model<ISnippet>('Snippet', snippetSchema)
