import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db";

export type CourseCategory =
  | "web-development"
  | "database"
  | "cloud"
  | "programming"
  | "design"
  | "other";

interface CourseAttributes {
  id: number;
  title: string;               // course/cert name
  issuer: string;              // e.g. "Udemy", "Digital Pathshala"
  category: CourseCategory;
  completedDate: string;       // e.g. "Mar 2025"
  credentialUrl: string | null; // link to verify
  certificateImage: string | null;
  certificateImage2: string | null; // second certificate/recommendation letter
  description: string;
  skills: string;              // comma-separated e.g. "Next.js,Node.js"
  badgeEmoji: string;
  color: string;               // hex accent
  order: number;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CourseCreationAttributes
  extends Optional<CourseAttributes, "id" | "createdAt" | "updatedAt"> {}

class Course
  extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes
{
  public id!: number;
  public title!: string;
  public issuer!: string;
  public category!: CourseCategory;
  public completedDate!: string;
  public credentialUrl!: string | null;
  public certificateImage!: string | null;
  public certificateImage2!: string | null;
  public description!: string;
  public skills!: string;
  public badgeEmoji!: string;
  public color!: string;
  public order!: number;
  public featured!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id:               { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title:            { type: DataTypes.STRING(200), allowNull: false },
    issuer:           { type: DataTypes.STRING(200), allowNull: false },
    category:         {
      type: DataTypes.ENUM("web-development", "database", "cloud", "programming", "design", "other"),
      allowNull: false,
      defaultValue: "other",
    },
    completedDate:    { type: DataTypes.STRING(100), allowNull: false },
    credentialUrl:     { type: DataTypes.STRING(500), allowNull: true },
    certificateImage:  { type: DataTypes.TEXT, allowNull: true },
    certificateImage2: { type: DataTypes.TEXT, allowNull: true },
    description:      { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    skills:           { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    badgeEmoji:       { type: DataTypes.STRING(10), allowNull: false, defaultValue: "📜" },
    color:            { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#2563EB" },
    order:            { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    featured:         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt:        DataTypes.DATE,
    updatedAt:        DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "courses",
    timestamps: true,
  }
);

export default Course;
