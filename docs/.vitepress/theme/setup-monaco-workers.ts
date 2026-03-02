let initialized = false;

export function setupMonacoWorkers() {
  if (initialized) return;
  initialized = true;

  // @ts-expect-error -- Vite-specific ?worker import
  self.MonacoEnvironment = {
    getWorker(_workerId: string, label: string) {
      if (label === "json") {
        return new Worker(
          new URL("monaco-editor/esm/vs/language/json/json.worker.js", import.meta.url),
          { type: "module" },
        );
      }
      return new Worker(
        new URL("monaco-editor/esm/vs/editor/editor.worker.js", import.meta.url),
        { type: "module" },
      );
    },
  };
}
