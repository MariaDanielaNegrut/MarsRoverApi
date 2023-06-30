import {getAllRovers, getRoverPhotos} from "../controllers/rover.controllers";

const express = require("express");
const app = express();
app.use(express.json());

const router = express.Router();
router.get('/rovers/:roverName/photos/:cameraType', getRoverPhotos);
router.get('/rovers', getAllRovers);

export default router;

