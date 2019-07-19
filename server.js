const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const router = require(path.join(__dirname, 'routes/router'));
const PORT = process.env.PORT || 1337;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', router);

app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log(`Server running on port: ${PORT}`);
    }
})
