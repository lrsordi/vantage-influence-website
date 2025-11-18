<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { gsap } from "gsap";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.ClientsSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const imageEl = ref<HTMLImageElement>();
const ctx = gsap.context(() => {});
const rootEl = ref<HTMLDivElement>();
const verticalLineEl = ref<HTMLDivElement>();
const horizontalLineEl = ref<HTMLDivElement>();
const rectangleEl = ref<HTMLDivElement>();

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  ctx.add(() => {
    gsap.fromTo(
      imageEl.value!,
      {
        y: "-20%",
      },
      {
        y: "20%",
        scrollTrigger: {
          scrub: true,
          start: "top bottom",
          end: "bottom top",
          trigger: rootEl.value!,
        },
      }
    );

    verticalLineEl.value.forEach((el: any) => {
      gsap.fromTo(
        el,
        {
          scaleY: 0,
        },
        {
          scaleY: 1,
          scrollTrigger: {
            scrub: true,
            start: "top center",
            end: "bottom center",
            trigger: el.parentNode,
          },
        }
      );
    });

    horizontalLineEl.value.forEach((el: any) => {
      gsap.fromTo(
        el,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          scrollTrigger: {
            scrub: true,
            start: "top center",
            end: "+20px center",
            trigger: el,
          },
        }
      );
    });

    rectangleEl.value.forEach((el: any) => {
      gsap.fromTo(
        el,
        {
          width: 0,
          x: "1rem",
          opacity: 0,
          transformOrigin: "top right",
        },
        {
          width: "1rem",
          x: "0",
          opacity: 1,
          scrollTrigger: {
            scrub: true,
            start: "-50px center",
            end: "bottom center",
            trigger: el,
          },
        }
      );
    });
  });
});
</script>

<template>
  <section
    class="slice clients"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    ref="rootEl"
  >
    <div class="container">
      <div
        class="row"
        v-for="(item, index) in slice.items"
        :key="item.logo.url || Math.random()"
      >
        <div
          class="horizontal-line top d-block d-md-none"
          :class="item.theme"
          v-if="index > 0"
          ref="horizontalLineEl"
          :style="{ transformOrigin: 'top right' }"
        ></div>
        <div
          class="col-md-6 d-none d-md-block"
          :class="item.position === 'left' ? 'order-1' : 'order-2'"
        >
          <div class="image-container" :class="item.position">
            <div
              class="horizontal-line top d-none d-md-block"
              :class="item.theme"
              v-if="item.position === 'left' && index > 0"
              ref="horizontalLineEl"
              :style="{ transformOrigin: 'top left' }"
            ></div>
            <div class="image-content">
              <img :src="item.image.url || ''" ref="imageEl" />
            </div>
          </div>
        </div>

        <div
          class="col-md-6"
          :class="item.position === 'left' ? 'order-2' : 'order-1'"
        >
          <div class="info-container">
            <div
              class="horizontal-line top d-none d-md-block"
              :class="item.theme"
              v-if="item.position === 'right'"
              :style="{ transformOrigin: 'top right' }"
              ref="horizontalLineEl"
            ></div>
            <div
              class="vertical-line left"
              :class="item.theme"
              ref="verticalLineEl"
            ></div>
            <div class="image">
              <img :src="item.logo.url || ''" />
            </div>
            <div class="text rich-text" :class="item.theme">
              <div
                class="rectangle"
                :class="item.theme"
                ref="rectangleEl"
              ></div>
              <PrismicRichText :field="item.description" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.clients {
  padding-top: 8rem;
  padding-bottom: 5rem;
  background: linear-gradient(
      118.23deg,
      #ecf1f3 13.96%,
      rgba(236, 241, 243, 0) 93.93%
    ),
    linear-gradient(0deg, #ffffff, #ffffff);

  .row {
    position: relative;
  }

  .image-container {
    position: relative;
    height: 100%;

    .image-content {
      position: absolute;
      width: 72rem;
      height: 53rem;
      right: 5.5rem;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 18px;
      border: 1px solid #b1abad;
      overflow: hidden;
      box-shadow: 0px 15px 60px -25px #00000099;
    }

    img {
      position: relative;
      top: 0;
      left: 0;
      width: auto;
      height: 140%;
      object-fit: cover;
      will-change: transform;
      margin-top: -20%;
    }

    &.right {
      .image-content {
        right: auto;
        left: 5.5rem;
      }
    }
  }

  .info-container {
    position: relative;
    padding-top: 16rem;
    padding-bottom: 13rem;

    @include media-breakpoint-up(md) {
      display: block;
    }

    .image {
      margin-bottom: 6.3rem;
      text-align: center;

      @include media-breakpoint-up(md) {
        text-align: left;
        padding-left: 5.5rem;
      }

      img {
        width: 24.5rem;
      }
    }

    .text {
      position: relative;
      font-family: $primary-font;
      font-weight: 300;
      font-size: 2.5rem;
      padding-left: 5.5rem;

      .rectangle {
        left: -1rem;
        top: 0.5rem;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          &::before {
            content: "• ";
            color: $orange;
            margin-right: 1rem;
          }
        }
      }

      &.red {
        ul {
          list-style: none;
          padding: 0;

          li {
            &::before {
              color: $red;
            }
          }
        }
      }

      &.blue {
        ul {
          list-style: none;
          padding: 0;

          li {
            &::before {
              color: $dark-blue;
            }
          }
        }
      }
    }
  }
}
</style>
