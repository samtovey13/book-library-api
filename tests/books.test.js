/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models');
const app = require('../src/app');

describe('/books', () => {
  before(async () => Book.sequelize.sync());
  beforeEach(async () => Book.destroy({ where: {} }));

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'A Song for the Dark Times',
          author: 'Ian Rankin',
          genre: 'crime',
          ISBN: 9781409176978,
        });
        const newBookRecord = await Book.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('A Song for the Dark Times');
        expect(newBookRecord.title).to.equal('A Song for the Dark Times');
        expect(newBookRecord.author).to.equal('Ian Rankin');
        expect(newBookRecord.genre).to.equal('crime');
        expect(newBookRecord.ISBN).to.equal(9781409176978);
      });

      it('throws an error if title or author is empty', async () => {
        const response = await request(app).post('/books').send({
          title: '',
          author: '',
          genre: '',
          ISBN: '',
        });
        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(
          [
            'Title cannot be empty',
            'Author cannot be empty'
          ]
        );
      });

      it('validates title on creation', async () => {
        const response = await request(app).post('/books').send({
          title: [1, 2, 3],
          author: { name: 'Bill', dob: 1983 }
        });
        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(
          [
            'title cannot be an array or an object',
            'author cannot be an array or an object'
          ]
        );
      });
    });
  });

  describe('with records in the database', () => {
    let books;

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({
          title: 'A Song for the Dark Times',
          author: 'Ian Rankin',
          genre: 'crime',
          ISBN: 9781409176978,
        }),
        Book.create({ 
          title: 'A Promised Land',
          author: 'Barack Obama',
          genre: 'autobiography',
          ISBN: 9780241491515,
         }),
        Book.create({ 
          title: 'The Ickabog',
          author: 'J. K. Rowling',
          genre: 'fiction',
          ISBN: 9781510202252,
        }),
      ]);
    });

    describe('GET /books', () => {
      it('gets all books records', async () => {
        const response = await request(app).get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });

    describe('GET /books/:id', () => {
      it('gets books record by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.genre).to.equal(book.genre);
        expect(response.body.ISBN).to.equal(book.ISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });

    describe('PATCH /books/:id', () => {
      it('updates books email by id', async () => {
        const book = books[0];
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ genre: 'thriller' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.genre).to.equal('thriller');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app)
          .patch('/books/12345')
          .send({ genre: 'some other genre' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });

      it('returns a 404 if the new data is not validated', async () => {
        const book = books[0];
        const originalTitle = book.title;
        const response = await request(app)
          .patch(`/books/${book.id}`)
          .send({ title: '' });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(['Title cannot be empty'])
        expect(updatedBookRecord.title).to.equal(originalTitle);
      })
    });

    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});
