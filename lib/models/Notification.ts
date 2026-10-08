import {
  DataTypes, Model,
  InferAttributes, InferCreationAttributes, CreationOptional,
} from "sequelize";
import sequelize from "../db";

export type NotificationType =
  | "new_message"
  | "project_update"
  | "client_approved"
  | "client_rejected"
  | "new_contact"
  | "file_uploaded";

class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: CreationOptional<number>;
  declare userId: number;           // who receives this notification
  declare type: NotificationType;
  declare title: string;
  declare body: CreationOptional<string | null>;
  declare link: CreationOptional<string | null>;   // e.g. "/dashboard/messages/5"
  declare isRead: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Notification.init(
  {
    id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId:   { type: DataTypes.INTEGER, allowNull: false },
    type:     { type: DataTypes.ENUM(
                  "new_message","project_update","client_approved",
                  "client_rejected","new_contact","file_uploaded"
                ), allowNull: false },
    title:    { type: DataTypes.STRING(200), allowNull: false },
    body:     { type: DataTypes.TEXT, allowNull: true },
    link:     { type: DataTypes.STRING(500), allowNull: true },
    isRead:   { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "notifications", timestamps: true }
);

export default Notification;
