import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db";

export type ExperienceType = "work" | "internship" | "freelance" | "volunteer";

interface ExperienceAttributes {
  id: number;
  title: string;
  company: string;
  location: string;
  type: ExperienceType;
  startDate: string;       // e.g. "Jan 2024"
  endDate: string;         // e.g. "Present" or "Dec 2024"
  isCurrent: boolean;
  description: string;     // short summary shown on card
  points: string;          // JSON array string of bullet points
  techStack: string;       // comma-separated e.g. "Next.js,Node.js"
  companyLogo: string | null;
  companyUrl: string | null;
  certificateImage: string | null; // uploaded certificate/proof
  order: number;           // sort order for display
  featured: boolean;       // show on homepage (max 4)
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExperienceCreationAttributes
  extends Optional<ExperienceAttributes, "id" | "createdAt" | "updatedAt"> {}

class Experience
  extends Model<ExperienceAttributes, ExperienceCreationAttributes>
  implements ExperienceAttributes
{
  public id!: number;
  public title!: string;
  public company!: string;
  public location!: string;
  public type!: ExperienceType;
  public startDate!: string;
  public endDate!: string;
  public isCurrent!: boolean;
  public description!: string;
  public points!: string;
  public techStack!: string;
  public companyLogo!: string | null;
  public companyUrl!: string | null;
  public certificateImage!: string | null;
  public order!: number;
  public featured!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Experience.init(
  {
    id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title:       { type: DataTypes.STRING(200), allowNull: false },
    company:     { type: DataTypes.STRING(200), allowNull: false },
    location:    { type: DataTypes.STRING(200), allowNull: false, defaultValue: "Kathmandu, Nepal" },
    type:        { type: DataTypes.ENUM("work", "internship", "freelance", "volunteer"), allowNull: false, defaultValue: "work" },
    startDate:   { type: DataTypes.STRING(50), allowNull: false },
    endDate:     { type: DataTypes.STRING(50), allowNull: false, defaultValue: "Present" },
    isCurrent:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    points:      { type: DataTypes.TEXT, allowNull: false, defaultValue: "[]" }, // stored as JSON string
    techStack:   { type: DataTypes.STRING(500), allowNull: false, defaultValue: "" },
    companyLogo: { type: DataTypes.TEXT, allowNull: true },
    companyUrl:  { type: DataTypes.STRING(500), allowNull: true },
    certificateImage: { type: DataTypes.TEXT, allowNull: true },
    order:       { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    featured:    { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt:   DataTypes.DATE,
    updatedAt:   DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "experiences",
    timestamps: true,
  }
);

export default Experience;
