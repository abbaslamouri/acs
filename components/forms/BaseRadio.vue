<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <span class="base-radio">
    <input
      type="radio"
      v-bind="$attrs"
      :checked="modelValue === value"
      :value="value"
      @change="$emit('update:modelValue', value)"
    />
    <label :for="$attrs.id" v-if="label">{{ label }}</label>
  </span>
</template>

<style lang="" scoped>
/* @import '@/assets/scss/variables';

.base-radio {
  // border: 1px solid red;
  // background-color: teal;
  margin: 0 auto;
  display: inline-flex;
  // max-width: fit-content;
  align-items: center;
  gap: 0.8rem;

  input {
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
  }
} */
</style>
