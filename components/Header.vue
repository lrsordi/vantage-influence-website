<template>
  <header class="header" ref="headerEl" :class="{ dark: pageData.dark_header }">
    <div
      class="background"
      :style="{ backgroundImage: `url(${pageData.header_background?.url})` }"
    />

    <div class="container px-5" ref="menuContainerEl">
      <div class="row">
        <div class="offset-lg-1 col-lg-10 col-links">
          <nav class="menu">
            <NuxtLink to="/" class="mini-logo" ref="miniLogoEl"
              >Mini Logo<MiniLogo
            /></NuxtLink>
            <ul>
              <li
                v-for="(menu, index) in headerLinks"
                :key="`menu-item-${index}`"
              >
                <PrismicLink :field="menu.link">
                  {{ menu.label }}
                </PrismicLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <div class="container px-5 logo-container">
      <NuxtLink to="/">
        <div ref="logoContainerEl" class="logo-element">
          <Logo ref="logoEl" />
        </div>
        <div
          class="headline"
          ref="headlineEl"
          v-html="layoutData.hero_headline.replace(/\n/g, '<br />')"
        ></div>
        <div class="headline-arrow" ref="headlineArrowEl"></div>
      </NuxtLink>
    </div>
  </header>
  <nav
    class="menu-mobile"
    :class="{ dark: false, opened: menuOpened }"
    :style="{ backgroundImage: `url(/imgs/bg-banner.jpg)`, opacity: 0 }"
  >
    <div class="layer"></div>
    <NuxtLink to="/" class="mini-logo">Mini Logo<MiniLogo /></NuxtLink>
    <ul>
      <li v-for="(menu, index) in headerLinks" :key="`menu-item-${index}`">
        <PrismicLink :field="menu.link">
          {{ menu.label }}
        </PrismicLink>
      </li>
    </ul>
  </nav>
  <div
    class="hamburguer-icon"
    @click="menuOpened = !menuOpened"
    :class="{
      dark: menuOpened ? false : pageData.dark_header,
      opened: menuOpened,
    }"
  >
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<script setup lang="ts">
import { usePageStore } from "../stores/page";
import { gsap } from "gsap";
import Logo from "@/assets/svg/logo.svg?component";
import MiniLogo from "@/assets/svg/mini-logo.svg?skipsvgo";
import type { NuxtLink } from "#build/components";

const RETRACTED_SIZE = 80;
const MOBILE_RETRACTED_SIZE = 60;
const EXPANDED_SIZE = 1;
const MIN_SIZE = 246;

let finRetractedSize = RETRACTED_SIZE;

const pageStore = usePageStore();
const headerEl = ref<HTMLHeadElement>();
const logoContainerEl = ref<HTMLDivElement>();
const menuContainerEl = ref<HTMLDivElement>();
const headlineEl = ref<HTMLDivElement>();
const headlineArrowEl = ref<HTMLDivElement>();
const miniLogoEl = ref<typeof NuxtLink>();
const { pageData, layoutData } = storeToRefs(pageStore);
const menuOpened = ref<boolean>(false);

const route = useRoute();
let isHomePage = route.fullPath === "/";
const headerLinks = computed(() => pageStore.layoutData?.links);

let ctx = gsap.context(() => {});
let scrollAnimations: gsap.core.Tween[] = [];
let miniLogoVisible = false;
let isDesktop = true;

const clearScrollAnimations = () => {
  scrollAnimations.forEach((tween) => tween.kill());
  scrollAnimations = [];
};

const animateIn = () => {
  const isDesktop = window.innerWidth > 1024;
  clearScrollAnimations();
  gsap.killTweensOf(headerEl.value!);
  gsap.fromTo(
    headerEl.value!,
    {
      height: headerEl.value!.getBoundingClientRect().height,
      paddingBottom: 0,
    },
    {
      height: isHomePage ? `${EXPANDED_SIZE * 100}vh` : `${finRetractedSize}px`,
      paddingBottom: isHomePage ? 120 : 0,
      ease: "power3.inOut",
      duration: 1,
    }
  );

  let logoHeight = isHomePage ? "180px" : "90px";

  if (!isDesktop) {
    logoHeight = "100px";
  }
  gsap.to(logoContainerEl.value!, {
    height: logoHeight,
    y: 0,
    ease: "power3.inOut",
    duration: 1,
  });
  gsap.to(headlineEl.value!, {
    opacity: isHomePage ? 1 : 0,
    y: 0,
    scaleX: isHomePage ? 1 : 0.6,
    scaleY: isHomePage ? 1 : 0.6,
    ease: "power3.inOut",
    duration: 1,
    delay: isHomePage ? 0.8 : 0,
  });
  gsap.to(headlineArrowEl.value!, {
    opacity: isHomePage ? 1 : 0,
    y: 0,
    ease: "power3.inOut",
    duration: 1,
    delay: isHomePage ? 1 : 0,
    onComplete: () => {
      startScroll();
    },
  });
};

const startScroll = () => {
  const isDesktop = window.innerWidth > 1024;
  pageStore.pauseScroll(false);
  clearScrollAnimations();
  scrollAnimations.push(
    gsap.fromTo(
      headerEl.value!,
      {
        height: isHomePage
          ? `${EXPANDED_SIZE * 100}vh`
          : `${finRetractedSize}px`,
        paddingBottom: isHomePage ? 120 : 0,
      },
      {
        height: `${finRetractedSize}px`,
        ease: "none",
        paddingBottom: 0,
        scrollTrigger: {
          scrub: 0,
          start: 0,
          end: isHomePage
            ? window.innerHeight * EXPANDED_SIZE - finRetractedSize
            : MIN_SIZE - finRetractedSize,
        },
      }
    )
  );

  scrollAnimations.push(
    gsap.fromTo(
      headlineEl.value!,
      { scaleX: 1, scaleY: 1, opacity: isHomePage ? 1 : 0 },
      {
        opacity: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        y: -10,
        scrollTrigger: {
          scrub: 0.8,
          start: 0,
          end: window.innerHeight * EXPANDED_SIZE * 0.3 + finRetractedSize,
        },
      }
    )
  );

  scrollAnimations.push(
    gsap.fromTo(
      headlineArrowEl.value!,
      { scaleX: 1, scaleY: 1, opacity: isHomePage ? 1 : 0 },
      {
        opacity: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        y: 50,
        scrollTrigger: {
          scrub: 0.8,
          start: 0,
          end: window.innerHeight * EXPANDED_SIZE * 0.3 + finRetractedSize,
        },
      }
    )
  );

  let logoHeight = isHomePage ? "180px" : "90px";

  if (!isDesktop) {
    logoHeight = "100px";
  }

  scrollAnimations.push(
    gsap.fromTo(
      logoContainerEl.value!,
      { height: logoHeight, y: 0 },
      {
        height: isDesktop ? "90px" : "50px",
        scrollTrigger: {
          scrub: 1.1,
          start: 0,
          end: window.innerHeight * EXPANDED_SIZE + finRetractedSize,
        },
      }
    )
  );

  scrollAnimations.push(
    gsap.fromTo(
      logoContainerEl.value!,
      { y: 0 },
      {
        y: 10,
        scrollTrigger: {
          scrub: true,
          start: 0,
          end: isHomePage
            ? window.innerHeight * EXPANDED_SIZE - finRetractedSize
            : MIN_SIZE - finRetractedSize,
        },
      }
    )
  );
};

const handleWindowScroll = () => {
  let maxScroll = isHomePage
    ? window.innerHeight * 0.8
    : MIN_SIZE - RETRACTED_SIZE;

  if (isHomePage) {
    if (window.scrollY > maxScroll) {
      if (!miniLogoVisible) {
        miniLogoVisible = true;
        toggleMiniLogo();
      }
    } else {
      if (miniLogoVisible) {
        miniLogoVisible = false;
        toggleMiniLogo();
      }
    }
  }
};

const toggleMiniLogo = () => {
  gsap.killTweensOf(miniLogoEl.value!.$el);
  gsap.killTweensOf(miniLogoEl.value!.$el.children[0]);
  gsap.to(miniLogoEl.value!.$el, {
    width: miniLogoVisible ? 40 : 0,
    marginRight: miniLogoVisible ? 30 : 0,
    ease: "power3.inOut",
    duration: 0.5,
  });
  gsap.set(miniLogoEl.value!.$el, {
    pointerEvents: miniLogoVisible ? "auto" : "none",
  });

  gsap.to(miniLogoEl.value!.$el.children[0], {
    opacity: miniLogoVisible ? 1 : 0,
    ease: "power3.out",
    duration: miniLogoVisible ? 1 : 0.3,
    delay: miniLogoVisible ? 0.3 : 0,
  });
};

watch(pageData, () => {
  ctx.kill();
  animateIn();
});

watch(
  () => route.params.uid,
  () => {
    menuOpened.value = false;
    isHomePage = route.fullPath === "/";
    clearScrollAnimations();
    pageStore.pauseScroll(true);

    if (isHomePage) {
      miniLogoVisible = false;
    } else {
      miniLogoVisible = true;
    }

    toggleMiniLogo();
  }
);

onMounted(() => {
  isDesktop = window.innerWidth > 1024;
  finRetractedSize = isDesktop ? RETRACTED_SIZE : MOBILE_RETRACTED_SIZE;
  pageStore.pauseScroll(true);
  gsap.set(miniLogoEl.value!.$el, {
    width: 0,
    marginRight: 0,
  });

  gsap.set(headerEl.value!, {
    height: isHomePage ? "100vh" : `${finRetractedSize}px`,
  });

  let logoHeight = isHomePage ? "180px" : "90px";

  if (!isDesktop) {
    logoHeight = "100px";
  }

  gsap.set(logoContainerEl.value!, {
    height: logoHeight,
  });
  gsap.set(headlineEl.value!, {
    opacity: 0,
    y: 10,
  });
  gsap.set(headlineArrowEl.value!, {
    opacity: 0,
    y: 10,
  });

  gsap.fromTo(
    menuContainerEl.value!,
    {
      y: -10,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      ease: "power3.inOut",
      duration: 1,
      delay: 0.8,
    }
  );

  if (!isHomePage) {
    miniLogoVisible = true;
  }
  toggleMiniLogo();
  window.addEventListener("scroll", handleWindowScroll);
  animateIn();
});
</script>

<style lang="scss">
.menu-mobile {
  display: block;
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-color: #fff;
  transition:
    background 0.6s linear 0.1s,
    opacity 0.3s linear;
  pointer-events: none;
  opacity: 0;

  & > * li {
    opacity: 0;
    transition:
      transform 0.3s $easeInOutQuint,
      opacity 0.3s linear;
    transform: translate3d(0px, 10px, 0px);
  }

  div.layer {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }

  &.opened {
    opacity: 1 !important;
    pointer-events: all;

    & > * li {
      opacity: 1;
      transform: translate3d(0px, 0px, 0px) !important;

      transition:
        transform 0.6s $easeInOutQuint,
        opacity 0.3s linear !important;

      @for $i from 0 through 40 {
        &:nth-child(#{$i}) {
          transition-delay: ($i * 0.06s) !important;
        }
      }
    }
  }

  .mini-logo {
    width: 60px;
    height: 60px;
    font-size: 0px;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    display: block;
    margin-top: 10px;
    svg {
      width: 50px;
      height: 50px;
      top: 5px;
      position: relative;
      margin-left: 5px;
    }
  }

  &.dark {
    ul li a {
      color: #1d1d1b !important;
    }
    .headline {
      color: #1d1d1b !important;
    }
    svg path {
      fill: #1d1d1b !important;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: calc(100vh - 240px);
    position: fixed;
    top: 120px;
    width: 100vw;
    align-items: center;

    li {
      font-family: $secondary-font;
      text-transform: uppercase;
      list-style-type: none;
      flex-grow: 1;

      a {
        font-size: min(20px, 3vh);
        font-weight: 500;
        color: $white;
        text-transform: uppercase;
        text-decoration: none;
        transition:
          font-weight 0.3s linear,
          color 0.3s linear;
        position: relative;

        &:after {
          content: "";
          width: 100%;
          height: 2px;
          background: $orange;
          position: absolute;
          bottom: -0.6rem;
          left: 0;
          transform-origin: top right;
          transition: transform 0.5s $easeInOutQuint;
          transform: scale3d(0, 1, 1);
        }

        &:hover,
        &.router-link-active {
          &:after {
            transform-origin: top left;
            transform: scale3d(1, 1, 1);
          }
        }

        &.router-link-active {
          pointer-events: none;
        }
      }
    }
  }
}
.header {
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 5;
  background: $light-grey;
  will-change: height;
  box-shadow: 0px 15px 60px -25px #00000099;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @include media-breakpoint-up(md) {
    padding-bottom: 120px;
  }

  &.dark {
    ul li a {
      color: #1d1d1b !important;
    }
    .headline {
      color: #1d1d1b !important;
    }
    svg path {
      fill: #1d1d1b !important;
    }
  }

  &:before {
    content: "";
    width: 100%;
    height: 80px;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    top: 0;
    left: 0;
    position: absolute;
    pointer-events: none;
    z-index: 6;
  }

  .container {
    z-index: 7;
    position: relative;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    transition: background 0.6s linear 0.1s;

    // &:after {
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   background: rgba(0, 0, 0, 0.2);
    // }
  }

  .logo-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    a {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      background: transparent;
      color: #fff;
    }

    svg {
      height: 100%;
      position: relative;
      margin: 0 auto;
      path {
        fill: #fff;
        transition: fill 0.3s linear;
      }
    }

    .logo-element {
      position: relative;
      will-change: height;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;

      @include media-breakpoint-up(md) {
        height: min(130px, 12vh);
      }
    }

    .headline {
      //position: absolute;
      //bottom: 30px;
      // left: 50%;
      // transform: translateX(-50%);
      color: #fff;
      text-decoration: none;
      text-align: center;
      line-height: 1.2;
      font-size: 5vw;
      text-wrap: balance;
      transition: color 0.3s linear;
      z-index: 999;
      margin-top: 7rem;
      //width: 100%;

      @include media-breakpoint-up(md) {
        bottom: 0;
        font-size: min(30px, 3vh);
        max-width: min(550px, 50vh);
      }
    }

    .headline-arrow {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      background: $orange;
      top: calc(100% + 8rem);
      height: 50vh;
    }
  }

  .menu {
    align-items: center;
    height: 60px;

    @include media-breakpoint-up(md) {
      height: 80px;
      position: relative;
      display: flex;
      visibility: visible;
    }

    .mini-logo {
      margin-right: 40px;
      font-size: 0px;
      position: relative;
      svg {
        width: 40px;
        height: 40px;
        top: 5px;
        position: absolute;
      }

      @include media-breakpoint-up(md) {
        width: 40px;
        height: 40px;
        svg {
          width: 30px;
          height: 30px;
        }
      }
    }

    ul {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
      visibility: hidden;

      @include media-breakpoint-up(md) {
        visibility: visible;
      }

      li {
        font-family: $secondary-font;
        text-transform: uppercase;
        list-style-type: none;

        a {
          font-size: 1.2rem;
          font-weight: 500;
          color: $white;
          text-transform: uppercase;
          text-decoration: none;
          transition:
            font-weight 0.3s linear,
            color 0.3s linear;
          position: relative;

          &:after {
            content: "";
            width: 100%;
            height: 2px;
            background: $orange;
            position: absolute;
            bottom: -0.6rem;
            left: 0;
            transform-origin: top right;
            transition: transform 0.5s $easeInOutQuint;
            transform: scale3d(0, 1, 1);
          }

          &:hover,
          &.router-link-active {
            &:after {
              transform-origin: top left;
              transform: scale3d(1, 1, 1);
            }
          }

          &.router-link-active {
            pointer-events: none;
          }
        }
      }
    }
  }
}
.hamburguer-icon {
  width: 80px;
  height: 60px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;

  span {
    width: 30px;
    height: 2px;
    background: #fff;
    position: absolute;
    top: 22px;
    left: 20px;
    transition:
      background 0.3s linear,
      transform 0.3s $easeOutQuint;

    &:nth-child(2) {
      margin-top: 7px;
    }

    &:nth-child(3) {
      margin-top: 14px;
      transform-origin: center left;
    }

    &:first-child {
      transform-origin: center left;
    }
  }

  @include media-breakpoint-up(md) {
    display: none;
  }

  &.dark {
    span {
      background: $orange;
    }
  }

  &.opened {
    span:nth-child(2) {
      transform: scaleX(0);
    }
    span:first-child {
      transform: rotate(45deg) translate3d(2px, -7px, 0px);
    }
    span:nth-child(3) {
      transform: rotate(-45deg) translate3d(2px, 7px, 0px);
    }
  }
}
</style>
