import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db";

export type ProjectCategory = "saas" | "web-app" | "api" | "mobile" | "other";
export type ProjectStatus = "completed" | "in-progress" | "planned";

interface ProjectAttributes {
  id: number;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  shortDescription: string;
  technologies: string;        // comma-separated
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  isPrivate: boolean;
  isFeatured: boolean;
  color: string;
  badgeEmoji: string;
  startDate: string | null;
  endDate: string | null;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes
  extends Optional<ProjectAttributes, "id" | "createdAt" | "updatedAt"> {}

class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: number;
  public title!: string;
  public category!: ProjectCategory;
  public status!: ProjectStatus;
  public description!: string;
  public shortDescription!: string;
  public technologies!: string;
  public image!: string | null;
  public githubUrl!: string | null;
  public liveUrl!: string | null;
  public isPrivate!: boolean;
  public isFeatured!: boolean;
  public color!: string;
  public badgeEmoji!: string;
  public startDate!: string | null;
  public endDate!: string | null;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id:               { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title:            { type: DataTypes.STRING(200), allowNull: false },
    category:         {
      type: DataTypes.ENUM("saas", "web-app", "api", "mobile", "other"),
      allowNull: false,
      defaultValue: "web-app",
    },
    status:           {
      type: DataTypes.ENUM("completed", "in-progress", "planned"),
      allowNull: false,
      defaultValue: "completed",
    },
    description:      { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    shortDescription: { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    technologies:     { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    image:            { type: DataTypes.TEXT, allowNull: true },
    githubUrl:        { type: DataTypes.STRING(500), allowNull: true },
    liveUrl:          { type: DataTypes.STRING(500), allowNull: true },
    isPrivate:        { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isFeatured:       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    color:            { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#2563EB" },
    badgeEmoji:       { type: DataTypes.STRING(10), allowNull: false, defaultValue: "💻" },
    startDate:        { type: DataTypes.STRING(50), allowNull: true },
    endDate:          { type: DataTypes.STRING(50), allowNull: true },
    order:            { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    createdAt:        DataTypes.DATE,
    updatedAt:        DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "portfolio_projects",
    timestamps: true,
  }
);

export default Project;
