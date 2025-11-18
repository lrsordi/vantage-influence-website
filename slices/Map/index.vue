<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { gsap } from "gsap";
import { Tippy } from "vue-tippy";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.MapSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const pageStore = usePageStore();
const locations = computed(() => pageStore.layoutData?.locations);
const ctx = gsap.context(() => {});
const mapEl = ref<HTMLDivElement>();
const rootEl = ref<HTMLDivElement>();
const mapImageEl = ref<HTMLDivElement>();

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  ctx.add(() => {
    gsap.fromTo(
      mapEl.value!.querySelectorAll(".tag"),
      {
        scaleX: 0.5,
        scaleY: 0.5,
        opacity: 0,
      },
      {
        scaleX: 1,
        scaleY: 1,
        ease: "back.out",
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          start: "center 90%",
          trigger: rootEl.value!,
        },
      }
    );

    gsap.fromTo(
      mapImageEl.value!,
      {
        opacity: 0.4,
        x: 10,
        y: 10,
      },
      {
        x: 0,
        y: 0,
        ease: "power3.out",
        opacity: 1,
        duration: 2,
        scrollTrigger: {
          start: "center 100%",
          trigger: rootEl.value!,
        },
      }
    );
  });
});
</script>

<template>
  <section
    class="slice map"
    ref="rootEl"
    :class="slice.primary.background"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="map-container" ref="mapEl">
        <h2>{{ slice.primary.title }}</h2>
        <div class="map-image" ref="mapImageEl"></div>

        <div
          class="tag"
          :style="{ top: `${l.top}%`, left: `${l.left}%` }"
          v-for="l in locations"
          :key="l.city || Math.random()"
        >
          {{ l.city }}
        </div>
      </div>

      <div class="address-container">
        <div
          class="address"
          v-for="l in locations"
          :key="l.city || Math.random()"
        >
          <div class="city-name">
            {{ l.city }}
          </div>
          <div
            class="city-address"
            v-html="`${l?.address}`.replace(/\n/g, '<br/>')"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.map {
  padding-top: 13rem;
  padding-bottom: 7rem;
  position: relative;

  .container {
    position: relative;
  }

  &.gradient {
    background: linear-gradient(
        180deg,
        #ffffff 0%,
        rgba(255, 255, 255, 0) 25.97%
      ),
      linear-gradient(
        133.25deg,
        #ffffff 9.17%,
        #dbe1e4 41.69%,
        #c3ced3 61.2%,
        #bfc9ce 65.85%,
        #b1bbc0 85.36%,
        #adb7bc 102.09%
      );
  }

  .map-container {
    position: relative;
    padding-top: 73%;
    width: 100%;

    .map-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("/imgs/map.png");
      background-size: 100% 100%;
      background-position: 50%;
      background-repeat: no-repeat;
    }

    h2 {
      @include slice-title;
      position: absolute;
      top: -3rem;
      left: 50%;
      transform: translateX(-50%);

      @include media-breakpoint-up(md) {
        top: 0;
      }
    }

    .tag {
      position: absolute;
      font-family: $secondary-font;
      font-size: 7px;
      font-weight: 700;
      color: $white;
      background: $orange;
      border: 1px solid $white;
      border-radius: 15px;
      padding: 0.3rem 0.7rem;
      text-transform: uppercase;

      @include media-breakpoint-up(md) {
        font-size: 12px;
      }

      // &::before {
      //   content: " ";
      //   position: absolute;
      //   width: 3px;
      //   height: 3px;
      //   background: $orange;
      //   border-radius: 50%;
      //   top: calc(100% + 3.5rem);
      //   left: 50%;
      //   transform: translateX(-50%);
      // }

      // &::after {
      //   content: " ";
      //   position: absolute;
      //   width: 0.5px;
      //   height: 3.5rem;
      //   background: $orange;
      //   top: 100%;
      //   left: 50%;
      //   transform: translateX(-50%);
      // }
    }
  }

  .address-container {
    flex-wrap: wrap;
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 4rem;
    padding-bottom: 5rem;
    margin-top: -3rem;

    @include media-breakpoint-up(md) {
      position: absolute;
      display: flex;
      bottom: 3rem;
      width: 80%;
      left: 50%;
      justify-content: space-between;
      transform: translateX(-50%);
      margin-top: 0;
      padding-bottom: 0;
    }

    .address {
      width: 80%;
      margin: 0 auto;

      @include media-breakpoint-up(md) {
        width: 15rem;
        margin: 0;
      }

      .city-name {
        font-family: $secondary-font;
        color: $black;
        font-weight: 700;
        font-size: 1.3rem;
        text-transform: uppercase;
        text-align: center;
        border-bottom: 1px solid $orange;
        padding-bottom: 0.3rem;
      }

      .city-address {
        font-family: $secondary-font;
        color: $black;
        font-weight: 400;
        font-size: 1.1rem;
        text-align: center;
        text-transform: uppercase;
        padding-top: 0.3rem;
      }
    }
  }
}
</style>
