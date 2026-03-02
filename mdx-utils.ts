#!/usr/bin/env tsx

import fs from "fs";
import path from "path";

/**
 * Utility script to manage MD documentation
 */

const DOCS_DIR = "./docs/reference";

function cleanDocs(): void {
  console.log("🧹 Cleaning MD documentation...");

  if (fs.existsSync(DOCS_DIR)) {
    fs.rmSync(DOCS_DIR, { recursive: true });
    console.log("✅ Cleaned existing documentation");
  }
}

function validateDocs(): boolean {
  console.log("🔍 Validating MD documentation...");

  if (!fs.existsSync(DOCS_DIR)) {
    console.error("❌ docs directory not found. Run: npm run docs:md");
    return false;
  }

  const indexPath = path.join(DOCS_DIR, "index.md");
  if (!fs.existsSync(indexPath)) {
    console.error("❌ index.md not found");
    return false;
  }

  // Count categories and files
  const entries = fs.readdirSync(DOCS_DIR, { withFileTypes: true });
  const categories = entries.filter((entry) => entry.isDirectory()).length;

  let totalFiles = 0;
  entries
    .filter((entry) => entry.isDirectory())
    .forEach((dir) => {
      const categoryPath = path.join(DOCS_DIR, dir.name);
      const files = fs
        .readdirSync(categoryPath)
        .filter((f) => f.endsWith(".md"));
      totalFiles += files.length;
    });

  console.log(`✅ Validation passed:`);
  console.log(`   - ${categories} categories found`);
  console.log(`   - ${totalFiles} MD files found`);

  return true;
}

function listStats(): void {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error("❌ docs directory not found. Run: npm run docs:md");
    return;
  }

  console.log("📊 MD Documentation Statistics:");

  const entries = fs.readdirSync(DOCS_DIR, { withFileTypes: true });
  const categories = entries.filter((entry) => entry.isDirectory());

  categories.forEach((category) => {
    const categoryPath = path.join(DOCS_DIR, category.name);
    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".md") && f !== "index.md");
    console.log(`   ${category.name}: ${files.length} functions`);
  });

  const totalFiles = categories.reduce((total, category) => {
    const categoryPath = path.join(DOCS_DIR, category.name);
    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".md") && f !== "index.md");
    return total + files.length;
  }, 0);

  console.log(`\n📈 Total: ${totalFiles} function documentation pages`);
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case "clean":
    cleanDocs();
    break;
  case "validate":
    process.exit(validateDocs() ? 0 : 1);
  case "stats":
    listStats();
    break;
  default:
    console.log("Usage: tsx mdx-utils.ts <command>");
    console.log("Commands:");
    console.log("  clean     - Remove all generated MD files");
    console.log("  validate  - Validate generated documentation");
    console.log("  stats     - Show documentation statistics");
    process.exit(1);
}
