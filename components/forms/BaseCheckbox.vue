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
  <div class="base-checkbox flex-row items-center gap-1">
    <label class="cursor-pointer flex-row gap-1" :for="$attrs.id" v-if="label">
      <input
        class=""
        type="checkbox"
        :checked="modelValue"
        v-bind="$attrs"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span> {{ label }} </span>
    </label>
  </div>
</template>

<style scoped lang=""></style>
