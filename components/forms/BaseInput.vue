<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  currency: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['update:modelValue'])

const inputRef = ref('')
const errorMsg = ref('')
const uuid = useUniqueId().getId()
const fieldType = ref(props.type)

const handleBlur = (event) => {
  if (event.target.value) event.target.classList.add('dirty')
  else event.target.classList.remove('dirty')
}
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="base-input">
    <div class="currency" v-if="currency">$</div>
    <input
      ref="inputRef"
      :type="fieldType"
      :class="{ 'currency-input': currency, dirty: modelValue }"
      :value="modelValue"
      :id="`base-input-${uuid}`"
      :required="$attrs.required"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="handleBlur"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="$attrs.readonly ? true : ''"
      :aria-required="$attrs.required ? true : null"
      :readonly="$attrs.readonly ? true : null"
    />
    <span class="placeholder" @click="inputRef.focus()">{{ label }}<span v-if="$attrs.required">*</span></span>
    <div v-if="type === 'password'">
      <span class="icon" v-if="fieldType === 'password'" @click="fieldType = 'text'">
        <!-- <IconsVisibilityOff class="w-2 h-2" /> -->
      </span>
      <span class="icon" v-else @click="fieldType = 'password'">
        <!-- <IconsVisibilityOn class="w-2 h-2" /> -->
      </span>
    </div>
  </div>
</template>

<style scoped lang=""></style>
