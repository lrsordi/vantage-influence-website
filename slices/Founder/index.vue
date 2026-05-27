<script setup lang="ts">
import { type Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.FounderSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);
</script>

<template>
  <section
    class="slice founder"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <h2 v-if="slice.primary.section_title" class="section-title">
        {{ slice.primary.section_title }}
      </h2>
      <div class="row align-items-center">
        <div class="col-md-5">
          <div class="founder-image">
            <PrismicImage :field="slice.primary.image" />
          </div>
        </div>
        <div class="col-md-7">
          <div class="founder-info">
            <p v-if="slice.primary.name" class="founder-name">{{ slice.primary.name }}</p>
            <p v-if="slice.primary.role" class="founder-role">{{ slice.primary.role }}</p>
            <div v-if="slice.primary.text" class="founder-text rich-text">
              <PrismicRichText :field="slice.primary.text" />
            </div>
            <a v-if="slice.primary.email" :href="`mailto:${slice.primary.email}`" class="founder-email">
              {{ slice.primary.email }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.founder {
  padding-top: 10rem;
  padding-bottom: 10rem;

  .section-title {
    @include slice-title;
    margin-bottom: 6rem;
  }

  .founder-image {
    img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  }

  .founder-info {
    padding-left: 4rem;

    .founder-name {
      font-family: $primary-font;
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 0.5rem;
    }

    .founder-role {
      font-family: $secondary-font;
      font-size: 1.4rem;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 3rem;
    }

    .founder-text {
      font-family: $secondary-font;
      font-size: 1.6rem;
      font-weight: 300;
      line-height: 1.6;
      margin-bottom: 3rem;
    }

    .founder-email {
      font-family: $secondary-font;
      font-size: 1.4rem;
      font-weight: 400;
      text-decoration: none;
      color: inherit;
      border-bottom: 1px solid currentColor;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
