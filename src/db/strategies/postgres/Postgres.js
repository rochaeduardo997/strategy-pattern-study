const Sequelize      = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const InterfaceCrud = require('../interfaces/InterfaceCrud');


class Postgres extends InterfaceCrud{
  constructor(connection, schema){
    super();
    
    this._connection = connection;
    this._schema     = schema;
  }

  async verifyIfIDIsValid(id){
    try{
      if((await this.read({ id })).length <= 0) throw new Error('ID not found');
      return true;
    }catch(err){
      throw new Error('ID not found');
    }
  }

  async isConnected(){
    try{
      await this._connection.authenticate();

      return true
    }catch(err){
      console.log('Failed at Sequelize authenticate', { err });

      return false;
    }
  }
  static connect(){
    const connection = new Sequelize({
      'username': 'admin_postgres',
      'password': 'admin_password',
      'database': 'db_peoples',
      'host':     '172.17.0.2',
      'dialect':  'postgres',
      'logging':  false
    });

    return connection;
  }

  static async defineModel(connection, schema){
    const model = await connection.define(schema.name, schema.schema, schema.options);

    await model.sync({ alter: true });

    return model;
  }

  async create(item){
    item = { id: uuidv4(), ...item };

    const { dataValues } = await this._schema.create(item);

    return dataValues;
  }

  async read(query = {}){
    return await this._schema.findAll({ where: query, raw: true });
  }

  async update(id, item){
    try{
      await this.verifyIfIDIsValid(id);

      return await this._schema.update(item, { where: { id }});
    }catch(err){
      return { status: false, message: err.message };
    }
  }

  async delete(id){
    try{
      await this.verifyIfIDIsValid(id);

      return await this._schema.destroy({ where: { id }});
    }catch(err){
      return { status: false, message: err.message };
    }
  }
}

module.exports = Postgres;
