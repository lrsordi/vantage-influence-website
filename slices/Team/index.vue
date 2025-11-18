<script setup lang="ts">
import { type Content } from "@prismicio/client";
import { useModal } from "vue-final-modal";
import PlusIcon from "@/assets/svg/plus.svg?component";
import BioModal from "../../components/BioModal";
import { usePageStore } from "../../stores/page";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.TeamSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const pageStore = usePageStore();

const teams = computed(() => {
  const groups: any = {};

  props.slice.items.forEach((i: any) => {
    const category = `${i.category}`.toLowerCase();
    if (groups[category]) {
      groups[category].push({ ...i });
    } else {
      groups[category] = [{ ...i }];
    }
  });

  return Object.keys(groups).map((key) => ({
    title: groups[key][0].category,
    members: groups[key],
  }));
});

const showModal = (member: any) => {
  const { open, close } = useModal({
    component: BioModal,
    attrs: {
      member,
      closeModal() {
        close();
      },
    },
  });

  pageStore.pauseScroll(true);
  open();
};
</script>

<template>
  <section
    class="slice team"
    :class="{
      [slice.primary.theme]: true,
      [`bg-${slice.primary.background}`]: true,
    }"
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="container">
      <div class="team-group" v-for="group in teams" :key="group.title">
        <div
          v-if="slice.primary.border_bottom"
          class="horizontal-line top"
          :class="slice.primary.theme"
        ></div>
        <div
          v-if="slice.primary.border_bottom"
          class="horizontal-line bottom"
          :class="slice.primary.theme"
        ></div>

        <div class="title" v-if="group.title">
          <div class="bar"></div>
          <h2>{{ group.title }}</h2>
          <div class="bar"></div>
        </div>

        <div class="member-container">
          <div
            class="member"
            v-for="member in group.members"
            :key="member.name"
            @click.prevent="showModal(member)"
          >
            <div class="name">{{ member.name }}</div>
            <div class="position" v-if="member.position">
              <PrismicRichText :field="member.position" />
            </div>
            <div class="action">
              <PlusIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.team {
  padding: 11rem 0;

  &.bg-solid {
    background: linear-gradient(
        118.23deg,
        #ecf1f3 13.96%,
        rgba(236, 241, 243, 0) 93.93%
      ),
      linear-gradient(0deg, #ffffff, #ffffff);
  }

  .team-group {
    position: relative;

    .title {
      display: flex;
      justify-content: center;
      h2 {
        font-family: $primary-font;
        font-weight: 300;
        font-size: 2.5rem;
        color: $orange;
        position: relative;
        padding: 0 2rem;
      }

      .bar {
        flex: 1;
        position: relative;

        &::after {
          content: " ";
          position: absolute;
          top: 50%;
          left: 0;
          background: $orange;
          height: 1px;
          width: 100%;
        }
      }
    }

    .member-container {
      padding: 6.3rem 0;
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;
      row-gap: 4rem;

      .member {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        cursor: pointer;

        @include media-breakpoint-up(md) {
          width: auto;
        }

        .name {
          font-family: $primary-font;
          font-size: 2.5rem;
          font-weight: 300;
          color: $black;
        }

        .position {
          font-family: $secondary-font;
          font-size: 1.2rem;
          font-weight: 300;
          color: $black;
          text-transform: uppercase;
          text-align: center;
          margin-top: 0.3rem;

          strong {
            font-weight: 700;
          }

          > div {
            p {
              margin-bottom: 0.3rem;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }

        .action {
          margin-top: 1.1rem;

          svg {
            transition: all 0.5s $easeOutQuint;
          }
        }

        &:hover {
          .action {
            svg {
              transform: rotate(180deg) scale(1.2);
            }
          }
        }
      }
    }
  }
}
</style>
