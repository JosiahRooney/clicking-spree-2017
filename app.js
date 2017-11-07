// require express
const express = require('express');

const app = express();

const port = 8000;

app.use(express.static('dist/css'));
app.use(express.static('src'));
app.use(express.static('./node_modules'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
