<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { gsap, Power4 } from "gsap";
import ArrowNav from "@/assets/svg/arrow-nav-left.svg?component";
import { usePageStore } from "../stores/page";
import CaretDown from "@/assets/svg/caret-down.svg?component";

const pageStore = usePageStore();

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.CaseStudiesSlice>([
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
    class="slice case-studies"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="row">
        <div class="offset-md-1 col-md-2">
          <h2 class="title">{{ slice.primary.title }}</h2>
        </div>
        <div class="col-md-8 col-xl-7 col-xxl-8" style="position: relative">
          <div
            class="vertical-line left d-none d-md-block"
            :class="slice.primary.theme"
          ></div>
          <div class="case-container">
            <div
              v-for="(item, index) in slice.items"
              :key="item.position"
              class="app"
              :class="{
                [slice.primary.theme]: true,
              }"
            >
              <div
                class="app-position"
                :class="{ open: activeApp.indexOf(index) !== -1 }"
                @click.prevent="toggle(index)"
              >
                <div>
                  <div
                    class="caret"
                    :class="{
                      open: activeApp.indexOf(index) !== -1,
                      [slice.primary.theme]: true,
                    }"
                  >
                    <CaretDown />
                  </div>
                </div>
                <div class="position-title">{{ item.title }}</div>
              </div>
              <div
                class="app-description rich-text"
                :class="{
                  open: activeApp.indexOf(index) !== -1,
                  [slice.primary.theme]: true,
                }"
                :data-app="index"
                ref="positionContainers"
              >
                <PrismicRichText :field="item.text" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.case-studies {
  $padding-top: 10rem;
  background: #fff;

  .title {
    padding-top: $padding-top;
    font-family: $primary-font;
    font-size: 2.5rem;
    font-weight: 300;
    line-height: 1.5;

    @include media-breakpoint-up(md) {
      max-width: 13rem;
    }
  }

  .case-container {
    margin-top: 7rem;
    padding-bottom: 10rem;

    @include media-breakpoint-up(md) {
      margin-top: 10rem;
      padding-left: 4rem;
    }

    .app {
      margin-top: 2.5rem;
      border-bottom: 1px solid $orange;

      &.orange {
        border-color: $orange;
      }

      &.blue {
        border-color: $dark-blue;
      }

      &.red {
        border-color: $red;
      }

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        border-bottom: 0;
      }

      .app-position {
        position: relative;
        display: flex;
        align-items: flex-start;
        font-family: $primary-font;
        font-weight: 300;
        font-size: 2.5rem;

        color: $dark-grey;
        cursor: pointer;

        @include media-breakpoint-up(md) {
          font-size: 2.5rem;
        }

        .position-title {
          padding-left: 1.4rem;
          line-height: 1.1;
        }

        .caret {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.4rem;
          height: 2.4rem;
          background: $orange;
          margin-top: 0.2rem;

          &.blue {
            background: $dark-blue;
          }

          &.red {
            background: $red;
          }

          svg {
            width: 1rem;
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
        padding-left: 4rem;

        strong {
          font-weight: 700;
        }

        &.open {
          padding-bottom: 3rem;
        }
      }
    }
  }

  &.orange {
    .title {
      color: $orange;
    }

    .case-nav {
      .buttons {
        button {
          background: $orange;
        }
      }

      .bullets {
        .bullet {
          background: $orange;
        }
      }
    }
  }

  &.blue {
    .title {
      color: $dark-blue;
    }

    .case-nav {
      .buttons {
        button {
          background: $dark-blue;
        }
      }

      .bullets {
        .bullet {
          background: $dark-blue;
        }
      }
    }
  }

  &.red {
    .title {
      color: $red;
    }

    .case-nav {
      .buttons {
        button {
          background: $red;
        }
      }

      .bullets {
        .bullet {
          background: $red;
        }
      }
    }
  }
}
</style>
