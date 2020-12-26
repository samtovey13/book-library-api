/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');

describe('/readers', () => {
  before(async () => Reader.sequelize.sync());
  beforeEach(async () => Reader.destroy({ where: {} }));

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        const readers = await request(app).get('/readers');
        const response = await request(app).post('/readers').send({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'secret-password',
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Elizabeth Bennet');
        expect(newReaderRecord.name).to.equal('Elizabeth Bennet');
        expect(newReaderRecord.email).to.equal('future_ms_darcy@gmail.com');
        expect(newReaderRecord.password).to.equal('secret-password');
      });

      it('throws an error if any fields are empty', async () => {
        const response = await request(app).post('/readers').send({
          name: '',
          email: '',
          password: '',
        });
        
        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(
          [
            'Name cannot be empty',
            'Email cannot be empty',
            'Password cannot be empty',
          ]
        );
      });

      it('validates reader name on creation', async () => {
        const response = await request(app).post('/readers').send({
          name: [1, 2, 3],
          email: 'array@gmail.com',
          password: 'array-password',
        });
        
        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(
          ['name cannot be an array or an object']
        );
      });

      it('validates reader password on creation', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Mr Bad Password',
          email: 'badpassword@hotmail.com',
          password: '1',
        });
        
        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(
          ['Password must have at least 8 characters']
        );
      })

      it('validates reader email on creation', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Lady No-Email',
          email: 'not.an.email',
          password: 'secret-password',
        });
        
        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(
          ['Not a valid email']
        );
      })

    });
  });

  describe('with records in the database', () => {
    let readers;

    beforeEach(async () => {
      await Reader.destroy({ where: {} });

      readers = await Promise.all([
        Reader.create({
          name: 'Elizabeth Bennet',
          email: 'future_ms_darcy@gmail.com',
          password: 'secret-password',
        }),
        Reader.create({ name: 'Arya Stark', email: 'vmorgul@me.com', password: 'AllMenMustDie' }),
        Reader.create({ name: 'Lyra Belacqua', email: 'darknorth123@msn.org', password: 'Pantalaimon' }),
      ]);
    });

    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        const response = await request(app).get('/readers');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(reader.password).to.equal(expected.password);
        });
      });
    });

    describe('GET /readers/:id', () => {
      it('gets readers record by id', async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
        expect(response.body.password).to.equal(reader.password);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).get('/readers/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });

    describe('PATCH /readers/:id', () => {
      it('updates readers email by id', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'miss_e_bennet@gmail.com' });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .patch('/readers/12345')
          .send({ email: 'some_new_email@gmail.com' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });

      it('returns a 404 if the new data is not validated', async () => {
        const reader = readers[0];
        const originalEmail = reader.email;
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'iAmNotAnEmail' });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.include.members(['Not a valid email'])
        expect(updatedReaderRecord.email).to.equal(originalEmail);
      })
    });

    describe('DELETE /readers/:id', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).delete('/readers/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The reader could not be found.');
      });
    });
  });
});
