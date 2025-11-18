import { defineStore } from "pinia";
import type { PageDocumentData, LayoutDocumentData } from "~/prismicio-types";

export const usePageStore = defineStore("page", {
  state: () => ({
    pageData: {} as PageDocumentData,
    layoutData: {} as LayoutDocumentData,
    scroll: {
      pause: false,
    },
  }),
  actions: {
    setLayoutData(data: LayoutDocumentData) {
      this.layoutData = data;
    },
    setPageData(data: PageDocumentData) {
      this.pageData = data;
    },
    pauseScroll(value: boolean) {
      this.scroll.pause = value;
    },
  },
});
