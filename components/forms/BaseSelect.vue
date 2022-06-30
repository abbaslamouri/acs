<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  nullOption: {
    type: String,
    defualt: 'Select Option',
  },
})
const emit = defineEmits(['update:modelValue'])

const errorMsg = ref('')
const uuid = useUniqueId().getId()
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label :class="`base-select base-select-${uuid}`" v-if="label" :for="`base-select-${uuid}`">
    <div class="label text-xs px-1">{{ label }}</div>
    <select
      ref="selectRef"
      :value="modelValue"
      :class="`base-select-${uuid}`"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ nullOption }}</option>
      <option
        v-for="option in options"
        :key="option.key"
        :value="option.key"
        :selected="modelValue === option.key"
        :disabled="option.disabled || option.disabledIf"
      >
        {{ option.name }}
      </option>
    </select>
  </label>
</template>

<style lang="" scoped></style>
