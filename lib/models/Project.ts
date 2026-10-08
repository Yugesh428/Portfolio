import {
  DataTypes, Model,
  InferAttributes, InferCreationAttributes, CreationOptional,
} from "sequelize";
import sequelize from "../db";

export type ProjectStatus = "planning" | "in_progress" | "review" | "completed" | "on_hold";

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<number>;
  declare clientId: number;          // FK → users.id
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare status: CreationOptional<ProjectStatus>;
  declare techStack: CreationOptional<string | null>; // comma-separated e.g. "Next.js,Node.js"
  declare budget: CreationOptional<number | null>;
  declare deadline: CreationOptional<Date | null>;
  declare completedAt: CreationOptional<Date | null>;
  declare coverUrl: CreationOptional<string | null>;
  declare coverPublicId: CreationOptional<string | null>;
  declare progress: CreationOptional<number>;  // 0-100
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Project.init(
  {
    id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clientId:       { type: DataTypes.INTEGER, allowNull: false },
    title:          { type: DataTypes.STRING(200), allowNull: false },
    description:    { type: DataTypes.TEXT, allowNull: true },
    status:         { type: DataTypes.ENUM("planning","in_progress","review","completed","on_hold"),
                      defaultValue: "planning" },
    techStack:      { type: DataTypes.STRING(500), allowNull: true },
    budget:         { type: DataTypes.DECIMAL(10,2), allowNull: true },
    deadline:       { type: DataTypes.DATE, allowNull: true },
    completedAt:    { type: DataTypes.DATE, allowNull: true },
    coverUrl:       { type: DataTypes.TEXT, allowNull: true },
    coverPublicId:  { type: DataTypes.STRING(255), allowNull: true },
    progress:       { type: DataTypes.INTEGER, defaultValue: 0,
                      validate: { min: 0, max: 100 } },
    createdAt:      DataTypes.DATE,
    updatedAt:      DataTypes.DATE,
  },
  { sequelize, tableName: "projects", timestamps: true }
);

export default Project;
