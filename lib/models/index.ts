import sequelize from "../db";
import User from "./User";
import Project from "./Project";
import Message from "./Message";
import Notification from "./Notification";
import ContactMessage from "./ContactMessage";
import Hero from "../features/hero/heroModel";
import Experience from "../features/experience/experienceModel";
import Achievement from "../features/achievement/achievementModel";
import Course from "../features/course/courseModel";
import Skill from "../features/skill/skillModel";
import ProjectPortfolio from "../features/project/projectModel";
// importing redis here ensures the singleton is created (and connects) on first module load
import "../redis";

// ── Associations ──────────────────────────────────────────────
// User ↔ Projects (one admin/client has many projects)
User.hasMany(Project, { foreignKey: "clientId", as: "projects" });
Project.belongsTo(User, { foreignKey: "clientId", as: "client" });

// User ↔ Messages (sent / received)
User.hasMany(Message, { foreignKey: "senderId",   as: "sentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "receivedMessages" });
Message.belongsTo(User, { foreignKey: "senderId",   as: "sender" });
Message.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

// Project ↔ Messages (optional thread)
Project.hasMany(Message, { foreignKey: "projectId", as: "messages" });
Message.belongsTo(Project, { foreignKey: "projectId", as: "project" });

// User ↔ Notifications
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// ── Sync helper ────────────────────────────────────────────────
// We do NOT call sequelize.sync() on every request — it checks all
// table schemas which is very slow on Neon. Tables are managed via
// migrations (/api/migrate). This just authenticates the connection.
let connected = false;
export async function syncDB(): Promise<void> {
  if (connected) return;
  try {
    await sequelize.authenticate();
    connected = true;
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

export { sequelize, User, Project, Message, Notification, ContactMessage, Hero, Experience, Achievement, Course, Skill, ProjectPortfolio };
