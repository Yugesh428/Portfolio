import {
  DataTypes, Model,
  InferAttributes, InferCreationAttributes, CreationOptional,
} from "sequelize";
import sequelize from "../db";

class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<number>;
  declare senderId: number;       // FK → users.id
  declare receiverId: number;     // FK → users.id
  declare projectId: CreationOptional<number | null>;  // optional FK → projects.id
  declare body: string;
  declare isRead: CreationOptional<boolean>;
  declare attachmentUrl: CreationOptional<string | null>;
  declare attachmentPublicId: CreationOptional<string | null>;
  declare attachmentName: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Message.init(
  {
    id:                 { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    senderId:           { type: DataTypes.INTEGER, allowNull: false },
    receiverId:         { type: DataTypes.INTEGER, allowNull: false },
    projectId:          { type: DataTypes.INTEGER, allowNull: true },
    body:               { type: DataTypes.TEXT, allowNull: false },
    isRead:             { type: DataTypes.BOOLEAN, defaultValue: false },
    attachmentUrl:      { type: DataTypes.TEXT, allowNull: true },
    attachmentPublicId: { type: DataTypes.STRING(255), allowNull: true },
    attachmentName:     { type: DataTypes.STRING(255), allowNull: true },
    createdAt:          DataTypes.DATE,
    updatedAt:          DataTypes.DATE,
  },
  { sequelize, tableName: "messages", timestamps: true }
);

export default Message;
