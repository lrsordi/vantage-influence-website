<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import IconClose from "@/assets/svg/close.svg?component";
import { usePageStore } from "../stores/page";

const props = defineProps<{
  member?: any;
  closeModal: Function;
}>();

const pageStore = usePageStore();

const onClose = () => {
  pageStore.pauseScroll(false);
};
</script>

<template>
  <VueFinalModal
    class="modal"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    @closed="onClose()"
  >
    <button class="btn-close" @click.prevent="props.closeModal()">
      <IconClose />
    </button>
    <div class="orange bio-modal custom-scroll">
      <h1>{{ member.name }}</h1>
      <div class="position">{{ $prismic.asText(member.position) }}</div>
      <div class="email">
        <a :href="`mailto:${member.email}`">{{ member.email }}</a>
      </div>
      <div class="text-container rich-text">
        <PrismicRichText :field="member.description" />
      </div>
    </div>
  </VueFinalModal>
</template>

<style lang="scss">
.bio-modal {
  position: relative;
  width: 91rem;
  max-width: 90vw;
  padding: 5rem 9rem;
  max-height: 80vh;
  overflow-y: auto;

  border: 1px solid $orange;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 15px 50px -25px #00000066;

  h1 {
    position: relative;
    z-index: 3;
    font-family: $primary-font;
    font-weight: 300;
    font-size: 2.5rem;
    color: $dark-grey;
    margin-bottom: 0;
  }

  .position {
    position: relative;
    z-index: 3;
    font-family: $secondary-font;
    font-size: 1.6rem;
    font-weight: 400;
    color: $black;

    strong {
      font-weight: 700;
    }
  }

  .email {
    position: relative;
    z-index: 3;
    a {
      font-family: $secondary-font;
      font-size: 1.6rem;
      font-weight: 400;
      color: $black;
      text-decoration: underline;
    }
  }

  .text-container {
    position: relative;
    z-index: 3;
    font-family: $secondary-font;
    font-size: 1.6rem;
    font-weight: 300;
    color: $black;
    margin-top: 4rem;
    line-height: 1.7;

    strong {
      font-weight: 700;
    }
  }
}
</style>
