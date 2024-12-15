const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/public", express.static("public"));

require('./routes/productsRoutes')(app);
require('./routes/carsRoutes')(app);


// const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log('Server running on port 5000');
});


