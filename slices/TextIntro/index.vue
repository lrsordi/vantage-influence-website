<script setup lang="ts">
import { type Content } from "@prismicio/client";
import ArrowLink from "@/assets/svg/arrow-link.svg?component";
import { gsap } from "gsap";
import { SplitText } from "gsap/dist/SplitText";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.TextIntroSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const textEl = ref<HTMLDivElement>();
const ctx = gsap.context(() => {});

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  const splitText = new SplitText(textEl.value!);
  ctx.add(() => {
    gsap.fromTo(
      textEl.value!,
      {
        y: "0%",
      },
      {
        y: "-30%",
        force3D: true,
        scrollTrigger: {
          scrub: true,
        },
      }
    );
    gsap.fromTo(
      splitText.words!,
      {
        opacity: 0.1,
      },
      {
        opacity: 1,
        stagger: 0.05,
        force3D: true,
        scrollTrigger: {
          scrub: true,
          start: "top 75%",
          end: "bottom 75%",
          trigger: textEl.value,
        },
      }
    );
  });
});
</script>

<template>
  <section
    class="slice text-intro"
    :class="slice.primary.theme"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="row">
        <div class="offset-md-1 col-md-6 col-lg-6">
          <div class="text rich-text" :class="slice.primary.theme" ref="textEl">
            <PrismicRichText :field="slice.primary.text" />
          </div>
        </div>
        <div class="offset-md-1 col-md-4 col-lg-4" style="position: relative">
          <div
            class="vertical-line left d-none d-md-block"
            :class="slice.primary.theme"
          ></div>
          <div class="action">
            <PrismicLink
              :field="slice.primary.link"
              class="cta-link"
              :class="slice.primary.theme"
            >
              {{ slice.primary.link_label }} <ArrowLink />
              <div class="rectangle" :class="slice.primary.theme"></div>
            </PrismicLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.text-intro {
  padding-bottom: 20rem;

  @include media-breakpoint-up(lg) {
    padding-bottom: 30rem;
  }

  .text {
    padding-top: 15rem;
    font-family: $primary-font;
    font-size: 2.5rem;
    line-height: 1.9;
    color: $dark-grey;
    will-change: transform;

    > div {
      p:last-child {
        margin-bottom: 0;
      }
    }
  }

  &.orange {
    .text {
      strong {
        color: $orange;
        font-weight: 300;
      }
    }
  }

  .action {
    display: flex;
    align-items: flex-end;
    height: 100%;
    margin-top: 2rem;

    @include media-breakpoint-up(md) {
      margin-top: 0;
    }
  }

  .cta-link {
    padding-left: 2.2rem;

    .rectangle {
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      transition:
        transform 0.5s $easeInOutQuint,
        left 0.5s $easeInOutQuint,
        width 0.5s $easeInOutQuint;

      @include media-breakpoint-up(md) {
        left: -1.7rem;
      }
    }

    svg {
      transition: transform 0.3s $easeInOutQuint;
    }

    &:hover {
      .rectangle {
        width: 2rem;
        left: -0.7rem;
      }
      svg {
        transform: translate3d(5px, 0px, 0px);
      }
      .text {
        color: #fff !important;
      }
    }
  }
}
</style>
