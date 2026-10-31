import express from "express";
import sequelize from "./config/db.js";
import Book from "./models/book.js";

const app = express();
const PORT = 3000;

// Парсинг JSON из тела запроса
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

// ===== GET /books — получить все книги =====
app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Не удалось получить книги" });
  }
});

// ===== POST /books — создать книгу =====
app.post("/books", async (req, res) => {
  try {
    const { title, author, year } = req.body || {};

    if (!title || !author || !year) {
      return res
        .status(400)
        .json({ error: "Нужно передать title, author и year" });
    }

    const book = await Book.create({ title, author, year });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Не удалось создать книгу" });
  }
});

// ===== PUT /books/:id — обновить книгу =====
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [updatedCount] = await Book.update(req.body, {
      where: { id },
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ error: "Книга не найдена или данные не изменились" });
    }

    const updatedBook = await Book.findByPk(id);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Не удалось обновить книгу" });
  }
});

// ===== DELETE /books/:id — удалить книгу =====
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Book.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Книга не найдена" });
    }

    res.json({ message: `Книга с id ${id} удалена` });
  } catch (error) {
    res.status(500).json({ error: "Не удалось удалить книгу" });
  }
});

// ===== Запуск =====
sequelize
  .authenticate()
  .then(() => {
    console.log("Подключение к базе данных успешно");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Ошибка подключения к базе данных:", error.message);
  });
