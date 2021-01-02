/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => Genre.sequelize.sync());
  beforeEach(async () => Genre.destroy({ where: {} }));

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'crime',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('crime');
        expect(newGenreRecord.genre).to.equal('crime');
      });

      it('throws an error if genre is empty', async () => {
        const response = await request(app).post('/genres').send({});
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.include.members(
          [
            'Genre cannot be empty'
          ]
        );
        expect(newGenreRecord).to.equal(null);
      });

      it('validates title on creation', async () => {
        const response = await request(app).post('/genres').send({
          genre: [1, 2, 3]
        });
        expect(response.status).to.equal(400);
        expect(response.body.error).to.include.members(
          [
            'genre cannot be an array or an object'
          ]
        );
      });

      it('cannot create a genre if it is not unique', async () => {
        const response1 = await request(app)
          .post('/genres')
          .send({ genre: 'Sci fi' });

        const response2 = await request(app)
          .post('/genres')
          .send({ genre: 'Sci fi' });

        const newGenreRecordOnFirstCall = await Genre.findByPk(response1.body.id, { raw: true });
        const newGenreRecordOnSecondCall = await Genre.findByPk(response2.body.id, { raw: true });

        expect(response1.status).to.equal(201);
        expect(response2.status).to.equal(400);
        expect(response1.body.errors).to.equal(undefined);
        expect(response2.body.error.length).to.equal(1);
        expect(response2.body.error).to.include.members(['Genres.genre must be unique']);
        expect(newGenreRecordOnFirstCall.genre).to.equal('Sci fi');
        expect(newGenreRecordOnSecondCall).to.equal(null);
      });
    });

  describe('with records in the database', () => {
    let genres;

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({
          genre: 'crime',
        }),
        Genre.create({ 
          genre: 'autobiography',
         }),
         Genre.create({ 
          genre: 'fiction',
        }),
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genres records', async () => {
        const response = await request(app).get('/genres');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);

          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });

    describe('GET /genres/:id', () => {
      it('gets genres record by id', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).get('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genres by id', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'thriller' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal('thriller');
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/12345')
          .send({ genre: 'some other genre' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });

      it('returns a 400 if the new data is not validated', async () => {
        const genre = genres[0];
        const originalGenre = genre.genre;
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: '' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.include.members(['Genre cannot be empty'])
        expect(updatedGenreRecord.genre).to.equal(originalGenre);
      })
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).delete('/genres/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The genre could not be found.');
      });
    });
  });
});
});
