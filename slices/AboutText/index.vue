<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.AboutTextSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
</script>

<template>
  <section
    class="slice about-text tt"
    :class="{
      [slice.primary.theme]: true,
      [`bgtype-${slice.primary.background}`]: true,
    }"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="row">
        <div
          class="offset-md-1 col-md-2"
          :class="slice.primary.image_title?.url ? 'col-lg-3' : 'col-lg-2'"
        >
          <div v-if="slice.primary.image_title?.url" class="image-title">
            <img :src="slice.primary.image_title?.url" />
          </div>
          <h2 v-else class="title">{{ slice.primary.title }}</h2>
        </div>
        <div class="col-md-7" style="position: relative">
          <div class="vertical-line left" :class="slice.primary.theme"></div>
          <div class="text-container">
            <div
              class="text rich-text"
              :class="slice.primary.theme"
              v-for="item in slice.items"
              :key="item.paragraph"
            >
              <PrismicRichText :field="item.paragraph" />
              <div class="rectangle" :class="slice.primary.theme"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.about-text {
  padding-top: 8rem;
  $padding-top: 11rem;

  .title {
    padding-top: $padding-top;
    font-family: $primary-font;
    font-size: 2.5rem;
    font-weight: 300;
    line-height: 1.5;
    padding-left: 5rem;

    @include media-breakpoint-up(md) {
      max-width: 14rem;
      padding-left: 0;
    }
  }

  .image-title {
    padding-top: $padding-top;
    padding-right: 3rem;
    display: flex;
    justify-content: center;

    img {
      width: 25rem;

      @include media-breakpoint-up(md) {
        width: 100%;
        max-width: 24rem;
      }
    }
  }

  .vertical-line {
    left: 1rem;

    @include media-breakpoint-up(md) {
      left: 0;
    }
  }

  .text-container {
    padding-top: 7rem;
    padding-bottom: 7rem;
    padding-left: 5rem;

    @include media-breakpoint-up(md) {
      padding-left: 9rem;
      padding-top: $padding-top;
      padding-bottom: $padding-top;
    }

    .text {
      position: relative;
      font-family: $primary-font;
      font-size: 2rem;
      font-weight: 300;
      line-height: 1.7;
      margin-bottom: 3rem;

      p {
        margin: 0;
      }

      .rectangle {
        left: -4.7rem;
        top: 0.5rem;

        @include media-breakpoint-up(md) {
          left: -10.7rem;
        }
      }
    }
  }

  &.orange {
    .title {
      color: $orange;
    }
  }

  &.blue {
    .title {
      color: $dark-blue;
    }
  }

  &.red {
    .title {
      color: $red;
    }
  }
}
</style>
