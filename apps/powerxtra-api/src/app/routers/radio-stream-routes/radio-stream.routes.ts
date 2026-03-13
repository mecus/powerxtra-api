import express, { NextFunction, Request, Response } from "express";
import { StreamManager } from "../../controllers";
// import { warmUpBitrateCache } from "../../controllers/lradio-ive-stream/stream-manager";
// import { jsonData } from "../../json-data";
import { RadioQueue } from "../../controllers/lradio-ive-stream/radio-queue";

export const StreamRoutes = express.Router();

// const playlist = new PlaylistManager(); // actual json data
const streamManager = new StreamManager();


StreamRoutes.get("/start_auto_dj", (req: Request, res: Response) => {
  const status = StreamManager.getStreamingStatus();
  if(status.on) {
    res.status(200).json({message: "Radio Streaming is already On...", status: "started"})
  } else if(status.status == "Stopping") {
    res.status(200).json({message: "Radio Streaming is proccessing stop action..Try again later", status: "stopping"})
  } else  {
    // warmUpBitrateCache(jsonData());
    streamManager.enableStreaming();
    streamManager.start();
    res.status(200).json({message: "Radio Streaming started...", status: "started"})
  }

});
StreamRoutes.get("/stop_auto_dj", (req: Request, res: Response) => {
  const status = StreamManager.getStreamingStatus();
  if(status.status == "Stopped" || status.status == "Stopping"){
    res.status(200).json({message: "Radio Streaming has stopped or is processing stop action...", status: "stopped"})
  }else if(status.on){
    streamManager.disableStreaming();
    res.status(200).json({message: "Stopping Radio Streaming", status: "stopping"});
  }else{
     res.status(200).send("No action to perform");
  }
});

StreamRoutes.get("/stream", (req: Request, res: Response) => {
  streamManager.addListener(res)
});

StreamRoutes.get("/radio_queue", async(req, res, next) => {
  try{
    const updatedQueue = await RadioQueue.getQueue();
    res.status(200).json({ message: 'Sync Successful', data: updatedQueue });
  }catch(err){
    next(err);
  }
});
StreamRoutes.patch("/update_radio_queue", async(req, res, next) => {
  try{
    const { tracks } = req.body;
    const updatedQueue = await RadioQueue.updateQueue(tracks);
    // const playlist = new StreamManager();
    // console.log(playlist);
    res.status(200).json({ message: 'Sync Successful', data: updatedQueue });
  }catch(err){
    next(err);
  }
});

StreamRoutes.get("/radio_playlist", (req, res) => {
  // res.status(200).json(playlist.all())
});

StreamRoutes.get("/playing_now", (req, res) => {
  const currentTrack = StreamManager.getCurrentTrack();
  res.status(200).json(currentTrack);
});

StreamRoutes.get("/status", (req, res) => {
  res.status(200).json(StreamManager.getStreamingStatus());
});
StreamRoutes.get("/listeners", (req: Request, res: Response, next: NextFunction) => {
  try{
    res.status(200).json(StreamManager.getListeners());
  }catch(err) {
    next(err);
  }
});

// to be remove in production
// setTimeout(() => {
//   streamManager.start();
// }, 1000);
