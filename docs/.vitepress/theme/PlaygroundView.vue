<script setup lang="ts">
import { ref, watch } from "vue";
import { examples } from "./playground-examples";

const expressionValue = ref(examples[0].expression);
const contextValue = ref(examples[0].context);
const result = ref("");
const error = ref("");

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function evaluate() {
  error.value = "";
  result.value = "";

  let ctx: unknown;
  try {
    ctx = JSON.parse(contextValue.value);
  } catch (e: any) {
    error.value = `Invalid JSON context: ${e.message}`;
    return;
  }

  import("@cloudraker/rakexl")
    .then((mod) => {
      const jexl = mod.default;
      return jexl.eval(expressionValue.value, ctx);
    })
    .then((res) => {
      result.value =
        typeof res === "string" ? res : JSON.stringify(res, null, 2);
    })
    .catch((e: any) => {
      error.value = e.message ?? String(e);
    });
}

watch([expressionValue, contextValue], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(evaluate, 500);
});

// Run initial evaluation
if (typeof window !== "undefined") {
  setTimeout(evaluate, 100);
}

function loadExample(ex: (typeof examples)[number]) {
  expressionValue.value = ex.expression;
  contextValue.value = ex.context;
}
</script>

<template>
  <div class="playground">
    <div class="playground-header">
      <h1>Interactive Playground</h1>
      <p>Write JEXL expressions and evaluate them in real-time.</p>
    </div>

    <div class="examples-bar">
      <span class="examples-label">Examples:</span>
      <button
        v-for="ex in examples"
        :key="ex.title"
        class="example-btn"
        @click="loadExample(ex)"
      >
        {{ ex.title }}
      </button>
    </div>

    <div class="editors-grid">
      <div class="editor-panel expression-panel">
        <div class="panel-label">JEXL Expression</div>
        <ClientOnly>
          <MonacoEditor
            language="jexl"
            :value="expressionValue"
            @update:value="expressionValue = $event"
          />
        </ClientOnly>
      </div>
      <div class="editor-panel context-panel">
        <div class="panel-label">JSON Context</div>
        <ClientOnly>
          <MonacoEditor
            language="json"
            :value="contextValue"
            @update:value="contextValue = $event"
          />
        </ClientOnly>
      </div>
    </div>

    <div class="output-panel">
      <div class="panel-label">Result</div>
      <pre v-if="error" class="output-error">{{ error }}</pre>
      <pre v-else class="output-result">{{ result || "…" }}</pre>
    </div>
  </div>
</template>

<style scoped>
.playground {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.playground-header {
  margin-bottom: 16px;
}

.playground-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px;
}

.playground-header p {
  color: var(--vp-c-text-2);
  margin: 0;
}

.examples-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.examples-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.example-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.example-btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.editors-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 12px;
  margin-bottom: 12px;
}

.editor-panel {
  display: flex;
  flex-direction: column;
  height: 260px;
}

.panel-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 6px;
}

.output-panel {
  min-height: 120px;
}

.output-result,
.output-error {
  margin: 0;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  max-height: 300px;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-result {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.output-error {
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  border: 1px solid var(--vp-c-danger-2);
}

@media (max-width: 640px) {
  .editors-grid {
    grid-template-columns: 1fr;
  }
}
</style>
