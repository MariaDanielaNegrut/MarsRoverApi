import router from './routes/rover.routes';
const cors = require('cors');

const express = require("express");
const app = express();
const port = 8000;

app.use(cors());
app.use('/', router);

app.listen(port, () => {
    console.log(`Test backend is running on port ${port}`);
});