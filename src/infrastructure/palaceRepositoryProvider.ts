import type { PalaceRepository } from "../domain/repositories/palaceRepository";
import { createPalaceRepositoryTauri } from "./tauri/palaceRepositoryTauri";
import { createInMemoryPalaceRepository } from "./memory/inMemoryPalaceRepository";

export function getPalaceRepository(): PalaceRepository {
  const hasTauri = typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  return hasTauri ? createPalaceRepositoryTauri() : createInMemoryPalaceRepository();
}
