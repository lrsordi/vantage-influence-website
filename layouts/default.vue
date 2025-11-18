<template>
  <NuxtLoadingIndicator color="#ec6a06" />
  <Header />
  <div
    id="smooth-content"
    class="wrapper"
    ref="smoothContentEl"
    :style="{ '--vw': `${wWidth}px`, '--vh': `${wHeight}px` }"
  >
    <transition
      name="fade"
      mode="out-in"
      :duration="{ enter: 500, leave: 500 }"
      @after-leave="handleLeaveEvent"
    >
      <div
        class="site-content visible"
        :class="background"
        :key="routePath"
        ref="main"
      >
        <slot />
      </div>
    </transition>
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "../stores/page";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ModalsContainer } from "vue-final-modal";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/dist/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);

const prismic = usePrismic();
const route = useRoute();
const pageStore = usePageStore();

const { pageData } = storeToRefs(pageStore);

const wWidth = ref(0);
const wHeight = ref(0);
const main = ref();
const smoothContentEl = ref<HTMLDivElement>();
let gsapCtx: gsap.Context;
let scrollSmoother: ScrollSmoother;

let scrollAnimations: gsap.core.Tween[] = [];
const clearScrollAnimations = () => {
  scrollAnimations.forEach((tween) => tween.kill());
  scrollAnimations = [];
};

const routePath = computed(() => route.path);
const background = computed(() => pageStore.pageData?.background);

let isHomePage = routePath.value === "/";

watch(pageStore.scroll, (oldValue, newValue) => {
  if (scrollSmoother) {
    scrollSmoother.paused(newValue.pause);
  }
});

watch(routePath, () => {
  isHomePage = routePath.value === "/";
});

watch(pageData, () => {
  animateIn();
});

const { data: layoutData } = await useAsyncData("layout", () =>
  prismic.client.getSingle("layout")
);

// extra call for hydration issues
const { data: page } = await useAsyncData(route.params.uid as string, () => {
  return prismic.client.getByUID(
    "page",
    (route.params.uid as string) || ("home" as string)
  );
});

if (page.value) {
  pageStore.setPageData(page.value.data);
}

if (layoutData.value) {
  pageStore.setLayoutData(layoutData.value.data);
}

useHead({
  meta: computed(() => [
    {
      hid: "keywords",
      name: "keywords",
      content: layoutData.value?.data.seo_keywords,
    },
    {
      hid: "og:image",
      name: "og:image",
      content: layoutData.value?.data.share_image?.url,
    },
    { name: "msapplication-TileColor", content: "#000000" },
    { name: "theme-color", content: "#000000" },
  ]),
  link: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#13443b" },
  ],
});

const handleLeaveEvent = () => {
  if (scrollSmoother) {
    scrollSmoother.scrollTo(0, false);
  }
};

const initScrollSmoother = () => {
  if (window.innerWidth > 990) {
    gsapCtx = gsap.context(() => {
      scrollSmoother = ScrollSmoother.create({
        normalizeScroll: true,
        ignoreMobileResize: true,
        content: window.document.getElementById("smooth-content"),
      });
    }, main.value);
  }
};

const animateIn = () => {
  const isDesktop = wWidth.value > 1024;
  const finalPadding = isDesktop ? 0 : 60;
  clearScrollAnimations();
  const paddingStart = document
    .querySelector("header")
    ?.getBoundingClientRect().height;

  gsap.killTweensOf(smoothContentEl.value!);
  gsap.set(smoothContentEl.value!, { y: 0 });
  gsap.fromTo(
    smoothContentEl.value!,
    {
      paddingTop: `${paddingStart}px`,
    },
    {
      paddingTop: isHomePage ? `${window.innerHeight}px` : finalPadding,
      ease: "power3.inOut",
      duration: 1,
      onComplete: () => {
        scrollSmoother?.refresh();
        ScrollTrigger?.refresh();
      },
    }
  );
};

onMounted(() => {
  wWidth.value = window.innerWidth;
  wHeight.value = window.innerHeight;
  const isDesktop = wWidth.value > 1024;
  const mobileSize = isDesktop ? "246px" : "60px";

  initScrollSmoother();

  window.addEventListener("resize", () => {
    wWidth.value = window.innerWidth;
    wHeight.value = window.innerHeight;
  });

  gsap.set(smoothContentEl.value!, {
    paddingTop: isHomePage ? "100vh" : mobileSize,
  });

  gsap.set(document.body, { opacity: 0 });
  gsap.to(document.body, { opacity: 1, duration: 0.5 });
  animateIn();
});

onUnmounted(() => {
  if (gsapCtx) {
    gsapCtx.revert();
  }
});
</script>

<style lang="scss">
@import "~/assets/styles/base.scss";

.site-content {
  min-height: 100vh;
}

#smooth-content {
  padding-top: 100vh;
  will-change: transform;
}
</style>
