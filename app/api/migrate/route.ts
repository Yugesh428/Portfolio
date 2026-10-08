export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import sequelize from "@/lib/db";

/**
 * POST /api/migrate
 * Runs database migrations to add missing columns / tables
 */
export async function POST() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Migration 1: Add certificateImage column to experiences table
    try {
      await sequelize.query(`
        ALTER TABLE experiences
        ADD COLUMN IF NOT EXISTS "certificateImage" TEXT NULL;
      `);
      console.log("✅ experiences.certificateImage");
    } catch (err: any) {
      console.log("ℹ️ experiences.certificateImage:", err.message);
    }

    // Migration 2: Create achievements table
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
      console.log("✅ achievements table created");
    } catch (err: any) {
      console.log("ℹ️ achievements table:", err.message);
    }

    // Migration 3: Create courses table
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
      console.log("✅ courses table created");
    } catch (err: any) {
      console.log("ℹ️ courses table:", err.message);
    }

    // Migration 4: Add certificateImage2 to courses table
    try {
      await sequelize.query(`
        ALTER TABLE courses
        ADD COLUMN IF NOT EXISTS "certificateImage2" TEXT NULL;
      `);
      console.log("✅ courses.certificateImage2");
    } catch (err: any) {
      console.log("ℹ️ courses.certificateImage2:", err.message);
    }

    // Migration 5: Create skills table
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
      console.log("✅ skills table created");
    } catch (err: any) {
      console.log("ℹ️ skills table:", err.message);
    }

    // Migration 6: Create portfolio_projects table
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
      console.log("✅ portfolio_projects table created");
    } catch (err: any) {
      console.log("ℹ️ portfolio_projects table:", err.message);
    }

    // Migration 7: (legacy) Add portfolio columns to old projects table — safe no-op if already done
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
      try { await sequelize.query(sql); } catch {}
    }
    console.log("✅ projects legacy columns ensured");

    return NextResponse.json({
      success: true,
      message: "Database migrations completed successfully",
      migrations: [
        "experiences.certificateImage (TEXT NULL)",
        "achievements table (CREATE IF NOT EXISTS)",
        "courses table (CREATE IF NOT EXISTS)",
        "courses.certificateImage2 (TEXT NULL)",
        "skills table (CREATE IF NOT EXISTS)",
        "projects table (CREATE IF NOT EXISTS)",
        "projects portfolio columns (ADD IF NOT EXISTS)",
      ],
    });
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    return NextResponse.json(
      { success: false, error: "Migration failed", message: error.message },
      { status: 500 }
    );
  }
}
