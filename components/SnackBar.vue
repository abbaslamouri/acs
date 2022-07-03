<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: [String, Number],
    default: 30,
  },
  snackbarType: {
    type: String,
    default: 'Error',
    validator: (value) => {
      return !value || ['Success', 'Warning', 'Error', 'Info'].includes(value)
    },
  },
  position: {
    type: String,
    default: 'top-right',
  },
})

const emit = defineEmits(['hideSnackbar'])

let timeout = ref(null)
const getPosition = () => (['top-right', 'top-left'].includes(props.position) ? props.position : 'top-left')

watchEffect(() => {
  clearTimeout(timeout.value)
  if (props.duration != 0) {
    if (props.show) {
      timeout.value = setTimeout(() => {
        emit('hideSnackbar')
      }, props.duration * 1000)
    }
  }
})

const title = computed(() =>
  props.title ? props.title : props.snackbarType.charAt(0).toUpperCase() + props.snackbarType.slice(1)
)
const transitionName = computed(() => (getPosition().includes('right') ? 'rtl' : 'ltr'))
</script>

<template>
  <transition :name="transitionName">
    <div
      class="snackbar flex-row items-center gap-2 fixed z-9999 top-7 p-2 max-w-100 text-slate-50 tracking-wide text-sm"
      :class="{
        error: snackbarType === 'Error',
        success: snackbarType === 'Success',
        'top-right': position === 'top-right',
        'top-left': position === 'top-left',
      }"
      v-show="show"
    >
      <div class="icon">
        <!-- <IconsSuccess v-if="snackbarType === 'Success'" /> -->
        <!-- <IconsError v-else-if="snackbarType === 'Error'" /> -->
      </div>

      <div class="flex-col gap-05">
        <h3>{{ title }}</h3>
        <div v-html="message"></div>
      </div>
      <button class="btn btn__close" @click="$emit('hideSnackbar')">
        <!-- <IconsClose class="fill-slate-50" /> -->
      </button>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import '@/assets/variables';

.snackbar {
  &.top-left {
    left: 5rem;
  }

  &.top-right {
    right: 5rem;
  }

  svg {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.4rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .btn {
    border: none;
  }

  &.error {
    background: $red-700;
    border-left: 1rem solid $red-400;

    .icon {
      background: $red-400;
      border-radius: 50%;

      svg {
        fill: $red-50;
      }
    }
  }

  &.success {
    background: $green-700;
    border-left: 1rem solid $green-400;

    .icon {
      background: $green-400;
      border-radius: 50%;

      svg {
        fill: $green-50;
      }
    }
  }
}
</style>
