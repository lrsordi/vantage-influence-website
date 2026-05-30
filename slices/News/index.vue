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
  ]),
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
      <h2
        v-if="slice.primary.master_section_title"
        class="master-section-title"
      >
        {{ slice.primary.master_section_title }}
      </h2>

      <h2 v-if="slice.primary.section_title" class="section-title">
        {{ slice.primary.section_title }}
      </h2>
      <div
        class="news-row"
        v-for="item in slice.items"
        :key="$prismic.asText(item.title)"
      >
        <NewsItem :item="item" :theme="slice.primary.theme" />
      </div>

      <div class="news-border-bottom" v-if="slice.primary.bottom_line">
        <div class="horizontal-line top red"></div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.news {
  padding-top: 6rem;
  margin-top: 10rem;

  .master-section-title {
    @include slice-title;
    margin-top: 0;
    margin-bottom: 8rem;
    text-align: center;
  }

  .section-title {
    font-family: $secondary-font;
    font-size: 1.2rem;
    font-weight: 500;
    color: $red;
    margin-bottom: 4rem;
    margin-top: 2rem;
    text-transform: uppercase;
  }

  .news-row {
    margin-bottom: 10rem;
  }

  .news-border-bottom {
    position: relative;
  }
}
</style>
