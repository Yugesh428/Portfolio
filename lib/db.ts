import { Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    // Keep connection alive — prevents Neon cold starts mid-session
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  },
  logging: false,
  pool: {
    max: 3,       // Neon free tier supports limited connections
    min: 1,       // keep at least 1 alive to avoid cold starts
    acquire: 20000,
    idle: 30000,  // keep idle connections longer (reduces cold starts)
    evict: 60000, // evict stale connections after 60s
  },
});

export default sequelize;
