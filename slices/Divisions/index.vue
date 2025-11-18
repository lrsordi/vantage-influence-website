<script setup lang="ts">
import { type Content } from "@prismicio/client";
import type { UseSwipeDirection } from "@vueuse/core";
import { useSwipe } from "@vueuse/core";

import ArrowLink from "@/assets/svg/arrow-link.svg?component";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.DivisionsSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const activeIndex = ref(0);
const gridEl = ref<HTMLDivElement>();

const next = () => {
  let nextIndex = activeIndex.value + 1;
  const length = props.slice.items.length;
  transitionName = "right";
  activeIndex.value = nextIndex >= length ? 0 : nextIndex;
};

const previous = () => {
  let previousIndex = activeIndex.value - 1;
  const length = props.slice.items.length;
  transitionName = "left";
  activeIndex.value = previousIndex < 0 ? length - 1 : previousIndex;
};

let transitionName = "left";

const setActiveIndex = (index: number) => {
  if (index > activeIndex.value) {
    transitionName = "right";
  } else {
    transitionName = "left";
  }
  activeIndex.value = index;
};

// useSwipe(gridEl, {
//   passive: false,
//   onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
//     if (direction === "right") {
//       previous();
//     } else {
//       next();
//     }
//   },
// });
</script>

<template>
  <section
    class="slice divisions"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    :style="
      slice.primary.custom_background_color
        ? { background: slice.primary.custom_background_color }
        : {}
    "
  >
    <div class="container">
      <div class="row">
        <div class="col-lg-12 px-0">
          <h2>{{ slice.primary.title }}</h2>
          <div class="grid d-none d-md-grid">
            <div
              class="grid-item"
              v-for="item in slice.items"
              :key="item.image.url"
            >
              <div
                class="vertical-line left d-none d-md-block"
                :class="slice.primary.theme"
              ></div>
              <div
                class="horizontal-line bottom d-block d-md-none"
                :class="slice.primary.theme"
              ></div>
              <NuxtLink :to="item.link.url">
                <img :src="item.image.url" />
              </NuxtLink>
              <div class="action">
                <PrismicLink
                  :field="item.link"
                  class="cta-link underline"
                  :class="item.theme"
                >
                  {{ item.link_label }} <ArrowLink />
                </PrismicLink>
                <div
                  class="rectangle d-none d-md-block"
                  :class="slice.primary.theme"
                ></div>
              </div>
            </div>
          </div>

          <div class="grid d-grid d-md-none" ref="gridEl">
            <Transition
              mode="out-in"
              :name="transitionName"
              :duration="{ leave: 300, enter: 400 }"
            >
              <div class="grid-item" :key="`card-${activeIndex}`">
                <div
                  class="vertical-line left d-none"
                  :class="slice.primary.theme"
                ></div>
                <div
                  class="horizontal-line bottom d-bloc"
                  :class="slice.primary.theme"
                ></div>
                <NuxtLink :to="slice.items[activeIndex].link.url">
                  <img :src="slice.items[activeIndex].image.url" />
                </NuxtLink>
                <div class="action">
                  <PrismicLink
                    :field="slice.items[activeIndex].link"
                    class="cta-link underline"
                    :class="slice.items[activeIndex].theme"
                  >
                    {{ slice.items[activeIndex].link_label }} <ArrowLink />
                  </PrismicLink>
                  <div
                    class="rectangle d-none d-md-block"
                    :class="slice.primary.theme"
                  ></div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="case-nav d-grid d-md-none">
            <div class="bullets">
              <div
                v-for="(item, index) in slice.items"
                :key="`bullet-${index}`"
                class="bullet"
                :class="{
                  active: index === activeIndex,
                  [slice.items[activeIndex].theme]:
                    slice.items[activeIndex].theme,
                }"
                @click.prevent="setActiveIndex(index)"
              ></div>
            </div>
            <!-- <div class="buttons">
              <button class="left" @click.prevent="previous()">
                <ArrowNav />
              </button>
              <div class="divider" />
              <button class="right" @click.prevent="next()">
                <ArrowNav />
              </button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.divisions {
  position: relative;
  background: #ecf1f3bf;
  padding: 10rem 0;

  @include media-breakpoint-up(md) {
    padding: 0;
  }

  h2 {
    @include slice-title;
    text-align: center;

    @include media-breakpoint-up(md) {
      position: absolute;
      top: 9rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    row-gap: 10rem;
    padding-top: 10rem;

    @include media-breakpoint-up(md) {
      grid-template-columns: repeat(3, 1fr);
      padding-top: 0;
    }

    .grid-item {
      position: relative;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      grid-row-start: 1;
      grid-column-start: 1;
      min-height: 30rem;

      @include media-breakpoint-up(md) {
        padding-top: 20rem;
        padding-bottom: 20rem;
        grid-row-start: auto;
        grid-column-start: auto;
        min-height: auto;
      }

      @include media-breakpoint-up(lg) {
        padding-top: 24rem;
        padding-bottom: 25rem;
      }

      img {
        max-width: 28rem;
        margin-bottom: 9.5rem;

        @include media-breakpoint-up(md) {
          max-width: 20rem;
        }
      }

      .action {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;

        .rectangle {
          left: 0;
          transition: transform 0.5 $easeInOutQuint;

          @include media-breakpoint-up(md) {
            right: 0;
            left: auto;
          }
        }

        svg {
          transition: transform 0.4s $easeInOutQuint;
        }

        &:hover {
          svg {
            transform: translate3d(5px, 0px, 0px);
          }
        }
      }

      .horizontal-line {
        bottom: -5rem;
      }

      &:last-child {
        .horizontal-line {
          display: none !important;
        }
      }

      @include media-breakpoint-up(md) {
        &:nth-child(1) {
          .vertical-line {
            display: none !important;
          }
        }

        &:nth-child(3) {
          .rectangle {
            display: none !important;
          }
        }
      }
    }
  }

  .case-nav {
    position: relative;
    margin-top: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @include media-breakpoint-up(md) {
      display: block;
      padding-left: 5.5rem;
    }

    .buttons {
      position: relative;
      display: flex;
      margin-top: 1rem;

      button {
        background: $orange;
        border: 0;
        border-radius: 2px;
        outline: none;
        width: 4rem;
        height: 4rem;
        transition: all 0.5s $easeOutQuint;

        @include media-breakpoint-up(md) {
          width: 3.5rem;
          height: 3.5rem;
        }

        &:hover {
          opacity: 0.9;
        }

        &.right {
          svg {
            transform: rotate(180deg);
          }
        }
      }

      .divider {
        width: 1px;
        background: transparent;
      }
    }

    .bullets {
      display: flex;

      .bullet {
        width: 10px;
        height: 10px;
        background: $orange;
        border-radius: 50%;
        opacity: 25%;
        transition: all 0.5s $easeOutQuint;
        margin-right: 1.5rem;
        cursor: pointer;

        &.active {
          opacity: 1;
        }

        &:last-child {
          margin-right: 0;
        }

        &.red {
          background: $red;
        }

        &.blue {
          background: $dark-blue;
        }
      }
    }
  }
}

.left-enter-active,
.right-enter-active {
  transition: all 0.4s ease-out;
}

.left-leave-active,
.right-leave-active {
  transition: all 0.3s ease-in;
}

.left-enter-from {
  transform: translateX(-50px);
  opacity: 0;
}
.right-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
.left-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.right-enter-from {
  transform: translateX(50px);
  opacity: 0;
}
</style>
