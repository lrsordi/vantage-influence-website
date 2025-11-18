<script setup lang="ts">
import { type Content } from "@prismicio/client";
import ArrowLink from "@/assets/svg/arrow-link.svg?component";
import { gsap } from "gsap";
import NewsItem from "../../components/NewsItem.vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.NewsSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const imageEl = ref<HTMLImageElement>();
const ctx = gsap.context(() => {});
const rootEl = ref<HTMLDivElement>();
</script>

<template>
  <section
    class="slice news"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    ref="rootEl"
  >
    <div class="container">
      <div
        class="news-row"
        v-for="item in slice.items"
        :key="$prismic.asText(item.title)"
      >
        <NewsItem :item="item" :theme="slice.primary.theme" />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.news {
  padding-top: 6rem;
  margin-top: 10rem;

  .news-row {
    margin-bottom: 10rem;
  }
}
</style>
