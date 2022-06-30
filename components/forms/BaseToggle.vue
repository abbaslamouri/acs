<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  toogleHeight: {
    type: Number,
    default: 18,
  },
  direction: {
    type: String,
    default: 'horizontal',
    validator: (value) => {
      return !value || ['horizontal', 'vertical'].includes(value)
    },
  },
})
defineEmits(['update:modelValue'])
const attrs = useAttrs()
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <!-- <div class="base-toggle flex items-center gap-4"> -->
  <label class="toggle" :class="{ vertical: direction === 'vertical' }">
    <span> {{ label }}</span>
    <input
      class=""
      type="checkbox"
      :checked="modelValue"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="slider round"></span>
  </label>
  <!-- </div> -->
</template>

<style lang="" scoped>
/* @import '@/assets/scss/variables';

.toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  // border: 1px solid red;

  &.vertical {
    flex-direction: column;
  }

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: $slate-800;

      &:before {
        left: 53.125%;
      }
    }
  }

  .slider {
    position: relative;
    display: block;
    cursor: pointer;
    background-color: $slate-300;
    transition: 0.3s;
    width: v-bind('`${2*toogleHeight}px`');
    height: v-bind('`${toogleHeight}px`');

    &:before {
      content: '';
      position: absolute;
      width: v-bind('`${.75*toogleHeight}px`');
      height: v-bind('`${.75*toogleHeight}px`');
      background-color: $slate-50;
      transition: 0.3s;
      top: 50%;
      left: v-bind('`${.25*toogleHeight}%`');
      transform: translateY(-50%);
    }

    &.round {
      border-radius: v-bind('`${.5*toogleHeight}px`');

      &::before {
        border-radius: 50%;
      }
    }
  }
} */
</style>
