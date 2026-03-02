import { defineConfig } from "vitepress";

// Auto-generated sidebar for the /reference/ section
import sidebarReference from "./sidebar-reference.json";

export default defineConfig({
  title: "Rakexl",
  description:
    "An opinionated extended grammar for JEXL with 80+ built-in functions",
  cleanUrls: true,

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: "Guide", link: "/introduction" },
      { text: "Language", link: "/language/" },
      { text: "Reference", link: "/reference/" },
      { text: "Usage", link: "/usage/" },
      {
        text: "Playground",
        link: "https://jexl-playground.konnektr.io/",
        target: "_blank",
      },
    ],

    sidebar: {
      "/language/": [
        {
          text: "Language Guide",
          items: [
            { text: "Overview", link: "/language/" },
            { text: "Syntax", link: "/language/syntax" },
            { text: "Data Types", link: "/language/data-types" },
            { text: "Operators", link: "/language/operators" },
            { text: "Expressions", link: "/language/expressions" },
            { text: "Context & Variables", link: "/language/context" },
          ],
        },
      ],

      "/usage/": [
        {
          text: "Usage Guides",
          items: [
            { text: "Overview", link: "/usage/" },
            { text: "Getting Started", link: "/usage/getting-started" },
            { text: "JavaScript", link: "/usage/javascript" },
            { text: "Monaco Integration", link: "/usage/monaco-integration" },
            { text: "Advanced Usage", link: "/usage/advanced-usage" },
          ],
        },
      ],

      "/reference/": sidebarReference,

      "/": [
        {
          text: "Getting Started",
          items: [
            { text: "Introduction", link: "/introduction" },
            { text: "Playground", link: "/playground" },
          ],
        },
        {
          text: "Learn More",
          items: [
            { text: "Language Guide", link: "/language/" },
            { text: "Function Reference", link: "/reference/" },
            { text: "Usage Guides", link: "/usage/" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/cloudraker/rakexl" },
    ],

    editLink: {
      pattern: "https://github.com/cloudraker/rakexl/edit/main/docs/:path",
    },

    search: {
      provider: "local",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © Rakexl Contributors",
    },
  },
});
