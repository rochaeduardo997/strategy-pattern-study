const { strict: { deepEqual }} = require('assert');

const Context      = require('../db/strategies/bases/Context');
const Postgres     = require('../db/strategies/postgres/Postgres');
const peopleSchema = require('../db/strategies/postgres/schemas/peopleSchema');

let context = null;
let id      = null;

const CREATE_PEOPLE_MODEL = {
  'first_name': 'TEST',
  'surname':    'THIS IS A TEST',
  'email':      'TEST@TEST.COM',
  'cpf':        '123.123.123-12'
};
const UPDATE_PEOPLE_MODEL = {
  'first_name': 'UPDATED',
  'surname':    'THIS IS A UPDATE',
  'email':      'UPDATE@UPDATE.BR',
  'cpf':        '000.000.000-00'

};
const UPDATE_PEOPLE_MODEL_NOT_NULL = {
  'first_name': 'UPDATED',
  'email':      'UPDATE@UPDATE.BR',
  'cpf':        '321.321.321-32'

};

describe('Must test all functions inside Postgres instance', async () => {
  before(async () => {
    const connection = await Postgres.connect();
    const model      = await Postgres.defineModel(connection, peopleSchema);

    context = new Context(new Postgres(connection, model));
  });

  it('Must authenticate to database', async () => {
    const result = await context.isConnected();

    deepEqual(result, true);
  });

  it('Must create a test user and return users informations', async () => {
    const result = await context.create(CREATE_PEOPLE_MODEL);
    id = result.id;

    delete result.id;
    delete result.createdAt;
    delete result.updatedAt;
    delete result.deletedAt;

    deepEqual(result, CREATE_PEOPLE_MODEL);
  });

  it('Must find all users from database', async () => {
    const result = await context.read();

    deepEqual(result.length > 0, true);
  });

  it('Must find user with specifc cpf(unique)', async () => {
    const [result] = await context.read({ cpf: CREATE_PEOPLE_MODEL.cpf });

    delete result.id;
    delete result.createdAt;
    delete result.updatedAt;
    delete result.deletedAt;

    deepEqual(result, CREATE_PEOPLE_MODEL);
  });

  it('Must update user field by id', async () => {
    const [result] = await context.update(id, UPDATE_PEOPLE_MODEL);

    deepEqual(result, 1);
  });

  it('Must update only not null user\'s field by id', async () => {
    const [result] = await context.update(id, UPDATE_PEOPLE_MODEL_NOT_NULL);

    deepEqual(result, 1);
  });

  it('Must update and fail with fake id', async () => {
    const result = await context.update('cc345423-be7c-4519-b8a5-e709e805e950', UPDATE_PEOPLE_MODEL_NOT_NULL);
    
    deepEqual(result.status, false);
  });

  it('Must delete user by id', async () => {
    const result = await context.delete(id);

    deepEqual(result, 1);
  });
});
