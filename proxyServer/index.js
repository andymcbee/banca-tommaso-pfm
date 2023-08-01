const express = require("express");
const app = express();
const port = 8080;

const cors = require("cors");

//cors middleware

//Lock this down if pushing to prod. Not secure.
app.use(
  cors({
    origin: "*",
  })
);

app.get("/cards", async (req, res) => {
  let data = await fetch(
    "https://tommaso-bank.netlify.app/.netlify/functions/cards"
  ).then((response) => {
    return response.text();
  });

  res.send(data);
});

app.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;

  const url = `https://tommaso-bank.netlify.app/.netlify/functions/cards/transactions/${id}`;

  console.log(id);

  let data = await fetch(url).then((response) => {
    return response.text();
  });

  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
