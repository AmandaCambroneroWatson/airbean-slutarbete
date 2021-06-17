const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const { database } = require('./database/db-operations');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

function initiateDataBase() {
  database.defaults({ accounts: [], orders: [] }).write();
}


PORT = 5000;

app.listen(PORT, ()=> {
  console.log(`Backend is running on http://localhost:${PORT}`)
  initiateDataBase();
})