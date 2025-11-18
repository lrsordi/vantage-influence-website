<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { gsap } from "gsap";
import SplitText from "gsap/dist/SplitText";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.SymbolSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const overlayEl = ref<HTMLDivElement>();
const rootEl = ref<HTMLElement>();
const textEl = ref<HTMLDivElement>();
const symbolEl = ref<HTMLImageElement>();
const ctx = gsap.context(() => {});

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  const splitText = new SplitText(textEl.value!.querySelector("p"), {
    type: "words",
  });
  ctx.add(() => {
    gsap.fromTo(
      splitText.words,
      {
        opacity: 0.1,
        x: -1,
      },
      {
        opacity: 1,
        stagger: 0.1,
        x: 0,
        scrollTrigger: {
          scrub: 1.5,
          trigger: rootEl.value!,
          start: "top 70%",
          end: "top 20%",
        },
      }
    );
    gsap.fromTo(
      symbolEl.value!,
      {
        scaleX: 0.9,
        scaleY: 0.9,
        opacity: 0,
        filter: "blur(3px)",
        y: 40,
      },
      {
        scaleX: 1,
        scaleY: 1,
        filter: "blur(0px)",
        ease: "power3.out",
        opacity: 1,
        y: 0,
        scrollTrigger: {
          scrub: true,
          trigger: rootEl.value!,
          start: "top bottom",
          end: "center center",
        },
      }
    );
  });
});
</script>

<template>
  <section
    class="slice symbol"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :style="
      slice.primary.custom_background_color
        ? { background: slice.primary.custom_background_color }
        : {}
    "
    ref="rootEl"
  >
    <div class="overlay" ref="overlayEl"></div>
    <div class="container">
      <div class="row">
        <div class="offset-md-1 col-md-4"></div>
        <div class="col-md-6">
          <h2 class="title">{{ slice.primary.title }}</h2>
        </div>
      </div>
      <div class="row gx-5">
        <div class="offset-md-1 col-md-4">
          <div class="image-container" ref="symbolEl">
            <img :src="slice.primary.image.url || ''" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="text-container rich-text" ref="textEl">
            <PrismicRichText :field="slice.primary.text" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.symbol {
  position: relative;
  background: $brown-grey;
  padding-top: 11rem;
  padding-bottom: 17rem;
  overflow: hidden;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 150%;
    top: -25%;
    background: url("/imgs/bg-symbol-repeat.png");
    background-repeat: repeat;
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .title {
    font-family: $primary-font;
    font-weight: 300;
    font-size: 2.5rem;
    color: $orange;
    margin-bottom: 6rem;
    z-index: 2;
    text-align: center;

    @include media-breakpoint-up(md) {
      text-align: left;
    }
  }

  .text-container {
    font-family: $primary-font;
    font-weight: 300;
    font-size: 2rem;
    line-height: 1.7;
    color: $light-grey;
    z-index: 2;
    margin-top: 6rem;

    @include media-breakpoint-up(md) {
      margin-top: 0;
    }

    > div {
      strong {
        color: $white;
      }

      p {
        margin-bottom: 5rem;

        &:last-child {
          margin-bottom: 0;
        }
      }

      a {
        color: $light-grey;
        transition: color 0.3s linear;

        &:hover {
          color: $white;
        }

        > div {
          text-decoration: underline;
        }
      }
    }
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    img {
      max-width: 90%;
    }
  }
}
</style>
