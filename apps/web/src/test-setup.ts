/**
 * The test environment runs on Node without a browser, and Node only exposes
 * `localStorage` when started with --localstorage-file. AuthService guards its
 * own access with try/catch and survives the absence, but the specs need to
 * read and clear the store directly, so an in-memory stand-in is installed
 * here when the real one is missing.
 */
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();

  const memoryStorage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => [...store.keys()][index] ?? null,
    removeItem: (key: string) => void store.delete(key),
    setItem: (key: string, value: string) => void store.set(key, String(value)),
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: memoryStorage,
    configurable: true,
  });
}
