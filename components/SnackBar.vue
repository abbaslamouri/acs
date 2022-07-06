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
      class="snackbar flex flex-row items-center gap-4 fixed z-99999 top-2 p-2 max-w-md text-slate-50 tracking-wide text-sm"
      :class="{
        error: snackbarType === 'Error',
        success: snackbarType === 'Success',
        'top-right': position === 'top-right',
        'top-left': position === 'top-left',
      }"
      v-show="show"
    >
      <div class="icon rounded-1/2">
        <IconsCheck v-if="snackbarType === 'Success'" />
        <IconsError v-else-if="snackbarType === 'Error'" />
      </div>

      <div class="flex-col gap-05">
        <h3 class="text-lg font-bold">{{ title }}</h3>
        <div v-html="message"></div>
      </div>
      <button class="btn btn__close" @click="$emit('hideSnackbar')">
        <IconsClose class="fill-slate-50" />
      </button>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.snackbar {
  &.top-left {
    left: 5rem;
  }

  &.top-right {
    right: 5rem;
  }

  &.error {
    background: $red-700;
    border-left: 1rem solid $red-400;

    .icon {
      background: $red-400;
      // border-radius: 50%;

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
      // border-radius: 50%;

      svg {
        fill: $green-50;
      }
    }
  }
}
</style>
