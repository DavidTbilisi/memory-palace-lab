import type { PalaceRepository } from "../domain/repositories/palaceRepository";
import { createPalaceRepositoryTauri } from "./tauri/palaceRepositoryTauri";
import { createInMemoryPalaceRepository } from "./memory/inMemoryPalaceRepository";

let repository: PalaceRepository | null = null;

export function getPalaceRepository(): PalaceRepository {
  if (repository) return repository;

  const hasTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  repository = hasTauri ? createPalaceRepositoryTauri() : createInMemoryPalaceRepository();
  return repository;
}
