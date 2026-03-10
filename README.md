# 📝 Printing Quotes API

A RESTful API built with **Node.js** and **Express** for managing a collection of quotes. Data is persisted using **JSON Server** as a lightweight backend database.

---

## 🚀 Tech Stack

- **Node.js** – Runtime environment
- **Express** – Web framework
- **JSON Server** – Mock REST database (`db.json`)
- **Joi** – Request body validation
- **CORS** – Cross-origin resource sharing

---

## 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start JSON Server** (on port 3000):

   ```bash
   npx json-server --watch db.json --port 3000
   ```

4. **Start the Express server** (on port 5000):
   ```bash
   node server.js
   ```

The API will be available at `http://localhost:5000`.

---

## 🗄️ Database

The project uses a `db.json` file as the data store. Make sure it exists in the root directory with the following structure:

```json
{
  "quotes": [
    {
      "id": "1",
      "author": "Socrates",
      "quote": "The only true wisdom is in knowing you know nothing."
    }
  ]
}
```

---

## 📡 API Endpoints

| Method   | Endpoint          | Description              |
| -------- | ----------------- | ------------------------ |
| `GET`    | `/api/quotes`     | Retrieve all quotes      |
| `POST`   | `/api/quotes`     | Add a new quote          |
| `PUT`    | `/api/quotes/:id` | Update an existing quote |
| `DELETE` | `/api/quotes/:id` | Delete a quote           |

---

## 🔍 Endpoint Details

### GET `/api/quotes`

Returns all quotes from the database.

**Response:**

```json
[
  {
    "id": "1",
    "author": "Albert Einstein",
    "quote": "Life is like riding a bicycle. To keep your balance you must keep moving."
  }
]
```

---

### POST `/api/quotes`

Adds a new quote. The `id` is auto-generated.

**Request Body:**

```json
{
  "author": "Marcus Aurelius",
  "quote": "You have power over your mind, not outside events."
}
```

**Validation rules:**

- `author` – required, minimum 2 characters
- `quote` – required, minimum 5 characters

---

### PUT `/api/quotes/:id`

Updates an existing quote by ID.

**Request Body:**

```json
{
  "author": "Marcus Aurelius",
  "quote": "The impediment to action advances action. What stands in the way becomes the way."
}
```

Returns `404` if the quote is not found. Returns `400` if the ID is not a valid number.

---

### DELETE `/api/quotes/:id`

Deletes a quote by ID.

**Response:**

```json
{
  "message": "Quote deleted successfully"
}
```

Returns `404` if the quote is not found. Returns `400` if the ID is not a valid number.

---

## ✅ Validation

Input validation is handled by **Joi**. Invalid requests return a `400` status with an error message:

```json
{
  "error": "\"author\" is required"
}
```

---

## 🛠️ Project Structure

```
├── server.js       # Main Express server
├── db.json         # JSON Server database
├── package.json
└── README.md
```

---

## 📋 Scripts

| Command                                       | Description           |
| --------------------------------------------- | --------------------- |
| `node server.js`                              | Start the API server  |
| `npx json-server --watch db.json --port 3000` | Start the JSON Server |

> 💡 **Tip:** Use a tool like [nodemon](https://nodemon.io/) for automatic server restarts during development:
>
> ```bash
> npx nodemon server.js
> ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
