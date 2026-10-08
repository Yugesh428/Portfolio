import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db";

export type AchievementType =
  | "hackathon"
  | "internship"
  | "certification"
  | "award"
  | "volunteer";

interface AchievementAttributes {
  id: number;
  title: string;
  organization: string;       // e.g. "SUMS Nepal × COGKNIT"
  date: string;                // e.g. "May 2026"
  type: AchievementType;
  description: string;
  certificateImage: string | null;  // uploaded proof/certificate
  badgeEmoji: string;          // e.g. "🏆" shown as icon
  color: string;               // hex accent e.g. "#F59E0B"
  order: number;
  featured: boolean;           // show on homepage
  createdAt?: Date;
  updatedAt?: Date;
}

interface AchievementCreationAttributes
  extends Optional<AchievementAttributes, "id" | "createdAt" | "updatedAt"> {}

class Achievement
  extends Model<AchievementAttributes, AchievementCreationAttributes>
  implements AchievementAttributes
{
  public id!: number;
  public title!: string;
  public organization!: string;
  public date!: string;
  public type!: AchievementType;
  public description!: string;
  public certificateImage!: string | null;
  public badgeEmoji!: string;
  public color!: string;
  public order!: number;
  public featured!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Achievement.init(
  {
    id:               { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title:            { type: DataTypes.STRING(200), allowNull: false },
    organization:     { type: DataTypes.STRING(200), allowNull: false },
    date:             { type: DataTypes.STRING(100), allowNull: false },
    type:             {
      type: DataTypes.ENUM("hackathon", "internship", "certification", "award", "volunteer"),
      allowNull: false,
      defaultValue: "award",
    },
    description:      { type: DataTypes.TEXT, allowNull: false },
    certificateImage: { type: DataTypes.TEXT, allowNull: true },
    badgeEmoji:       { type: DataTypes.STRING(10), allowNull: false, defaultValue: "🏆" },
    color:            { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#2563EB" },
    order:            { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    featured:         { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt:        DataTypes.DATE,
    updatedAt:        DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "achievements",
    timestamps: true,
  }
);

export default Achievement;
