/* eslint-disable eqeqeq */
/* eslint-disable no-shadow */
const { nanoid } = require('nanoid');
const books = require('./books');

// Add New Book
const addBookHandler = (req, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const resp = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    resp.code(400);
    return resp;
  }
  if (readPage > pageCount) {
    const resp = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    resp.code(400);
    return resp;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSucces = books.filter((book) => book.id === id).length > 0;

  if (isSucces) {
    const resp = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    });
    resp.code(201);
    return resp;
  }

  const resp = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  resp.code(500);
  return resp;
};

// get All Books
const getAllBooksHandler = (req, h) => {
  const { name, reading, finished } = req.query;
  let filteredBooks = books;

  // pencarian query nama
  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase()
      .includes(name.toLowerCase()));
  }
  // pencarian query reading
  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading == reading);
  }
  // pencarian query finished
  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished == finished);
  }

  const resp = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  resp.code(200);
  return resp;
};

// get Spesifik Book
const getBookById = (req, h) => {
  const { bookId: id } = req.params;
  const book = books.filter((book) => book.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }
  const resp = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  resp.code(404);
  return resp;
};

// edit book
const editBookHandler = (req, h) => {
  const { bookId: id } = req.params;
  const bookIndex = books.findIndex((book) => book.id === id);
  const updatedAt = new Date().toISOString();
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  // jika id buku tidak ditemukan
  if (bookIndex === -1) {
    const resp = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
  }

  // error apabila tidak terdapat atribut name
  if (!name) {
    const resp = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    resp.code(400);
    return resp;
  }
  // error apabila read page lebih banyak dari page count
  if (readPage > pageCount) {
    const resp = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    resp.code(400);
    return resp;
  }

  // apabila berhasil menemukan buku
  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };
  const resp = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  resp.code(200);
  return resp;
};

// delete Book
const deleteBookHandler = (req, h) => {
  const { bookId: id } = req.params;
  const bookIndex = books.findIndex((book) => book.id === id);

  // apabila id tidak ditemukan
  if (bookIndex === -1) {
    const resp = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    resp.code(404);
    return resp;
  }

  // penghapusan apabila id ditemukan
  books.splice(bookIndex, 1);
  const resp = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  resp.code(200);
  return resp;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookById, editBookHandler, deleteBookHandler,
};
