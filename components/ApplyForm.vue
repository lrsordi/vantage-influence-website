<template>
  <div class="apply-form">
    <h3>Apply now:</h3>

    <form>
      <div class="row">
        <div class="col-md-6">
          <div class="input-group" :class="errors.name">
            <label>NAME</label>
            <input type="text" v-model="form.name" />
          </div>
        </div>

        <div class="col-md-6">
          <div class="input-group" :class="errors.email">
            <label>EMAIL</label>
            <input type="email" v-model="form.email" />
          </div>
        </div>

        <div class="col-md-12" v-if="props.itemData.field_osint_example">
          <div class="input-group" :class="errors.osint">
            <label
              >Please provide an example of OSINT and how you’ve utilized it in
              a previous project or investigation</label
            >
            <textarea v-model="form.osint"></textarea>
          </div>
        </div>

        <div
          class="col-md-12"
          v-if="props.itemData.field_investigation_industry"
        >
          <div class="input-group" :class="errors.obs">
            <label
              >Please describe 3 areas within the investigations industry that
              you find particularly interesting</label
            >
            <textarea v-model="form.obs"></textarea>
          </div>
        </div>

        <div class="col-md-6">
          <div class="input-group" :class="errors.cv">
            <label>CV</label>
            <label class="file-input" :for="`cv-file-${props.index}`">
              <div class="file-name">{{ form.cv?.name }}</div>
              <div class="button">Browse files</div>
            </label>
            <input
              type="file"
              @change="onFileChanged($event, 'cv')"
              :id="`cv-file-${props.index}`"
              class="file"
            />
          </div>
        </div>

        <div class="col-md-6">
          <div class="input-group" :class="errors.cl">
            <label>COVER LETTER</label>
            <label class="file-input" :for="`cl-file-${props.index}`">
              <div class="file-name">{{ form.cl?.name }}</div>
              <div class="button">Browse files</div>
            </label>
            <input
              type="file"
              @change="onFileChanged($event, 'cl')"
              :id="`cl-file-${props.index}`"
              class="file"
            />
          </div>
        </div>
      </div>

      <button class="btn-block" @click.prevent="submit()" :disabled="loading">
        <span v-if="!loading">APPLY</span>
        <pulse-loader
          :loading="loading"
          color="#fff"
          size="10px"
        ></pulse-loader>
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { validateForm } from "../util/form";

const props = defineProps(["position", "index", "itemData"]);
const initialValues = {
  name: "",
  email: "",
  cv: null,
  cl: null,
  osint: "",
  obs: "",
};

const form = ref({ ...initialValues });
const errors = ref({ ...initialValues });
const loading = ref(false);

const toast = useToast();

const onFileChanged = (event: any, field: string) => {
  form.value = {
    ...form.value,
    [field]: event.target.files[0],
  };
};

const submit = async () => {
  if (isValid()) {
    loading.value = true;
    let formData = new FormData();

    formData.append("position", props.position);
    formData.append("name", form.value.name);
    formData.append("email", form.value.email);
    formData.append("osint", form.value.osint);
    formData.append("obs", form.value.obs);
    formData.append("files", form.value.cv);
    formData.append("files", form.value.cl);

    $fetch("/api/apply", {
      method: "POST",
      body: formData,
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
  const values: any = { ...initialValues };
  if (!props.itemData.field_osint_example) {
    delete values.osint;
  }
  if (!props.itemData.field_investigation_industry) {
    delete values.obs;
  }

  const result = validateForm(Object.keys(values), form.value);

  errors.value = result.errors;
  return result.valid;
};
</script>

<style lang="scss">
.apply-form {
  h3 {
    font-family: $secondary-font;
    font-weight: 700;
    font-size: 2rem;
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
    color: $black;
  }

  .input-group {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;

    label {
      font-family: $secondary-font;
      font-weight: 500;
      font-size: 1rem;
      color: $dark-grey;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .file-input {
      display: flex;
      background: #f7f7f7;
      height: 4.6rem;
      cursor: pointer;
      transition: all 0.5s linear;

      .file-name {
        flex: 1;
        display: flex;
        align-items: center;
        font-family: $secondary-font;
        font-weight: 500;
        font-size: 1rem;
        color: $light-grey;
        padding: 0 1rem;
      }

      .button {
        display: flex;
        align-items: center;
        font-family: $secondary-font;
        font-weight: 500;
        font-size: 1rem;
        color: $white;
        padding: 0 2.5rem;
        border: 0;
        background: $black;
        text-transform: uppercase;
      }
    }

    input,
    textarea {
      border: 0;
      background: #f7f7f7;
      font-size: 2rem;
      height: 4.6rem;
      padding: 0 1rem;
      transition: all 0.5s linear;
      outline: none;
    }

    textarea {
      min-height: 10rem;
    }

    .file {
      display: none;
    }

    &.error {
      input,
      textarea {
        background: rgb(255, 242, 240);
        border: 1px solid #ffccc7;
      }

      .file-input {
        background: rgb(255, 242, 240);
        border: 1px solid #ffccc7;
      }
    }
  }
}
</style>
