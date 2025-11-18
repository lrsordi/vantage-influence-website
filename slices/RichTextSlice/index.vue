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
    class="slice rich-text"
    :class="{
      [slice.primary.theme]: true,
    }"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="row">
        <div class="offset-md-2 col-md-7" style="position: relative">
          <div class="vertical-line left" :class="slice.primary.theme"></div>
          <div class="text-container rich-text">
            <div class="text">
              <PrismicRichText :field="slice.primary.text" />
              <div class="rectangle" :class="slice.primary.theme"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.rich-text {
  $padding-top: 11rem;

  h1,
  h2,
  h3,
  h4 {
    font-family: $primary-font;
    font-size: 2.5rem;
    font-weight: 300;
    line-height: 1.5;
    margin-bottom: 4rem;
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
    padding-left: 4rem;

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

        &.block-img {
          text-align: center;
          margin: 4rem 0;
          img {
            max-width: 100%;
          }
        }
      }

      .rectangle {
        left: -4.7rem;
        top: 0.5rem;

        @include media-breakpoint-up(md) {
          left: -10.7rem;
        }
      }

      a {
        color: $dark-grey;
        text-decoration: underline;
        transition: all 0.3s linear;

        &:hover {
          color: $dark;
        }
      }
    }
  }

  &.orange {
    h1,
    h2,
    h3,
    h4 {
      color: $orange;
    }
  }

  &.blue {
    h1,
    h2,
    h3,
    h4 {
      color: $dark-blue;
    }
  }

  &.red {
    h1,
    h2,
    h3,
    h4 {
      color: $red;
    }
  }
}
</style>
