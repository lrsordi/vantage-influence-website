<script setup lang="ts">
import { type Content } from "@prismicio/client";
import ArrowLink from "@/assets/svg/arrow-link.svg?component";
import { gsap } from "gsap";

const props = defineProps<{
  item?: any;
  theme: string;
}>();

const imageEl = ref<HTMLImageElement>();
const ctx = gsap.context(() => {});
const rootEl = ref<HTMLDivElement>();
const contentElm = ref<HTMLDivElement>();
const opened = ref(false);
const openedHeight = ref(0);
const textHeight = ref("auto");

watch(opened, (nV: boolean) => {
  if (nV) {
    textHeight.value = `${openedHeight.value}px`;
  } else {
    textHeight.value = "285px";
  }
});

const checkContentSize = () => {
  const height = contentElm.value.getBoundingClientRect().height;

  if (height > 300) {
    textHeight.value = "285px";
    openedHeight.value = height + 50;
  }
};

onUnmounted(() => {
  ctx.kill();
});

onMounted(() => {
  ctx.add(() => {
    gsap.fromTo(
      imageEl.value!,
      {
        y: "-10%",
      },
      {
        y: "10%",
        scrollTrigger: {
          scrub: true,
          start: "top bottom",
          end: "bottom top",
          trigger: rootEl.value!,
        },
      }
    );
  });

  checkContentSize();
});
</script>

<template>
  <div class="row news-item" ref="rootEl">
    <div class="col-md-6">
      <div class="image-container">
        <div
          class="image-content"
          ref="imageEl"
          :style="{ backgroundImage: 'url(\'' + props.item.image.url + '\')' }"
        ></div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="info" ref="contentElm" :style="{ height: textHeight }">
        <h2><PrismicRichText :field="props.item.title" /></h2>

        <div class="text-container rich-text">
          <PrismicRichText :field="props.item.text" />
        </div>

        <div class="action" v-if="props.item.link?.url">
          <PrismicLink
            :field="props.item.link"
            class="cta-link underline"
            :class="props.theme"
          >
            {{ props.item.link_label }} <ArrowLink />
          </PrismicLink>
        </div>
        <div class="gradient-background" v-if="openedHeight > 0"></div>
      </div>
      <a
        href="#"
        class="cta-link underline read-more"
        :class="{ open: opened, [props.theme]: true }"
        v-if="openedHeight > 0"
        @click.prevent="opened = !opened"
      >
        {{ opened ? "CLOSE" : "READ MORE" }} <ArrowLink />
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.news-item {
  .image-container {
    height: 100%;
    border-radius: 18px;
    box-shadow: 0px 15px 60px -40px #00000099;
    border: 1px solid #b1abad;
    max-width: 53rem;
    height: 31.7rem;
    position: relative;
    overflow: hidden;

    .image-content {
      background-size: cover;
      background-position: center center;
      position: absolute;
      width: 100%;
      height: 140%;
      will-change: transform;
      margin-top: -20%;
    }
  }

  .info {
    position: relative;
    padding-left: 1rem;
    overflow: hidden;
    transition: height 0.3s $easeInOutQuint;

    h2 {
      font-family: $primary-font;
      font-weight: 300;
      font-size: 3rem;
      color: $black;
      margin-bottom: 2.5rem;
      margin-top: 4rem;

      @include media-breakpoint-up(md) {
        margin-top: 0;
      }
    }

    .text-container {
      font-family: $secondary-font;
      font-weight: 300;
      font-size: 1.6rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .gradient-background {
      position: absolute;
      width: 100%;
      height: 33px;
      background: linear-gradient(180deg, transparent 0%, #fff 30%);
      bottom: 0;
      margin-bottom: -5px;
    }
  }

  .read-more {
    margin-left: 1rem;
  }

  .action {
    display: inline-block;
  }
}
</style>
