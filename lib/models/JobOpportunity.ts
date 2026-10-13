import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface JobOpportunityAttributes {
  id: number;
  company: string;
  title: string;
  type: "internship" | "bootcamp" | "job" | "cohort" | "other";
  description: string;
  url: string;
  location: string;
  postedDate: Date;
  deadline?: Date;
  salary?: string;
  requirements?: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface JobOpportunityCreationAttributes
  extends Optional<JobOpportunityAttributes, "id" | "deadline" | "salary" | "requirements" | "isRead" | "isArchived"> {}

class JobOpportunity
  extends Model<JobOpportunityAttributes, JobOpportunityCreationAttributes>
  implements JobOpportunityAttributes
{
  public id!: number;
  public company!: string;
  public title!: string;
  public type!: "internship" | "bootcamp" | "job" | "cohort" | "other";
  public description!: string;
  public url!: string;
  public location!: string;
  public postedDate!: Date;
  public deadline?: Date;
  public salary?: string;
  public requirements?: string;
  public isRead!: boolean;
  public isArchived!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

JobOpportunity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("internship", "bootcamp", "job", "cohort", "other"),
      allowNull: false,
      defaultValue: "job",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Prevent duplicate entries
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Kathmandu, Nepal",
    },
    postedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "job_opportunities",
    timestamps: true,
    indexes: [
      { fields: ["company"] },
      { fields: ["type"] },
      { fields: ["isRead"] },
      { fields: ["isArchived"] },
      { fields: ["postedDate"] },
    ],
  }
);

export default JobOpportunity;
