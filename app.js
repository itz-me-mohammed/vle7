    const express = require('express');
const app = express();
const port = 3000;

// Color is set via environment variable (blue/green)
const color = process.env.COLOR || 'blue';

app.get('/', (req, res) => {
  res.send(`<h1>Hello from ${color} version!</h1>`);
});

app.listen(port, () => {
  console.log(`App running on port ${port}, color: ${color}`);
});
