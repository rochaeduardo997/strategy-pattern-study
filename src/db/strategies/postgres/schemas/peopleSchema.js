const Sequelize = require('sequelize');

const peopleSchema = {
  'name': 'tbl_people',
  'schema': {
    'id':         { 'type': Sequelize.UUID,   'allowNull': false, 'primaryKey': true },

    'first_name': { 'type': Sequelize.STRING, 'allowNull': false },
    'surname':    { 'type': Sequelize.STRING, 'allowNull': true  },

    'email': { 'type': Sequelize.STRING, 'allowNull': false },

    'cpf': { 'type': Sequelize.STRING, 'allowNull': false, unique: true },

    'deletedAt': { 'type': Sequelize.DATE },
    'createdAt': { 'type': Sequelize.DATE },
    'updatedAt': { 'type': Sequelize.DATE }
  },
  'options': {
    'tableName':       'tbl_people',
    'freezeTableName': false,
    'timestamps':      true
  }
}

module.exports = peopleSchema;
