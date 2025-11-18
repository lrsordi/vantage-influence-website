<template>
  <SliceZone
    wrapper="main"
    :slices="page?.data.slices ?? []"
    :components="components"
  />
  <Footer />
</template>

<script setup lang="ts">
import { components } from "~/slices";
import { usePageStore } from "../stores/page";

const prismic = usePrismic();
const route = useRoute();
const pageStore = usePageStore();

const { data: page } = await useAsyncData(route.params.uid as string, () =>
  prismic.client.getByUID(
    "page",
    (route.params.uid as string) || ("home" as string)
  )
);

if (page.value) {
  pageStore.setPageData(page.value?.data);

  useHead({
    title: computed(() => page.value!.data.meta_title),
    meta: computed(() => [
      {
        hid: "description",
        name: "description",
        content: page.value?.data.meta_description,
      },
    ]),
  });
}
</script>
