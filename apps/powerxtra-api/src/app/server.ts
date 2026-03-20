import cors from "cors";
import express from "express";
import { AdvertRoutes, AlbumRoutes, ArtistRoutes,
  NewsRoutes, PlaylistRoutes, ProgrammeRoutes,
  TrackRoutes } from "./routers";
import { ErrorHandler } from "../error-handler";
import { StreamRoutes } from "./routers/radio-stream-routes/radio-stream.routes";
import { AuthRoutes } from "./auths";


const app = express()

// Use cors for same origin url
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// express Bodyparser
app.use(express.json());

// Radio Stream
app.use(StreamRoutes);

// User Auth Routes
app.use("/api", [ AuthRoutes ]);

// Main routes start here
app.use("/api", [
  TrackRoutes, PlaylistRoutes,
  AlbumRoutes, ArtistRoutes, ProgrammeRoutes,
  NewsRoutes, AdvertRoutes
]);

// Error Handler
app.use(ErrorHandler);
export default app;


// if needed
// ffmpeg -i http://localhost:3000/stream \
// -f mp3 icecast://source:password@localhost:8000/live
