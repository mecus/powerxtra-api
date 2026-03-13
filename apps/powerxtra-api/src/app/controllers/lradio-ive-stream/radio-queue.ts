import { ITrack } from "../../interfaces";
import { RadioQueueModel, TrackModel } from "../../models";

export class RadioQueue {

  static updateQueue = async (tracks: any) => {
    return new Promise(async(resolve, reject) => {
        try {
      // const { tracks } = req.body;

      // Use findOneAndUpdate to keep a single "Live" queue document
      const updatedQueue = await RadioQueueModel.findOneAndUpdate(
        {}, // Find the only queue doc
        { tracks, updatedAt: Date.now() },
        { upsert: true, new: true }
      );
      resolve(updatedQueue);
      // TRIGGER: If you use WebSockets, notify the streaming engine here
      // io.emit('queue_updated', updatedQueue);

      // res.status(200).json({ message: 'Sync Successful', data: updatedQueue });
    } catch (error) {
      reject(error)
      // res.status(500).json({ error: error.message });
    }
    });

  }
  static getQueue() {
    return new Promise(async(resolve, reject) => {
      try{
      //   const radioQueue = await RadioQueueModel.findOne(
      //   {} // Find the only queue doc
      // ).populate<any>('tracks');
      // resolve(radioQueue);
       const currentQueue = await RadioQueueModel.findOne({})
        .sort({ updatedAt: -1 }) // Get the most recently synced queue
        .populate({
          path: 'tracks.trackId',
          model: 'Track',
          select: 'title artist artwork duration file object bitrate' // Only return needed fields
        })
        .exec();
      resolve(currentQueue);
      }catch(err){
        reject(err);
      }
    });
  }

  static async nextQueueTrack(): Promise<ITrack | any> {
    try{
       const queueDoc: any = await RadioQueueModel.findOne({});

      if (!queueDoc || queueDoc.tracks.length === 0) {
        return this.sampleTrack() //{ message: 'Queue is empty' };
      }
         // 2. Extract (shift) the first track from the array
        const nextInQueue = queueDoc.tracks.shift();
        console.log("Remaining Tracks:", queueDoc?.tracks?.length);
        console.log("Next", nextInQueue)
        // 3. Save the updated queue back to the database
        await queueDoc.save();

        // 4. Fetch the full track details from the Track model
        const fullTrack = await TrackModel.findById(nextInQueue.trackId);
        // console.log("FullTrack", fullTrack)
        return fullTrack;

    }catch(err){
      return new Error("Error fetching next track:")
    }
  }

  static async sampleTrack() {
    try{
      const sampleTrack: Array<any> = await TrackModel.aggregate().sample(1).exec();
      console.log("Picking random tracks");
      return sampleTrack[0];
    }catch(err){
      return null;
    }
  }

}



// const Queue = require('./models/Queue');

// /**
//  * Gets the next track in the queue and removes it.
//  * This is triggered when the streaming server (Liquidsoap/Icecast)
//  * requests a new file or when a timer ends.
//  */
// exports.getNextTrack = async (req, res) => {
//   try {
//     // 1. Find the first track in the queue array
//     const queueDoc = await Queue.findOne({});

//     if (!queueDoc || queueDoc.tracks.length === 0) {
//       return res.status(404).json({ message: 'Queue is empty' });
//     }

//     // 2. Extract (shift) the first track from the array
//     const nextInQueue = queueDoc.tracks.shift();

//     // 3. Save the updated queue back to the database
//     await queueDoc.save();

//     // 4. Fetch the full track details from the Track model
//     const fullTrack = await mongoose.model('Track').findById(nextInQueue.trackId);

//     // 5. Notify all Admins via Socket.io that the queue has moved
//     // io.emit('queueUpdated', queueDoc.tracks);

//     res.status(200).json(fullTrack);
//   } catch (error) {
//     console.error('Error fetching next track:', error);
//     res.status(500).json({ error: error.message });
//   }
// };
