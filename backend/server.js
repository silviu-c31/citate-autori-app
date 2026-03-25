const express = require("express");
const cors = require("cors");
const Joi = require("joi");

const app = express();
app.use(cors());
app.use(express.json());

const JSON_SERVER_URL = "http://localhost:3000/quotes";

// verificam dacă id-ul din PUT şi DELETE este un număr valid
const validateId = (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};

// Schema Joi pentru validarea citatelor
const quoteSchema = Joi.object({
  author: Joi.string().min(2).required(),
  quote: Joi.string().min(5).required(),
});

// API route placeholder
app.get("/", (req, res) => {
  res.send("Printing Quotes API is running...");
});

// =========================================================================
// RUTA ACTUALIZATĂ: GET /api/quotes?search=termen
// Extragem citatele și le filtrăm dacă există un termen de căutare
// =========================================================================
app.get("/api/quotes", async (req, res) => {
  try {
    const response = await fetch(JSON_SERVER_URL);
    const data = await response.json();

    const { search } = req.query; // req.query conține parametrii din URL (?search=...)

    if (search && search.trim()) {
      const term = search.trim().toLowerCase();

      // Filtrăm array-ul - includem citatul dacă termenul apare
      // în numele autorului SAU în textul citatului
      const filtered = data.filter(
        (q) =>
          q.author.toLowerCase().includes(term) ||
          q.quote.toLowerCase().includes(term),
      );

      return res.status(200).json(filtered);
    }

    // Fără parametru search -> returnăm toate citatele
    res.status(200).json(data);
  } catch (error) {
    console.error("Eroare la preluarea citatelor:", error.message);
    res.status(500).json({ error: "Nu s-au putut prelua citatele." });
  }
});

// Adauga un nou citat
app.post("/api/quotes", async (req, res) => {
  const { error } = quoteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const response = await fetch(JSON_SERVER_URL);
    const quotes = await response.json();

    // generam un ID numeric (urmatorul numar disponibil)
    const newId =
      quotes.length > 0 ? Math.max(...quotes.map((q) => Number(q.id))) + 1 : 1;
    const newQuote = { id: newId.toString(), ...req.body }; // convertim ID-ul in sir pentru a se potrivi cu formatul db.json

    // trimite la json-server
    const postResponse = await fetch(JSON_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuote),
    });

    const data = await postResponse.json();
    res.status(postResponse.status).json(data);
  } catch (error) {
    console.error("Error adding quote:", error);
    res.status(500).json({ error: "Failed to add quote" });
  }
});

// Actualizam un citat
app.put("/api/quotes/:id", validateId, async (req, res) => {
  const { error } = quoteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const quoteId = req.params.id;
    // construiti obiectul actualizat, asigurandu-va ca 'id' este prima cheie
    const updatedQuote = { id: quoteId, ...req.body };

    const response = await fetch(`${JSON_SERVER_URL}/${quoteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedQuote),
    });

    // verificam dacă există citatul
    if (!response.ok) {
      return res.status(404).json({ error: "Quote not found" });
    }

    const data = await response.json();
    // creati un nou obiect cu id ca prima cheie
    const reorderedData = {
      id: data.id,
      author: data.author,
      quote: data.quote,
    };
    res.status(response.status).json(reorderedData);
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ error: "Failed to update quote" });
  }
});

// Stergem un citat
app.delete("/api/quotes/:id", validateId, async (req, res, next) => {
  try {
    const quoteId = req.params.id;
    const response = await fetch(`${JSON_SERVER_URL}/${quoteId}`);

    // verificam dacă există citatul
    if (!response.ok) {
      return res.status(404).json({ error: "Quote not found" });
    }

    await fetch(`${JSON_SERVER_URL}/${quoteId}`, { method: "DELETE" });
    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Pornim serverul
const port = 5000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`),
);

// Verificam repornirea automata a serverului
console.log("Server restarted!");
// app.get("/", (req, res) => {
//   res.json({
//     message: "Printing Quotes API is running...",
//     endpoints: {
//       quotes: "/api/quotes",
//       health: "/api/health",
//     },
//   });
// });

// let quotes = [
//   {
//     id: 1,
//     author: "Socrates ",
//     quote: "The only true wisdon is in knowing you know nothing",
//   },
//   {
//     id: 2,
//     author: "Albert Einstein",
//     quote:
//       "Life is like riding a bicycle. To keep your balance you must keep moving.",
//   },
// ];

// app.get("/api/quotes", (req, res) => {
//   res.status(200).json(quotes);
// });

// app.post("/api/quotes", (req, res) => {
//   const { author, quote } = req.body;
//   const newQuote = {
//     id: quotes.length + 1,
//     author,
//     quote,
//   };
//   quotes.push(newQuote);
//   res.status(201).json(newQuote);
// });

// app.put("/api/quotes/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const { author, quote } = req.body;
//   const index = quotes.findIndex((q) => q.id === id);
//   if (index == -1) {
//     return res.status(404).json({ messge: "Citatul nu a putut fi gasit" });
//   }
//   quotes[index] = { id, author, quote };
//   res.status(200).json(quotes[index]);
// });

// app.delete("/api/quotes/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = quotes.findIndex((q) => q.id === id);
//   if (index == -1) {
//     return res.status(404).json({ messge: "Citatul nu a putut fi gasit" });
//   }
//   quotes.splice(index, 1);
//   res.status(200).json({ message: "Citatul a fost sters cu succes" });
// });
