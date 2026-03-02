import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import PlaygroundView from "./PlaygroundView.vue";
import MonacoEditor from "./MonacoEditor.vue";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("PlaygroundView", PlaygroundView);
    app.component("MonacoEditor", MonacoEditor);
  },
} satisfies Theme;
