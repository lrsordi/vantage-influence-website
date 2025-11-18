// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from "vite-svg-loader";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/prismic", "@pinia/nuxt", "@vueuse/nuxt"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./assets/styles/util.scss";',
        },
      },
    },
    plugins: [svgLoader({})],
  },

  prismic: {
    endpoint: "vantage-influence",
    clientConfig: {
      routes: [
        {
          type: "page",
          path: "/:uid",
        },
      ],
    },
  },

  build: { transpile: ["vue-toastification"] },

  app: {
    head: {
      bodyAttrs: {
        style: "opacity: 0",
      },
    },
  },
});
