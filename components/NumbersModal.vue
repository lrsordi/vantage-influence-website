<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import IconClose from "@/assets/svg/close.svg?component";
import { usePageStore } from "../stores/page";

const props = defineProps<{
  image?: any;
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
    <div class="orange numbers-modal custom-scroll">
      <img :src="image.url" />
    </div>
  </VueFinalModal>
</template>

<style lang="scss">
.numbers-modal {
  position: relative;
  width: 90vw;
  max-width: 1440px;
  padding: 3rem 0;
  overflow-y: auto;

  border: 1px solid $orange;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0px 15px 50px -25px #00000066;
}
</style>
