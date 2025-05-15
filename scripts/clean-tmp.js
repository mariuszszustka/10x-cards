/**
 * Skrypt do czyszczenia plików tymczasowych generowanych podczas testów
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Pobranie ścieżki aktualnego pliku
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const dirsToClean = [
  path.join(rootDir, "tmp", "test-screenshots"),
  path.join(rootDir, "tmp", "test-videos"),
  path.join(rootDir, "tmp", "test-results"),
  path.join(rootDir, "test-artifacts"),
  path.join(rootDir, "test-results"),
];

// Sprawdzenie czy istnieje katalog i usunięcie jego zawartości
function cleanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Katalog ${dirPath} nie istnieje, pomijam.`);
    return;
  }

  console.log(`Czyszczenie zawartości katalogu ${dirPath}...`);

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);

    try {
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        // Rekurencyjnie wyczyść podkatalog
        cleanDirectory(filePath);
        // Usuń pusty katalog
        fs.rmdirSync(filePath);
      } else {
        // Usuń plik
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(`Błąd podczas czyszczenia ${filePath}:`, err);
    }
  }
}

// Główna funkcja
function main() {
  console.log("Rozpoczynam czyszczenie plików tymczasowych...");

  for (const dir of dirsToClean) {
    cleanDirectory(dir);
  }

  console.log("Czyszczenie zakończone!");
}

main();
