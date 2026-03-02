<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from "vue";

const props = withDefaults(
  defineProps<{
    language?: string;
    value?: string;
    options?: Record<string, unknown>;
  }>(),
  {
    language: "json",
    value: "",
    options: () => ({}),
  },
);

const emit = defineEmits<{
  "update:value": [value: string];
}>();

const containerRef = ref<HTMLElement>();
const editorRef = shallowRef<any>(null);
let ignoreChange = false;

onMounted(async () => {
  const { setupMonacoWorkers } = await import("./setup-monaco-workers");
  setupMonacoWorkers();

  const monaco = await import("monaco-editor");

  if (props.language === "jexl") {
    const { registerJexlLanguage } = await import(
      "@cloudraker/rakexl/monaco/register-language"
    );
    registerJexlLanguage(monaco);
  }

  const editor = monaco.editor.create(containerRef.value!, {
    value: props.value,
    language: props.language,
    theme: "vs-dark",
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: "on",
    folding: true,
    tabSize: 2,
    padding: { top: 8 },
    ...props.options,
  });

  editor.onDidChangeModelContent(() => {
    if (ignoreChange) return;
    emit("update:value", editor.getValue());
  });

  editorRef.value = editor;
});

watch(
  () => props.value,
  (newVal) => {
    const editor = editorRef.value;
    if (!editor) return;
    if (editor.getValue() === newVal) return;
    ignoreChange = true;
    editor.setValue(newVal ?? "");
    ignoreChange = false;
  },
);

onBeforeUnmount(() => {
  editorRef.value?.dispose();
});
</script>

<template>
  <div ref="containerRef" class="monaco-editor-container" />
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}
</style>
