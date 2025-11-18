<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { gsap } from "gsap";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.NumbersSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const imageEl = ref<HTMLImageElement>();
const ctx = gsap.context(() => {});
const rootEl = ref<HTMLDivElement>();
const numbersEl = ref();
const gridEl = ref<HTMLDivElement>();

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  ctx.add(() => {
    gsap.fromTo(
      imageEl.value!,
      {
        y: 0,
      },
      {
        y: 120,
        scrollTrigger: {
          scrub: true,
          start: "top bottom",
          end: "bottom top",
          trigger: rootEl.value!,
        },
      }
    );

    gsap.fromTo(
      numbersEl.value!,
      {
        scaleX: 0.9,
        scaleY: 0.7,
        boxShadow: "0px 15px 0px -25px #00000066",
        rotationX: -10,
        y: 90,
      },
      {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        ease: "power4.out",
        duration: 1,
        boxShadow: "0px 15px 50px -25px #00000066",
        rotationX: 0,
        stagger: 0.08,
        y: 0,
        scrollTrigger: {
          start: "top 85%",
          end: "center 30%",
          scrub: 6,
          trigger: numbersEl.value[0].parentNode,
        },
      }
    );

    gsap.fromTo(
      gridEl.value!.querySelectorAll(".grid-item > *")!,
      {
        y: 10,
        opacity: 0,
      },
      {
        stagger: 0.02,
        y: 0,
        opacity: 1,
        scrollTrigger: {
          start: "top 85%",
          end: "center 30%",
          scrub: 6,
          trigger: numbersEl.value[0].parentNode,
        },
      }
    );
  });
});
</script>

<template>
  <section
    class="slice areas"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    ref="rootEl"
  >
    <div class="background" ref="imageEl" />
    <div class="container">
      <div class="row">
        <div class="col-md-12 px-md-0">
          <h2>{{ slice.primary.title }}</h2>
          <div class="grid" ref="gridEl">
            <div
              class="grid-item card-gradient"
              :class="slice.primary.theme"
              v-for="item in slice.items"
              :key="item.icon.url"
              ref="numbersEl"
            >
              <img :src="item.icon.url" />
              <div class="label">
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.areas {
  position: relative;
  padding-top: 10rem;
  padding-bottom: 10rem;
  overflow: hidden;

  .background {
    background-image: url("/imgs/bg-areas.png");
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 240px);
    z-index: 0;
    margin-top: -120px;
  }

  @include media-breakpoint-up(md) {
    padding-top: 15rem;
    padding-bottom: 18rem;
  }

  h2 {
    @include slice-title;
    text-align: center;
    z-index: 2;
    position: relative;
  }

  .grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    column-gap: 2rem;
    row-gap: 2rem;
    margin-top: 6rem;

    @include media-breakpoint-up(md) {
      column-gap: 1.6rem;
      padding-top: 7.5rem;
      margin-top: 0;
      flex-wrap: nowrap;
    }

    .grid-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 0;
      min-width: 30%;

      @include media-breakpoint-up(md) {
        min-width: 15.2%;
      }

      img {
        height: 4.4rem;
        z-index: 3;
      }

      .label {
        font-family: $secondary-font;
        font-size: 1.6rem;
        font-weight: 300;
        color: $black;
        text-transform: uppercase;
        max-width: 14.3rem;
        text-align: center;
        margin-top: 2rem;
        z-index: 3;
      }
    }
  }
}
</style>
