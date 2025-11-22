<template>
  <footer class="footer">
    <div class="container">
      <div class="logo">
        <NuxtLink to="/">
          <Logo />
        </NuxtLink>
      </div>

      <div class="row">
        <div class="col-md-5">
          <div class="links-container">
            <div>
              <ul class="menu">
                <li v-for="menu in headerLinks" :key="menu.label">
                  <PrismicLink :field="menu.link">
                    {{ menu.label }}
                  </PrismicLink>
                </li>
              </ul>
            </div>
            <div class="extra-links">
              <ul class="menu">
                <li v-if="privacyPolicy.url">
                  <PrismicLink :field="privacyPolicy">
                    Privacy Policy
                  </PrismicLink>
                </li>
                <li v-if="termsOfUse.url">
                  <PrismicLink :field="termsOfUse"> Terms of Use </PrismicLink>
                </li>
              </ul>

              <ul class="social">
                <li class="text">FOLLOW US</li>
                <li v-for="item in socialLinks" :key="item.icon?.url">
                  <PrismicLink :field="item.link">
                    <img :src="item.icon.url" />
                  </PrismicLink>
                </li>
              </ul>

              <div class="contact-info">
                <a :href="`mailto:${contactEmail}`">
                  {{ contactEmail }}
                </a>
              </div>
            </div>
            <div class="awards">
              <ul>
                <li v-for="item in awards" :key="item.image?.url">
                  <PrismicLink :field="item.link">
                    <img :src="item.image.url" />
                  </PrismicLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="offset-md-1 col-md-6 col-lg-6 d-none d-md-block">
          <div class="contact">
            <h4>Contact us</h4>
            <form @submit.prevent="submit()">
              <div class="two-column form-row">
                <div>
                  <div class="input-group" :class="errors.name">
                    <label>NAME*</label>
                    <input v-model="form.name" />
                  </div>
                </div>
                <div>
                  <div class="input-group" :class="errors.email">
                    <label>EMAIl*</label>
                    <input v-model="form.email" />
                  </div>
                </div>
              </div>
              <div class="form-row">
                <div class="input-group" :class="errors.company">
                  <label>COMPANY*</label>
                  <input v-model="form.company" />
                </div>
              </div>
              <div class="form-row textarea">
                <div class="input-group" :class="errors.message">
                  <label>MESSAGE*</label>
                  <textarea
                    v-model="form.message"
                    @keydown.ctrl.enter="submit"
                  />
                </div>
              </div>
              <button type="submit" style="display: none"></button>
            </form>
          </div>
        </div>
      </div>

      <div class="copyright">
        {{ copyright }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Logo from "@/assets/svg/influence.svg?component";
import { usePageStore } from "../stores/page";
import { validateForm } from "../util/form";

const pageStore = usePageStore();
const toast = useToast();

const headerLinks = computed(() => pageStore.layoutData?.links);
const privacyPolicy = computed(() => pageStore.layoutData?.privacy_policy);
const termsOfUse = computed(() => pageStore.layoutData?.terms_of_use);
const socialLinks = computed(() => pageStore.layoutData?.social_links);
const awards = computed(() => pageStore.layoutData?.awards);
const contactEmail = computed(() => pageStore.layoutData?.contact_email);
const copyright = computed(() => pageStore.layoutData?.copyright);

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

<style lang="scss">
.footer {
  padding: 4.2rem 0;
  background: $black;

  .logo {
    text-align: center;
    margin-bottom: 4rem;

    svg {
      width: 19.1rem;
      path {
        fill: #fff !important;
      }
    }

    @include media-breakpoint-up(md) {
      text-align: left;
    }
  }

  .links-container {
    display: flex;
    justify-content: space-between;
    margin-top: 3.5rem;

    ul.menu {
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;

      li {
        font-family: $secondary-font;
        text-transform: uppercase;
        list-style-type: none;
        margin-bottom: 1.5rem;

        &:last-child {
          margin-bottom: 0;
        }

        a {
          font-size: 1rem;
          font-weight: 500;
          color: $white;
          text-transform: uppercase;
          text-decoration: none;

          position: relative;

          &:after {
            content: "";
            width: 100%;
            height: 2px;
            background: $orange;
            position: absolute;
            bottom: -0.6rem;
            left: 0;
            transform-origin: top left;
            transition: transform 0.5s $easeInOutQuint;
            transform: scale3d(0, 1, 1);
          }

          &:hover,
          &.nuxt-link-active {
            &:after {
              transform-origin: top left;
              transform: scale3d(1, 1, 1);
            }
          }

          &.nuxt-link-active {
            font-weight: 700;
          }
        }
      }
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

        &.text {
          color: $light-grey;
          font-size: 1rem;
          font-family: $secondary-font;
          font-weight: 500;
          text-transform: uppercase;
        }
      }
    }

    .contact-info {
      a {
        color: $light-grey;
        font-size: 1rem;
        font-family: $secondary-font;
        font-weight: 500;
        text-transform: uppercase;
        text-decoration: none;
        transition: all 0.3s linear;

        &:hover {
          color: $white;
        }
      }
    }

    .extra-links {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .awards {
      display: flex;
      align-items: flex-end;

      ul {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;

        li {
          list-style-type: none;
          margin-top: 2rem;

          &:first-child {
            margin-top: 0;
          }

          img {
            width: 15rem;
          }
        }
      }
    }
  }

  .contact {
    display: flex;
    flex-direction: column;
    height: 100%;

    h4 {
      font-size: 3rem;
      font-weight: 300;
      color: $light-grey;
    }

    form {
      flex: 1;
      display: flex;
      flex-direction: column;

      .form-row {
        margin-bottom: 1rem;

        &.textarea {
          flex: 1;
          margin-bottom: 0;

          .input-group {
            height: 100%;
            align-items: flex-start;
          }
        }
      }

      .two-column {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 10px;
      }

      .input-group {
        display: flex;
        align-items: center;
        background: rgba(177, 171, 173, 0.1);
        border-radius: 5px;
        padding: 1rem;
        transition: all 0.5s linear;

        &.error {
          background: rgb(255 216 210);
          border: 1px solid #ffccc7;

          input,
          textarea {
            color: $black;
          }
        }

        label {
          color: $dark-grey;
          font-size: 1rem;
          font-family: $secondary-font;
          font-weight: 500;
          text-transform: uppercase;
          margin-right: 0.5rem;
        }

        input,
        textarea {
          flex: 1;
          background: transparent;
          color: $white;
          border: 0;
          outline: none;
          font-size: 1.2rem;
          font-family: $secondary-font;
          font-weight: 500;
        }

        textarea {
          height: 100%;
          resize: none;
        }
      }
    }
  }

  .copyright {
    margin-top: 11rem;
    color: $dark-grey;
    font-family: $secondary-font;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
  }
}
</style>
