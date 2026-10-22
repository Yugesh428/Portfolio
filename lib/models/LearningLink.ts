import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface LearningLinkAttributes {
  id: number;
  title: string;
  url: string;
  type: "youtube" | "course" | "article" | "documentation" | "tutorial" | "book" | "other";
  category: string;
  platform: string;
  description: string;
  thumbnailUrl?: string;
  author?: string;
  duration?: string;
  isCompleted: boolean;
  isFavorite: boolean;
  progress: number;
  rating?: number;
  notes?: string;
  tags: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LearningLinkCreationAttributes
  extends Optional<LearningLinkAttributes, "id" | "thumbnailUrl" | "author" | "duration" | "rating" | "notes" | "isCompleted" | "isFavorite" | "progress"> {}

class LearningLink
  extends Model<LearningLinkAttributes, LearningLinkCreationAttributes>
  implements LearningLinkAttributes
{
  public id!: number;
  public title!: string;
  public url!: string;
  public type!: "youtube" | "course" | "article" | "documentation" | "tutorial" | "book" | "other";
  public category!: string;
  public platform!: string;
  public description!: string;
  public thumbnailUrl?: string;
  public author?: string;
  public duration?: string;
  public isCompleted!: boolean;
  public isFavorite!: boolean;
  public progress!: number;
  public rating?: number;
  public notes?: string;
  public tags!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LearningLink.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("youtube", "course", "article", "documentation", "tutorial", "book", "other"),
      allowNull: false,
      defaultValue: "article",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "programming",
    },
    platform: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Other",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    thumbnailUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    sequelize,
    tableName: "learning_links",
    timestamps: true,
    indexes: [
      { fields: ["type"] },
      { fields: ["category"] },
      { fields: ["platform"] },
      { fields: ["isCompleted"] },
      { fields: ["isFavorite"] },
    ],
  }
);

export default LearningLink;
