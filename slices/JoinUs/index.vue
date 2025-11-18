<script setup lang="ts">
import { gsap, Power4 } from "gsap";
import { type Content } from "@prismicio/client";
import CaretDown from "@/assets/svg/caret-down.svg?component";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.JoinUsSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const activeApp = ref([]);
const positionContainers = ref([]);

onMounted(() => {
  gsap.set(positionContainers.value, {
    height: 0,
    opacity: 0,
  });
});

const toggle = (index: number) => {
  const foundIndex = activeApp.value.indexOf(index);

  if (foundIndex !== -1) {
    gsap.to(positionContainers.value[index], {
      opacity: 0,
      height: 0,
      duration: 1,
      ease: Power4.easeOut,
    });
    activeApp.value.splice(foundIndex, 1);
  } else {
    gsap.to(positionContainers.value[index], {
      opacity: 1,
      height: "auto",
      duration: 1,
      ease: Power4.easeOut,
    });
    activeApp.value.push(index);
  }
};
</script>

<template>
  <section
    class="slice join-us"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="row">
        <div
          class="offset-1 offset-md-2 col-11 col-md-9"
          style="position: relative"
        >
          <div class="vertical-line left" :class="slice.primary.theme"></div>
          <h2 class="title">
            {{ slice.primary.title }}
            <div class="rectangle" :class="slice.primary.theme"></div>
          </h2>
          <div class="text-container">
            <PrismicRichText :field="slice.primary.text" />
          </div>

          <div class="app-container">
            <div
              v-for="(item, index) in slice.items"
              :key="item.position"
              class="app"
            >
              <div
                class="app-position"
                :class="{ open: activeApp.indexOf(index) !== -1 }"
                @click.prevent="toggle(index)"
              >
                {{ item.position }}
                <div
                  class="caret"
                  :class="{
                    open: activeApp.indexOf(index) !== -1,
                    [item.theme]: true,
                  }"
                >
                  <CaretDown />
                </div>
              </div>
              <div
                class="app-description rich-text"
                :class="item.theme"
                :data-app="index"
                ref="positionContainers"
              >
                <PrismicRichText :field="item.description" />

                <ApplyForm
                  :position="item.position"
                  :index="index"
                  :itemData="item"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.join-us {
  padding-top: 8rem;

  .vertical-line {
    &.left {
      left: -3rem;

      @include media-breakpoint-up(md) {
        left: -9rem;
      }
    }
  }

  .title {
    position: relative;
    margin-top: 14rem;
    font-family: $primary-font;
    font-weight: 300;
    font-size: 4.5rem;
    line-height: 1.1;

    .rectangle {
      top: 1rem;
      left: -4.7rem;

      @include media-breakpoint-up(md) {
        left: -10.7rem;
      }
    }
  }

  .text-container {
    font-family: $secondary-font;
    font-weight: 300;
    font-size: 2rem;
    line-height: 1.5;
    margin-top: 4rem;

    strong {
      font-weight: 700;
    }
  }

  .app-container {
    margin-top: 10rem;
    padding-bottom: 10rem;

    .app {
      margin-top: 4.5rem;

      &:first-child {
        margin-top: 0;
      }

      .app-position {
        position: relative;
        font-family: $secondary-font;
        font-weight: 300;
        font-size: 3rem;
        line-height: 1.2;
        color: $black;
        cursor: pointer;
        padding-left: 4rem;

        @include media-breakpoint-up(md) {
          padding-left: 0;
          font-size: 3.5rem;
        }

        .caret {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          left: -3.7rem;
          top: 50%;
          transform: translateY(-50%);
          width: 5.5rem;
          height: 4.8rem;
          background: $orange;

          @include media-breakpoint-up(md) {
            left: -9.7rem;
          }

          &.blue {
            background: $dark-blue;
          }

          &.red {
            background: $red;
          }

          svg {
            width: 1.5rem;
            height: auto;
            transition: all 0.5s $easeOutQuint;
          }

          &.open {
            svg {
              transform: rotate(180deg);
            }
          }
        }
      }

      .app-description {
        margin-top: 2.5rem;
        font-family: $secondary-font;
        font-weight: 300;
        font-size: 1.6rem;
        line-height: 1.5;
        color: $black;
        overflow: hidden;

        strong {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
