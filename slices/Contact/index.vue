<script setup lang="ts">
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { type Content } from "@prismicio/client";
import { validateForm } from "../../util/form";
import { usePageStore } from "../stores/page";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.ContactSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const pageStore = usePageStore();
const toast = useToast();

const socialLinks = computed(() => pageStore.layoutData?.social_links);
const contactEmail = computed(() => pageStore.layoutData?.contact_email);

const initialValues = {
  name: "",
  email: "",
  company: "",
  message: "",
};

const form = ref({ ...initialValues });
const errors = ref({ ...initialValues });
const loading = ref(false);

const submit = async () => {
  if (isValid()) {
    $fetch("/api/contact", {
      method: "post",
      body: { ...form.value },
    })
      .then((response: any) => {
        loading.value = false;
        form.value = { ...initialValues };
        toast.success("Thanks!", {
          hideProgressBar: true,
          timeout: 2000,
        });
      })
      .catch((error) => {
        loading.value = false;
        toast.error("Server error", {
          hideProgressBar: true,
          timeout: 2000,
        });
        console.error("response", error);
      });
  }
};

const isValid = () => {
  const result = validateForm(Object.keys(initialValues), form.value);

  errors.value = result.errors;
  return result.valid;
};
</script>

<template>
  <section
    class="slice contact-slice"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h2 class="title">{{ slice.primary.title }}</h2>
          <div class="text-container rich-text">
            <PrismicRichText :field="slice.primary.text" />
          </div>

          <h3 class="title">Email</h3>
          <div class="text-container rich-text">
            <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
          </div>

          <h2 class="title">Follow us</h2>
          <ul class="social">
            <li v-for="item in socialLinks" :key="item.icon?.url">
              <PrismicLink :field="item.link">
                <img :src="item.icon.url" />
              </PrismicLink>
            </li>
          </ul>
        </div>

        <div class="col-md-6">
          <form class="form" @submit.prevent="submit()">
            <div class="input-group">
              <label>NAME</label>
              <input v-model="form.name" type="text" :class="errors.name" />
            </div>

            <div class="input-group">
              <label>EMAIL</label>
              <input type="text" v-model="form.email" :class="errors.email" />
            </div>

            <div class="input-group">
              <label>COMPANY</label>
              <input
                type="text"
                v-model="form.company"
                :class="errors.company"
              />
            </div>

            <div class="input-group">
              <label>MESSAGE</label>
              <textarea
                v-model="form.message"
                :class="errors.message"
              ></textarea>
            </div>

            <button type="submit" class="btn-block" :disabled="loading">
              <span v-if="!loading">SUBMIT</span>
              <pulse-loader
                :loading="loading"
                color="#fff"
                size="10px"
              ></pulse-loader>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.contact-slice {
  padding-top: 19rem;
  padding-bottom: 5rem;

  .title {
    font-family: $primary-font;
    font-weight: 300;
    font-size: 3rem;
    color: $black;
  }

  .text-container {
    font-family: $secondary-font;
    font-weight: 300;
    font-size: 2rem;
    line-height: 1.5;
    margin-bottom: 5rem;
    max-width: 43rem;
  }

  ul.social {
    margin: 0;
    padding: 0;
    display: flex;

    li {
      display: flex;
      align-items: center;
      list-style-type: none;
      margin-right: 1rem;

      &:last-child {
        margin-right: 0;
      }

      img {
        filter: invert(1);
        width: 4.5rem;
      }
    }
  }

  .form {
    margin-top: 6rem;

    @include media-breakpoint-up(md) {
      margin-top: 0;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      margin-top: 2rem;

      &:first-child {
        margin-top: 0;
      }

      label {
        font-family: $secondary-font;
        font-weight: 500;
        font-size: 1rem;
        color: $dark-grey;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
      }

      input,
      textarea {
        border: 0;
        background: #f7f7f7;
        font-size: 2rem;
        height: 4.6rem;
        padding: 0 1rem;
        outline: none;
        transition: background 0.5s linear;

        &.error {
          background: rgb(255, 242, 240);
          border: 1px solid #ffccc7;
        }
      }

      textarea {
        height: 16rem;
        resize: none;
      }
    }
  }
}
</style>
