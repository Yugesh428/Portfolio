import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../db";

interface HeroAttributes {
  id: number;
  greeting: string;
  title: string;
  subtitle: string;
  description: string;
  profileImage: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  emailUrl: string;
  statusBadge: string;
  yearsExperience: number;
  projectsCompleted: number;
  certificationsCount: number;
  availableForWork: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface HeroCreationAttributes extends Optional<HeroAttributes, "id" | "createdAt" | "updatedAt"> {}

class Hero extends Model<HeroAttributes, HeroCreationAttributes> implements HeroAttributes {
  public id!: number;
  public greeting!: string;
  public title!: string;
  public subtitle!: string;
  public description!: string;
  public profileImage!: string;
  public resumeUrl!: string;
  public githubUrl!: string;
  public linkedinUrl!: string;
  public emailUrl!: string;
  public statusBadge!: string;
  public yearsExperience!: number;
  public projectsCompleted!: number;
  public certificationsCount!: number;
  public availableForWork!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Hero.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    greeting: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Hello I'M A",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Full Stack Developer",
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Yugesh Bastola",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Full Stack Developer from Nepal building scalable SaaS web applications using Next.js, Node.js, React, and SQL databases.",
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resumeUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "/yugesh_resume.pdf",
    },
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://github.com/Yugesh428",
    },
    linkedinUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://www.linkedin.com/in/yugesh-bastola-315638317/",
    },
    emailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "mailto:bastolayugesh2@gmail.com",
    },
    statusBadge: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Full Stack Developer · Nepal",
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    projectsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 6,
    },
    certificationsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 7,
    },
    availableForWork: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "heroes",
    timestamps: true,
  }
);

export default Hero;
