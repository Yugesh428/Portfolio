import {
  DataTypes, Model,
  InferAttributes, InferCreationAttributes, CreationOptional,
} from "sequelize";
import sequelize from "../db";

export type UserRole = "admin" | "client";
export type UserStatus = "pending" | "approved" | "rejected";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare passwordHash: CreationOptional<string | null>;
  declare role: CreationOptional<UserRole>;
  declare status: CreationOptional<UserStatus>;
  declare company: CreationOptional<string | null>;
  declare phone: CreationOptional<string | null>;
  declare avatarUrl: CreationOptional<string | null>;
  declare avatarPublicId: CreationOptional<string | null>;
  declare lastLoginAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id:              { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name:            { type: DataTypes.STRING(100), allowNull: false },
    email:           { type: DataTypes.STRING(200), allowNull: false, unique: true,
                       validate: { isEmail: true } },
    passwordHash:    { type: DataTypes.STRING(255), allowNull: true },
    role:            { type: DataTypes.ENUM("admin", "client"), defaultValue: "client" },
    status:          { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
    company:         { type: DataTypes.STRING(150), allowNull: true },
    phone:           { type: DataTypes.STRING(30), allowNull: true },
    avatarUrl:       { type: DataTypes.TEXT, allowNull: true },
    avatarPublicId:  { type: DataTypes.STRING(255), allowNull: true },
    lastLoginAt:     { type: DataTypes.DATE, allowNull: true },
    createdAt:       DataTypes.DATE,
    updatedAt:       DataTypes.DATE,
  },
  { sequelize, tableName: "users", timestamps: true }
);

export default User;
