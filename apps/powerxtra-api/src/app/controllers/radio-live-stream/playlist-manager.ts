// import fs from "fs";
import { Track } from "../../interfaces";
import { RadioQueue } from "./radio-queue";
// import { warmUpBitrateCache } from "./stream-manager";

export class PlaylistManager {

  private tracks: Track[] | any;
  private index = 0

  constructor(jsonPath?: any) {

    // const data = fs.readFileSync(jsonPath, "utf-8")
    // this.tracks = jsonPath; //JSON.parse(data)
     this.loadTracks();

  }

  public next(): Track {
    // console.log("Loading track from database")
    // this.loadTracks();

    const track = this.tracks[this.index]

    this.index = (this.index + 1) % this.tracks.length
    // const track = await RadioQueue.nextQueueTrack();
    // console.log(track)

    return track

  }

  public all(): Track[] {

    return this.tracks

  }

  private loadTracks() {
    RadioQueue.getQueue().then(async(res: any) => {
       const tracks: Array<any> = res?.tracks;
      //  console.log(res);
      const track = await RadioQueue.nextQueueTrack();
      console.log("TRACK", track)
      if(res?.tracks?.length){
        this.tracks = tracks.map(t => t.trackId);
        console.log(this.tracks)
        // warmUpBitrateCache(this.tracks);
      }else{
        this.tracks = [];
      }
    }).catch(err => {
      console.log(err)
    })
  }

}









// export class Playlist {

//   private tracks: string[];
//   private index: number = 0;

//   constructor(private folder: string) {

//     this.tracks = fs.readdirSync(folder)
//       .filter(file => file.endsWith(".mp3"))
//       .map(file => path.join(folder, file));

//   }

//   public nextTrack(): string {

//     const track = this.tracks[this.index];

//     this.index = (this.index + 1) % this.tracks.length;

//     return track;

//   }

//   public getPlaylist(): string[] {

//     return this.tracks;

//   }

// }
