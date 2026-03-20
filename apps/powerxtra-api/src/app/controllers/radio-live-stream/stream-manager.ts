// import fs from "fs";
import { Response } from "express";
// import { PlaylistManager } from "./playlist-manager";
import { Throttle } from "stream-throttle";
import fetch from "node-fetch";
import * as mm from 'music-metadata';
// import { spawn } from "child_process"
// import Playlist from "./playlist"
// import { Track } from "../interfaces";
import { Transform, PassThrough } from "stream";
import { createIcyMetadata } from "./icy-metadata";
import { RadioQueue } from "./radio-queue";

let currentTrack: any = {};
let streaming: boolean = false;
let metaInt = (128000/8);
let currentListeners: number = 0; //Array<any> = [];
let streamingStatus: string = 'Stopped'; //'Streaming || Stopped || Pending';
export class StreamManager {

  private listeners: Response[] = []
  // private playlist;
  // private metaInt = 16000 // bytes between metadata

  constructor() {
    // this.playlist = new PlaylistManager
  }

  addListener(res: Response) {

    res.setHeader('Accept-Ranges', 'bytes'); // Explicitly allow byte ranges
      // 1. Explicit CORS for Chrome's media thread
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Icy-Metadata');
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "icy-name": "PowerXtra Radio",
      "icy-metaint": metaInt,
      // "Cache-Control": "public, max-age=3600",
      "Connection": "keep-alive",
      'Transfer-Encoding': 'chunked',
      'Accept-Ranges': 'bytes', // Critical: Tells Chrome NOT to try and "seek" or range-request
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    })

    if(streaming){
      // save listeners to database later
      this.listeners.push(res)
      // currentListeners.push(res);
    }

    res.on("close", () => {
      this.listeners = this.listeners.filter(l => l !== res)
    });
    currentListeners = this.listeners.length;
    console.log("Listeners:", this.listeners.length)
  }

  private broadcast(chunk: Buffer) {
    for (const listener of this.listeners) {
      try { listener.write(chunk) } catch {}
    }
  }

  async start() {
    console.log(`[ ${Date.now()} ]`, "Started Radio Streaming...")
    const playNext = async () => {
      // const track = this.playlist.next();
      const track = await RadioQueue.nextQueueTrack();
      console.log(`Now playing: ${track.artist} - ${track.title}`)
      currentTrack = track;
      const response = await fetch(track.file)
      if (!response.ok || !response.body) {
        console.error("Failed to fetch track, skipping...")
        return playNext()
      }

      // Throttle to 128 kbps
      const bitrate =  track.bitrate; //await getCachedBitrate(track.title, track.file);
      if(bitrate < 128) {
        metaInt = ((128 * 1000) / 8);
      }else{
        metaInt = ((bitrate * 1000) / 8);
      }
      // metaInt = ((bitrate * 1000) / 8);
      console.log("biiity", metaInt)
      // 192kbps / 8 = 24,000 bytes per second
      const throttle = new Throttle({ rate: metaInt});
      // const throttle = new Throttle({ rate: 16000 })

      // Transform stream to inject ICY metadata
      let bytesSinceMeta = 0
      const metaTransform = new Transform({
        transform(chunk: Buffer, encoding, callback) {
          let offset = 0
          const buffers: Buffer[] = []

          while (offset < chunk.length) {
            const remaining = metaInt - bytesSinceMeta
            const sliceLength = Math.min(remaining, chunk.length - offset)
            const slice = chunk.slice(offset, offset + sliceLength)
            buffers.push(slice)
            offset += sliceLength
            bytesSinceMeta += slice.length

            if (bytesSinceMeta >= metaInt) {
              const meta = createIcyMetadata(`${track.artist} - ${track.title}`)
              buffers.push(meta)
              bytesSinceMeta = 0
            }
          }

          // push all slices at once
          this.push(Buffer.concat(buffers))
          callback()
        }
      })

      // Use PassThrough to pipe throttled stream to multiple listeners
      const pass = new PassThrough()
      metaTransform.pipe(pass)
      pass.on("data", (chunk: Buffer) => this.broadcast(chunk))

      // Pipe: remote fetch -> throttle -> metadata
      response.body.pipe(throttle)
      .pipe(metaTransform)

      response.body.on("end", () => {
         if(streaming){
          console.log('NEXT TRACK Action');
          playNext();
        }else{
          streamingStatus = 'Stopped';
          setCurrentTrackOnStreamingStopped();
          console.log(`[ ${Date.now()} ]`, "Radio Streaming Stopped...");
        }
      })
    }
    if(streaming){
      streamingStatus = 'Streaming';
      playNext();
    }
  }
  enableStreaming(){
    streaming = true;
  }
  disableStreaming(){
    streaming = false;
    streamingStatus = 'Stopping';
    console.log(`[ ${Date.now()} ]`, "Stopping Radio Streaming...");
  }
  static getCurrentTrack() {
    return currentTrack;
  }
  static getListeners() {
    return this.getListeners;
  }
  static getStreamingStatus() {
    if(streaming){
      return  {
        station: "PowerXtra Radio",
        status: streamingStatus, // Stopped | Pending | Streaming | Stopping
        on: true,
        listeners: currentListeners
      }
    }else{
      return  {
        station: "PowerXtra Radio",
        status: streamingStatus,
        on: false,
        listeners: currentListeners
      }
    }
  }
}
function setCurrentTrackOnStreamingStopped(){
  currentTrack = {
    "title": "Auto DJ Stopped",
    "artist": "Media Streaming has stopped",
    "album": "PowerXtra",
    "file": "https://firebasestorage.googleapis.com/v0/b/allmembers.appspot.com/o/audio%2FTekno-PuTTin.mp3?alt=media&token=1dbbd927-a442-4ce3-874c-f5aed20be906",
    "artwork": "https://radioafricana.com/wp-content/uploads/2025/05/HSOTW-1536x1536.jpg"
  }
}


// import * as mm from 'music-metadata';

// In-memory store: { "song1.mp3": 128, "song2.mp3": 192 }
const bitrateCache = new Map<string, number>();

/**
 * Gets bitrate from cache or fetches it from the URL
 * @param fileName Unique key (e.g., "burna-boy.mp3")
 * @param fileUrl The remote URL to parse if not in cache
 */
// NOT IN USE AND MAY NOT BE NEEDED
export async function getCachedBitrate(fileName: string, fileUrl: string): Promise<number> {
  // 1. Check if we already have it
  if (bitrateCache.has(fileName)) {
    console.log("Bitrate in cache:", bitrateCache.get(fileName));
    return bitrateCache.get(fileName)!;
  }

  console.log(`Cache miss for ${fileName}. Fetching metadata...`);

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Fetch failed');

    // Convert to ArrayBuffer for the most stable cross-platform parsing
    const buffer = await response.arrayBuffer();
    const metadata = await mm.parseBuffer(new Uint8Array(buffer));

    const bitrate = Math.round((metadata.format.bitrate || 128000) / 1000);
     console.log("BIT Rate", bitrate);

    // 2. Save to cache
    bitrateCache.set(fileName, bitrate);
    return bitrate;
  } catch (error) {
    console.error(`Failed to get bitrate for ${fileName}, defaulting to 128kbps`);
    return 128;
  }
}

export async function warmUpBitrateCache(playlist: any[]) {
  // // NOT IN USE AND MAY NOT BE NEEDED
  console.log('Warming up bitrate cache...');
  for (const track of playlist) {
    await getCachedBitrate(track.title, track.file);
  }
  console.log('Cache ready! All bitrates loaded.');
}






// import * as mm from 'music-metadata';
// import { makeTokenizer } from '@tokenizer/http'; // You may need: npm install @tokenizer/http

/**
 * Extracts bitrate from a remote URL in a Node.js environment
 */
// async function getRemoteMp3Bitrate(response: any): Promise<number> {
//   try {
//     // 1. Fetch the file
//     // const response = await fetch(fileUrl);
//     // if (!response.ok) throw new Error('Fetch failed');

//     // 2. Wrap the Node.js stream for music-metadata
//     // If on Node 18+, use the body directly with parseFromTokenizer
//     const metadata = await mm.parseWebStream(response.body as any);

//     // 3. Fallback: If parseWebStream still fails, use a buffer approach
//     // const arrayBuffer = await response.arrayBuffer();
//     // const metadata = await mm.parseBuffer(new Uint8Array(arrayBuffer));

//     const bitrateBps = metadata.format.bitrate || 0;
//     console.log("BIT Rate", bitrateBps);
//     return Math.round(bitrateBps / 1000);
//   } catch (error) {
//     console.error('Bitrate extraction failed:', error);
//     return 128; // Standard fallback
//   }
// }


// async function getRemoteMp3Bitrate(fileUrl: string): Promise<number> {
//   try {
//     const response: any = await fetch(fileUrl);
//     if (!response.ok) throw new Error('Fetch failed');

//     // Use parseWebStream (supported in Node 18+ and Browsers)
//     const metadata = await mm.parseWebStream(response.body!);

//     const bitrateBps = metadata.format.bitrate || 0;
//     console.log("BIT Rate", bitrateBps);
//     return Math.round(bitrateBps / 1000);
//   } catch (error) {
//     console.error('Bitrate extraction failed:', error);
//     return 128;
//   }
// }


// // 1. Import the main library and the fetch helper
// import * as mm from 'music-metadata';
// import { fetchFromUrl } from 'music-metadata/lib/http';

// /**
//  * Extracts bitrate from a Google Storage URL on the server side
//  */
// async function getRemoteMp3Bitrate(fileUrl: string): Promise<number> {
//   try {
//     // 2. Use fetchFromUrl to stream metadata headers
//     const metadata = await mm.parseFromTokenizer(await fetchFromUrl(fileUrl));

//     const bitrateBps = metadata.format.bitrate || 0;
//     return Math.round(bitrateBps / 1000);
//   } catch (error) {
//     console.error('Error parsing remote bitrate:', error);
//     return 128; // Default fallback
//   }
// }









// export class StreamManager {

//   private listeners: Response[] = []
//   // private static metaInt = 16000 // bytes between metadata injection

//   constructor(private playlist: Playlist) {}

//   addListener(res: Response) {
//     res.writeHead(200, {
//       "Content-Type": "audio/mpeg",
//       "icy-name": "PowerXtra Radio",
//       "icy-metaint": 16000,
//       "Cache-Control": "public, max-age=3600",
//       Connection: "keep-alive"
//     })

//     this.listeners.push(res)

//     res.on("close", () => {
//       this.listeners = this.listeners.filter(l => l !== res)
//     })
//   }

//   private sendToListeners(chunk: Buffer) {
//     for (const listener of this.listeners) {
//       try { listener.write(chunk) } catch {}
//     }
//   }

//   async start() {
//     const playNext = async () => {
//       const track = this.playlist.next()
//       console.log(`Now playing: ${track.artist} - ${track.title}`)

//       const response = await fetch(track.file)
//       if (!response.body) {
//         console.error("Failed to fetch track, skipping...")
//         return playNext()
//       }

//       // Throttle at 128kbps: 128000 bits / 8 = 16000 bytes/sec
//       const throttle = new Throttle({ rate: 16000 })

//       // Transform stream to inject ICY metadata
//       let bytesSinceMeta = 0
//       const metaTransform = new Transform({
//         transform(chunk: Buffer, encoding, callback) {
//           let offset = 0
//           const output: Buffer[] = []

//           while (offset < chunk.length) {
//             const remaining = 16000 - bytesSinceMeta
//             const sliceLength = Math.min(remaining, chunk.length - offset)
//             const slice = chunk.slice(offset, offset + sliceLength)
//             output.push(slice)
//             offset += sliceLength
//             bytesSinceMeta += slice.length

//             if (bytesSinceMeta >= 16000) {
//               const meta = createIcyMetadata(`${track.artist} - ${track.title}`)
//               output.push(meta)
//               bytesSinceMeta = 0
//             }
//           }

//           this.push(Buffer.concat(output))
//           callback()
//         }
//       })

//       // Pipe: remote stream -> throttle -> metadata -> listeners
//       response.body
//         .pipe(throttle)
//         .pipe(metaTransform)
//         .on("data", (chunk: Buffer) => this.sendToListeners(chunk))
//         .on("end", () => playNext())
//     }

//     playNext()
//   }
// }











// export class StreamManager {

//   private listeners: Response[] = []

//   private metaInt = 16000

//   constructor(private playlist: Playlist) {}

//   addListener(res: Response) {

//     res.writeHead(200, {
//       "Content-Type": "audio/mpeg",
//       "icy-name": "PowerXtra Radio",
//       "icy-metaint": this.metaInt,
//       "Cache-Control": "public, max-age=3600", // <-- Added caching
//       Connection: "keep-alive"
//     })

//     this.listeners.push(res)

//     res.on("close", () => {
//       this.listeners = this.listeners.filter(l => l !== res)
//     })

//   }

//   private broadcast(chunk: Buffer) {

//     for (const listener of this.listeners) {

//       try {
//         listener.write(chunk)
//       } catch {}

//     }

//   }

//   private sendMetadata(track: Track) {

//     const title = `${track.artist} - ${track.title}`

//     const metadata = createIcyMetadata(title)

//     for (const listener of this.listeners) {
//       listener.write(metadata)
//     }

//   }

//   async start() {

//     const play = async () => {

//       const track = this.playlist.next()

//       console.log(`Now playing: ${track.artist} - ${track.title}`)

//       const response = await fetch(track.file)

//       if (!response.body) {
//         console.error("Stream failed")
//         return play()
//       }

//       const throttle: any = new Throttle({ // come back and change
//         rate: 16000
//       })

//       const reader = response.body.getReader()

//       let bytesSinceMeta = 0

//       const read = async (): Promise<void> => {

//         const { done, value } = await reader.read()

//         if (done) {
//           play()
//           return
//         }

//         const chunk = Buffer.from(value)

//         let offset = 0

//         while (offset < chunk.length) {

//           const remaining = this.metaInt - bytesSinceMeta

//           const slice = chunk.slice(offset, offset + remaining)

//           const throttled = throttle._transform // come back and check
//             ? slice
//             : slice

//           this.broadcast(throttled)

//           bytesSinceMeta += slice.length
//           offset += slice.length

//           if (bytesSinceMeta >= this.metaInt) {

//             this.sendMetadata(track)

//             bytesSinceMeta = 0

//           }

//         }

//         setTimeout(read, 0)

//       }

//       read()

//     }

//     play()

//   }

// }


// import { Response, PassThrough } from "express"

// import Playlist from "./playlist"
// import { Track } from "./types"
// import { createIcyMetadata } from "./icyMetadata"

// export class StreamManager {

//   private listeners: Response[] = []
//   private broadcastStream: PassThrough = new PassThrough()
//   private metaInt = 16000 // bytes between metadata

//   constructor(private playlist: Playlist) {}

//   public addListener(res: Response) {
//     res.writeHead(200, {
//       "Content-Type": "audio/mpeg",
//       "icy-name": "PowerXtra Radio",
//       "icy-metaint": this.metaInt,
//       "Cache-Control": "public, max-age=3600",
//       Connection: "keep-alive"
//     })

//     this.listeners.push(res)

//     // Pipe broadcast to new listener
//     this.broadcastStream.pipe(res)

//     res.on("close", () => {
//       this.broadcastStream.unpipe(res)
//       this.listeners = this.listeners.filter(l => l !== res)
//     })
//   }

//   public start() {
//     const playNext = async () => {
//       const track = this.playlist.next()
//       console.log(`Now playing: ${track.artist} - ${track.title}`)

//       // FFmpeg: decode remote MP3 and output MPEG1 Layer III (mp3)
//       const ffmpeg = spawn("ffmpeg", [
//         "-i", track.file,        // Input remote URL
//         "-f", "mp3",             // Output format
//         "-content_type", "audio/mpeg",
//         "pipe:1"                 // Pipe output to stdout
//       ])

//       let bytesSinceMeta = 0

//       ffmpeg.stdout.on("data", (chunk: Buffer) => {

//         // Inject ICY metadata every metaInt bytes
//         let offset = 0
//         const buffers: Buffer[] = []

//         while (offset < chunk.length) {
//           const remaining = this.metaInt - bytesSinceMeta
//           const sliceLength = Math.min(remaining, chunk.length - offset)
//           const slice = chunk.slice(offset, offset + sliceLength)
//           buffers.push(slice)
//           offset += sliceLength
//           bytesSinceMeta += slice.length

//           if (bytesSinceMeta >= this.metaInt) {
//             const meta = createIcyMetadata(`${track.artist} - ${track.title}`)
//             buffers.push(meta)
//             bytesSinceMeta = 0
//           }
//         }

//         this.broadcastStream.write(Buffer.concat(buffers))
//       })

//       ffmpeg.on("close", () => {
//         playNext() // Auto-play next track
//       })

//       ffmpeg.stderr.on("data", data => {
//         // Optional: log FFmpeg warnings/errors
//         // console.error(data.toString())
//       })
//     }

//     playNext()
//   }
// }

