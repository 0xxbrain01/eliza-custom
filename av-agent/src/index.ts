import {settings,
      IDatabaseAdapter,
    IDatabaseCacheAdapter} from '@elizaos/core';
import path from "path";
import { fileURLToPath } from "url";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const startAgent = async () => {
    console.log("=== starting agents ===");
    const serverPort = parseInt(settings.SERVER_PORT || "3000");

    //init database
    let db: IDatabaseAdapter & IDatabaseCacheAdapter;
    const dataDir = path.join(__dirname, "../data");
    console.log("🚀 ~ startAgent ~ dataDir:", dataDir)

    db = initializeDatabase(dataDir);
    await db.init();
}

function initializeDatabase(dataDir: string) {
  // save database on
  const filePath = path.join(dataDir, "db.sqlite");
  const db = new SqliteDatabaseAdapter(new Database(filePath));
  return db;
}


async function main() {
    console.log("Hello World");
    startAgent();
}

main();