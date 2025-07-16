const express = require('express');
const routers = require('./routers/index')
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', routers);

app.listen(3500, () => console.log('Backend running on http://localhost:3000'));