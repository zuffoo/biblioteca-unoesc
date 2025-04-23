import { DataTypes } from 'sequelize';
import sequelize from '../src/banco.js';

const Funcionario = sequelize.define('funcionario', {
  idfuncionario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomefuncionario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  contratacao: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  demissao: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'funcionario',
  timestamps: false
});

export default Funcionario;
