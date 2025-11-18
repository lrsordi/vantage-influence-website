<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { gsap } from "gsap";
import { useModal } from "vue-final-modal";

import ArrowLink from "@/assets/svg/arrow-link.svg?component";
import { usePageStore } from "../../stores/page";
import NumbersModal from "../../components/NumbersModal";

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

const numbersEl = ref();
const gridEl = ref<HTMLDivElement>();
const ctx = gsap.context(() => {});
const pageStore = usePageStore();

const showModal = (image: any) => {
  const { open, close } = useModal({
    component: NumbersModal,
    attrs: {
      image,
      closeModal() {
        close();
      },
    },
  });

  pageStore.pauseScroll(true);
  open();
};

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  ctx.add(() => {
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
    class="slice numbers"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="row">
        <div class="offset-md-1 col-md-10 px-md-0">
          <h2>{{ slice.primary.title }}</h2>
          <div class="grid" ref="gridEl">
            <div
              class="grid-item card-gradient"
              :class="slice.primary.theme"
              ref="numbersEl"
              v-for="item in slice.items"
              :key="item.image.url ? item.image.url : Math.random()"
            >
              <img :src="item.image.url" v-if="item.image.url" />
              <div
                class="top-label"
                :class="item.top_label ? 'visible' : 'hidden'"
              >
                {{ item.top_label || "-" }}
              </div>
              <div class="number-container">
                <div class="prefix" v-if="item.prefix">{{ item.prefix }}</div>
                <div class="number">{{ item.number }}</div>
                <div class="suffix" v-if="item.suffix">{{ item.suffix }}</div>
              </div>
              <div class="label">
                {{ item.label }}
              </div>
              <div class="link" v-if="item.popup_image?.url">
                <a
                  href="#"
                  class="cta-link underline"
                  :class="slice.primary.theme"
                  @click.prevent="showModal(item.popup_image)"
                  >SEE HERE <ArrowLink
                /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.numbers {
  position: relative;
  padding-top: 15rem;

  h2 {
    @include slice-title;
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 2rem;
    row-gap: 2rem;
    padding-top: 7.5rem;
    padding-bottom: 5rem;
    perspective: 300px;

    @include media-breakpoint-up(md) {
      grid-template-columns: repeat(4, 1fr);
      column-gap: 4%;
    }

    .grid-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 0;

      border-radius: 5px;

      img {
        height: 3.5rem;
        z-index: 3;
      }

      .number-container {
        display: flex;
        align-items: center;
        background: $orange;
        background: linear-gradient(180deg, #ec6a06 37.65%, #ad4c02 64.52%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: $primary-font;
        font-size: 5rem;
        font-weight: 300;
        line-height: 1.1;
        z-index: 3;
      }

      .label {
        font-family: $secondary-font;
        font-size: 1.2rem;
        font-weight: 300;
        color: $black;
        text-transform: uppercase;
        max-width: 10rem;
        text-align: center;
        z-index: 3;
      }

      .link {
        z-index: 3;
        margin-top: 1rem;
      }

      .top-label {
        font-family: $secondary-font;
        font-size: 1.2rem;
        font-weight: 300;
        color: $black;
        text-transform: uppercase;
        margin-top: 0.6rem;
        text-align: center;
        z-index: 3;
        min-height: 1.2rem;

        &.hidden {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
