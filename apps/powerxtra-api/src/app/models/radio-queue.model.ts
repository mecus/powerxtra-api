import { model, Schema } from "mongoose";

const QueueSchema = new Schema({
  // Reference to the Tracks collection
  tracks: [{
    trackId: { type: Schema.Types.ObjectId, ref: 'Track' },
    type: { type: String, enum: ['track', 'jingle'], default: 'track' }
  }],
  status: { type: String, enum: ['active', 'paused'], default: 'active' },
  updatedAt: { type: Date, default: Date.now }
});

const RadioQueueModel = model('Queue', QueueSchema);
export { RadioQueueModel };
