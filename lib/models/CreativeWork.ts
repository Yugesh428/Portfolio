import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface CreativeWorkAttributes {
  id: number;
  title: string;
  type: "book" | "poem" | "rap" | "story" | "essay" | "article" | "script" | "other";
  category: string;
  description: string;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  coverImageUrl?: string;
  status: "draft" | "in-progress" | "completed" | "published";
  isPublic: boolean;
  wordCount?: number;
  language: string;
  tags: string;
  publishedDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreativeWorkCreationAttributes
  extends Optional<CreativeWorkAttributes, "id" | "content" | "fileUrl" | "fileName" | "fileSize" | "coverImageUrl" | "wordCount" | "publishedDate" | "notes"> {}

class CreativeWork
  extends Model<CreativeWorkAttributes, CreativeWorkCreationAttributes>
  implements CreativeWorkAttributes
{
  public id!: number;
  public title!: string;
  public type!: "book" | "poem" | "rap" | "story" | "essay" | "article" | "script" | "other";
  public category!: string;
  public description!: string;
  public content?: string;
  public fileUrl?: string;
  public fileName?: string;
  public fileSize?: number;
  public coverImageUrl?: string;
  public status!: "draft" | "in-progress" | "completed" | "published";
  public isPublic!: boolean;
  public wordCount?: number;
  public language!: string;
  public tags!: string;
  public publishedDate?: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CreativeWork.init(
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
    type: {
      type: DataTypes.ENUM("book", "poem", "rap", "story", "essay", "article", "script", "other"),
      allowNull: false,
      defaultValue: "other",
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "general",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    coverImageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "in-progress", "completed", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    wordCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "english",
    },
    tags: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    },
    publishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "creative_works",
    timestamps: true,
    indexes: [
      { fields: ["type"] },
      { fields: ["category"] },
      { fields: ["status"] },
      { fields: ["isPublic"] },
      { fields: ["language"] },
    ],
  }
);

export default CreativeWork;
