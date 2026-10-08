import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db";

export type SkillCategory = "frontend" | "backend" | "database" | "devops" | "design" | "other";

interface SkillAttributes {
  id: number;
  name: string;              // e.g. "React", "Node.js"
  category: SkillCategory;
  logo: string | null;       // logo image URL
  proficiency: number;       // 1-100
  yearsOfExperience: number; // e.g. 3
  color: string;             // hex accent
  order: number;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SkillCreationAttributes
  extends Optional<SkillAttributes, "id" | "createdAt" | "updatedAt"> {}

class Skill
  extends Model<SkillAttributes, SkillCreationAttributes>
  implements SkillAttributes
{
  public id!: number;
  public name!: string;
  public category!: SkillCategory;
  public logo!: string | null;
  public proficiency!: number;
  public yearsOfExperience!: number;
  public color!: string;
  public order!: number;
  public featured!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Skill.init(
  {
    id:                { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name:              { type: DataTypes.STRING(100), allowNull: false },
    category:          {
      type: DataTypes.ENUM("frontend", "backend", "database", "devops", "design", "other"),
      allowNull: false,
      defaultValue: "other",
    },
    logo:              { type: DataTypes.TEXT, allowNull: true },
    proficiency:       { type: DataTypes.INTEGER, allowNull: false, defaultValue: 50 },
    yearsOfExperience: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    color:             { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#2563EB" },
    order:             { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    featured:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    createdAt:         DataTypes.DATE,
    updatedAt:         DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "skills",
    timestamps: true,
  }
);

export default Skill;
