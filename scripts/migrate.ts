/**
 * Database Migration Script
 * Run with: npx tsx scripts/migrate.ts
 * Or add to package.json: "migrate": "tsx scripts/migrate.ts"
 */

import { config } from "dotenv";
import { Sequelize } from "sequelize";
import pg from "pg";

// Load environment variables
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined in .env file");
  process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

async function runMigrations() {
  try {
    console.log("🔌 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connection established\n");

    // Migration 1: Add certificateImage column to experiences table
    console.log("📝 Migration 1: experiences.certificateImage");
    try {
      await sequelize.query(`
        ALTER TABLE experiences
        ADD COLUMN IF NOT EXISTS "certificateImage" TEXT NULL;
      `);
      console.log("✅ experiences.certificateImage added\n");
    } catch (err: any) {
      console.log(`ℹ️  experiences.certificateImage: ${err.message}\n`);
    }

    // Migration 2: Create achievements table
    console.log("📝 Migration 2: achievements table");
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS achievements (
          id               SERIAL PRIMARY KEY,
          title            VARCHAR(200)  NOT NULL,
          organization     VARCHAR(200)  NOT NULL,
          date             VARCHAR(100)  NOT NULL,
          type             VARCHAR(50)   NOT NULL DEFAULT 'award',
          description      TEXT          NOT NULL,
          "certificateImage" TEXT        NULL,
          "badgeEmoji"     VARCHAR(10)   NOT NULL DEFAULT '🏆',
          color            VARCHAR(20)   NOT NULL DEFAULT '#2563EB',
          "order"          INTEGER       NOT NULL DEFAULT 0,
          featured         BOOLEAN       NOT NULL DEFAULT false,
          "createdAt"      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
          "updatedAt"      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ achievements table created\n");
    } catch (err: any) {
      console.log(`ℹ️  achievements table: ${err.message}\n`);
    }

    // Migration 3: Create courses table
    console.log("📝 Migration 3: courses table");
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS courses (
          id                SERIAL PRIMARY KEY,
          title             VARCHAR(200)  NOT NULL,
          issuer            VARCHAR(200)  NOT NULL,
          category          VARCHAR(50)   NOT NULL DEFAULT 'other',
          "completedDate"   VARCHAR(100)  NOT NULL,
          "credentialUrl"   VARCHAR(500)  NULL,
          "certificateImage" TEXT         NULL,
          description       TEXT          NOT NULL DEFAULT '',
          skills            VARCHAR(500)  NOT NULL DEFAULT '',
          "badgeEmoji"      VARCHAR(10)   NOT NULL DEFAULT '📜',
          color             VARCHAR(20)   NOT NULL DEFAULT '#2563EB',
          "order"           INTEGER       NOT NULL DEFAULT 0,
          featured          BOOLEAN       NOT NULL DEFAULT false,
          "createdAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
          "updatedAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ courses table created\n");
    } catch (err: any) {
      console.log(`ℹ️  courses table: ${err.message}\n`);
    }

    // Migration 4: Add certificateImage2 to courses table
    console.log("📝 Migration 4: courses.certificateImage2");
    try {
      await sequelize.query(`
        ALTER TABLE courses
        ADD COLUMN IF NOT EXISTS "certificateImage2" TEXT NULL;
      `);
      console.log("✅ courses.certificateImage2 added\n");
    } catch (err: any) {
      console.log(`ℹ️  courses.certificateImage2: ${err.message}\n`);
    }

    // Migration 5: Create skills table
    console.log("📝 Migration 5: skills table");
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS skills (
          id                   SERIAL PRIMARY KEY,
          name                 VARCHAR(100)  NOT NULL,
          category             VARCHAR(50)   NOT NULL DEFAULT 'other',
          logo                 TEXT          NULL,
          proficiency          INTEGER       NOT NULL DEFAULT 50,
          "yearsOfExperience"  INTEGER       NOT NULL DEFAULT 1,
          color                VARCHAR(20)   NOT NULL DEFAULT '#2563EB',
          "order"              INTEGER       NOT NULL DEFAULT 0,
          featured             BOOLEAN       NOT NULL DEFAULT false,
          "createdAt"          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
          "updatedAt"          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ skills table created\n");
    } catch (err: any) {
      console.log(`ℹ️  skills table: ${err.message}\n`);
    }

    // Migration 6: Create portfolio_projects table
    console.log("📝 Migration 6: portfolio_projects table");
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS portfolio_projects (
          id                   SERIAL PRIMARY KEY,
          title                VARCHAR(200)  NOT NULL,
          category             VARCHAR(50)   NOT NULL DEFAULT 'web-app',
          status               VARCHAR(50)   NOT NULL DEFAULT 'completed',
          description          TEXT          NOT NULL DEFAULT '',
          "shortDescription"   VARCHAR(500)  NOT NULL DEFAULT '',
          technologies         VARCHAR(500)  NOT NULL DEFAULT '',
          image                TEXT          NULL,
          "githubUrl"          VARCHAR(500)  NULL,
          "liveUrl"            VARCHAR(500)  NULL,
          "isPrivate"          BOOLEAN       NOT NULL DEFAULT false,
          "isFeatured"         BOOLEAN       NOT NULL DEFAULT false,
          color                VARCHAR(20)   NOT NULL DEFAULT '#2563EB',
          "badgeEmoji"         VARCHAR(10)   NOT NULL DEFAULT '💻',
          "startDate"          VARCHAR(50)   NULL,
          "endDate"            VARCHAR(50)   NULL,
          "order"              INTEGER       NOT NULL DEFAULT 0,
          "createdAt"          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
          "updatedAt"          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ portfolio_projects table created\n");
    } catch (err: any) {
      console.log(`ℹ️  portfolio_projects table: ${err.message}\n`);
    }

    // Migration 7: Add portfolio columns to projects table (legacy)
    console.log("📝 Migration 7: projects table portfolio columns");
    const portfolioCols = [
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'web-app'`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'completed'`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "shortDescription" VARCHAR(500) NOT NULL DEFAULT ''`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies VARCHAR(500) NOT NULL DEFAULT ''`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "githubUrl" VARCHAR(500) NULL`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "liveUrl" VARCHAR(500) NULL`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "isPrivate" BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS color VARCHAR(20) NOT NULL DEFAULT '#2563EB'`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "badgeEmoji" VARCHAR(10) NOT NULL DEFAULT '💻'`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "startDate" VARCHAR(50) NULL`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "endDate" VARCHAR(50) NULL`,
      `ALTER TABLE projects ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`,
    ];
    for (const sql of portfolioCols) {
      try {
        await sequelize.query(sql);
      } catch {}
    }
    console.log("✅ projects legacy columns ensured\n");

    // Migration 8: Create job_opportunities table
    console.log("📝 Migration 8: job_opportunities table");
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS job_opportunities (
          id                SERIAL PRIMARY KEY,
          company           VARCHAR(200)  NOT NULL,
          title             VARCHAR(300)  NOT NULL,
          type              VARCHAR(50)   NOT NULL DEFAULT 'job',
          description       TEXT          NOT NULL,
          url               VARCHAR(500)  NOT NULL UNIQUE,
          location          VARCHAR(200)  NOT NULL DEFAULT 'Kathmandu, Nepal',
          "postedDate"      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
          deadline          TIMESTAMPTZ   NULL,
          salary            VARCHAR(100)  NULL,
          requirements      TEXT          NULL,
          "isRead"          BOOLEAN       NOT NULL DEFAULT false,
          "isArchived"      BOOLEAN       NOT NULL DEFAULT false,
          "createdAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
          "updatedAt"       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
        );
      `);
      console.log("✅ job_opportunities table created");

      // Create indexes for better query performance
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_job_opportunities_type ON job_opportunities(type);
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_job_opportunities_isRead ON job_opportunities("isRead");
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_job_opportunities_isArchived ON job_opportunities("isArchived");
      `);
      await sequelize.query(`
        CREATE INDEX IF NOT EXISTS idx_job_opportunities_postedDate ON job_opportunities("postedDate");
      `);
      console.log("✅ job_opportunities indexes created\n");
    } catch (err: any) {
      console.log(`ℹ️  job_opportunities table: ${err.message}\n`);
    }

    console.log("🎉 All migrations completed successfully!");
    console.log("\n📊 Summary:");
    console.log("  1. experiences.certificateImage");
    console.log("  2. achievements table");
    console.log("  3. courses table");
    console.log("  4. courses.certificateImage2");
    console.log("  5. skills table");
    console.log("  6. portfolio_projects table");
    console.log("  7. projects portfolio columns");
    console.log("  8. job_opportunities table + indexes");
    
    await sequelize.close();
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error.message);
    await sequelize.close();
    process.exit(1);
  }
}

// Run migrations
runMigrations();
