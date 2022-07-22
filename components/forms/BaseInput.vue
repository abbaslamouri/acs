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
  <!-- <div class="relative z-0">
    <input
      type="text"
      name="name"
      class="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
      placeholder=" "
    />
    <label
      class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
      >Your name</label
    >
  </div> -->
  <div class="base-input relative z-0">
    <!-- <div class="currency" v-if="currency">$</div> -->
    <input
      class="peer block w-full appearance-none border-0 border-b border-gray-500 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-gray-600 focus:outline-none focus:ring-0"
      ref="inputRef"
      :type="fieldType"
      placeholder=" "
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
    <label
      class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-gray-600 peer-focus:dark:text-gray-500"
      >{{ label }}
    </label>
    <div class="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" v-if="type === 'password'">
      <span class="icon" v-if="fieldType === 'password'" @click="fieldType = 'text'">
        <IconsVisibilityOff class="w-4 h-4" />
      </span>
      <span class="icon" v-else @click="fieldType = 'password'">
        <IconsVisibilityOn class="w-4 h-4" />
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
