<script setup lang="ts">
import { type Content } from "@prismicio/client";
import QuoteIcon from "@/assets/svg/quote.svg?component";
import ArrowNav from "@/assets/svg/arrow-nav-left.svg?component";
import { gsap } from "gsap";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.TestimonialSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const activeIndex = ref(0);
const transitionName = ref("left");
const next = () => {
  let nextIndex = activeIndex.value + 1;
  const length = props.slice.items.length;
  transitionName.value = "right";
  activeIndex.value = nextIndex >= length ? 0 : nextIndex;
};
const previous = () => {
  let previousIndex = activeIndex.value - 1;
  const length = props.slice.items.length;
  transitionName.value = "left";
  activeIndex.value = previousIndex < 0 ? length - 1 : previousIndex;
};

const setActiveIndex = (index: number) => {
  if (index > activeIndex.value) {
    transitionName.value = "right";
  } else {
    transitionName.value = "left";
  }
  activeIndex.value = index;
};

const ctx = gsap.context(() => {});
const rootElm = ref<HTMLDivElement>();
const wrapper = ref<HTMLDivElement>();

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  ctx.add(() => {
    gsap.fromTo(
      wrapper.value,
      {
        opacity: 0,
        y: 35,
      },
      {
        opacity: 1,
        y: 1,
        scaleX: 1,
        scaleY: 1,
        ease: "power4.out",
        duration: 1,
        scrollTrigger: {
          scrub: true,
          start: "-300px center",
          end: "center center",
          trigger: rootElm.value!,
        },
      }
    );
  });
});
</script>

<template>
  <section
    class="slice testimonials"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
    ref="rootElm"
  >
    <div class="container">
      <div class="row">
        <div class="offset-md-1 col-md-10 px-md-0">
          <h2>Testimonials</h2>

          <div class="testimonial-wrapper" ref="wrapper">
            <div
              class="testimonial-container card-gradient"
              :class="slice.primary.theme"
              ref="container"
            >
              <div class="quote-left"><QuoteIcon /></div>
              <div class="quote-right"><QuoteIcon /></div>
              <Transition
                mode="out-in"
                :name="transitionName"
                :duration="{ leave: 300, enter: 400 }"
              >
                <div :key="`card-${activeIndex}`">
                  <div class="testimonial-text">
                    <PrismicRichText
                      :field="slice.items[activeIndex].testimonial"
                    />
                  </div>
                  <div class="testimonial-author">
                    {{ slice.items[activeIndex].author }}
                  </div>
                </div>
              </Transition>
            </div>

            <div
              class="testimonial-nav"
              :class="slice.primary.theme"
              ref="navigation"
            >
              <div class="buttons">
                <button class="left" @click.prevent="previous()">
                  <ArrowNav />
                </button>
                <div class="divider" />
                <button class="right" @click.prevent="next()">
                  <ArrowNav />
                </button>
              </div>

              <div class="bullets">
                <div
                  v-for="(item, index) in slice.items"
                  :key="`bullet-${index}`"
                  class="bullet"
                  :class="{
                    active: index === activeIndex,
                  }"
                  @click.prevent="setActiveIndex(index)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.testimonials {
  position: relative;
  padding-top: 10rem;
  padding-bottom: 5rem;

  h2 {
    @include slice-title;
    text-align: center;
  }

  .testimonial-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 4.6rem;
    margin-left: auto;
    margin-right: auto;
    z-index: 3;
    min-height: 47rem;
    width: 100%;
    padding: 5rem 0;
    transition: all 0.3s linear;

    @include media-breakpoint-up(md) {
      width: 85%;
    }

    .testimonial-text {
      position: relative;
      font-family: $secondary-font;
      font-size: 2rem;
      font-weight: 300;
      line-height: 1.5;
      max-width: 41rem;
      text-transform: uppercase;
      color: #000;
      font-style: italic;
      z-index: 4;
      text-align: center;
      margin: 0 auto;

      @include media-breakpoint-up(md) {
        font-size: 2.4rem;
      }
    }

    .testimonial-author {
      position: relative;
      font-family: $primary-font;
      font-size: 1.6rem;
      font-weight: 300;
      color: $orange;
      text-align: center;
      z-index: 4;
      padding-top: 1rem;

      @include media-breakpoint-up(md) {
        font-size: 1.8rem;
      }
    }

    .quote-left {
      position: absolute;
      top: 2.4rem;
      left: 2.4rem;
      z-index: 4;

      svg {
        width: 3rem;
        height: auto;

        @include media-breakpoint-up(md) {
          width: 4.3rem;
        }
      }
    }

    .quote-right {
      position: absolute;
      bottom: 2.4rem;
      right: 2.4rem;
      transform: rotate(180deg);
      z-index: 4;

      svg {
        width: 3rem;
        height: auto;

        @include media-breakpoint-up(md) {
          width: 4.3rem;
        }
      }
    }

    &.red {
      .testimonial-author {
        color: $red;
      }
    }

    &.blue {
      .testimonial-author {
        color: $dark-blue;
      }
    }
  }

  .testimonial-nav {
    position: relative;
    z-index: 10;

    .buttons {
      position: absolute;
      display: flex;
      top: -2.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 4;

      @include media-breakpoint-up(lg) {
        top: -2rem;
      }

      button {
        background: $orange;
        border: 0;
        border-radius: 2px;
        outline: none;
        width: 4.5rem;
        height: 4.5rem;
        transition: all 0.5s $easeOutQuint;
        @include media-breakpoint-up(lg) {
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
      justify-content: center;
      padding-top: 4.5rem;

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
      }
    }
  }

  &.red {
    .buttons button {
      background: $red;
    }

    .bullets .bullet {
      background: $red;
    }
  }

  &.blue {
    .buttons button {
      background: $dark-blue;
    }

    .bullets .bullet {
      background: $dark-blue;
    }
  }
}

.left-enter-active,
.right-enter-active {
  transition: all 0.4s ease-out;
  z-index: 4;
}
.left-leave-active,
.right-leave-active {
  transition: all 0.3s ease-in;
  z-index: 4;
}
.left-enter-from {
  transform: translateX(-50px);
  opacity: 0;
  z-index: 4;
}
.right-leave-to {
  transform: translateX(-20px);
  opacity: 0;
  z-index: 4;
}
.left-leave-to {
  transform: translateX(20px);
  opacity: 0;
  z-index: 4;
}
.right-enter-from {
  transform: translateX(50px);
  opacity: 0;
  z-index: 4;
}
</style>
