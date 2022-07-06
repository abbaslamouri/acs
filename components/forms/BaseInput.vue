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
  <div class="base-input relative">
    <div class="currency" v-if="currency">$</div>
    <input
      class="appearance-none w-full bg-gray cursor-pointer border-2 border-gray-300 py-2 px-4 text-xs rounded"
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
    <span class="placeholder absolute left-5 top-0 transform -translate-y-2 text-xs bg-[#ffffff] px-2" @click="inputRef.focus()">{{ label }}<span v-if="$attrs.required">*</span></span>
    <div v-if="type === 'password'">
      <span class="absolute top-[30%] right-3" v-if="fieldType === 'password'" @click="fieldType = 'text'">
        <IconsHide class="w-4 h-4" />
      </span>
      <span class="icon" v-else @click="fieldType = 'password'">
        <IconsShow class="w-4 h-4" />
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-inputz {
  position: relative;
  font-size: 0.8rem;
  // padding-top: 1rem;
  // margin-bottom: 0.5rem;
  background-color: #ffffff;

  input {
    background-color: #ffffff;
    appearance: none;
    // padding: 0.5rem 1rem;
    border-radius: 3px;
    width: 100%;
    outline: none;
    border: 2px solid #d1d5db;
    transition: 0.3s ease;
    z-index: 1;

    &:focus,
    &.dirty {
      border-color: #94a3b8;
      transition-delay: 0.1s;
      background-color: #ffffff;
    }

    &:focus + .placeholder,
    &.dirty + .placeholder {
      top: 1rem;
      // font-size: 1rem;
      background-color: #ffffff;
    }
  }

  .placeholder {
    position: absolute;
    // font-size: 0.7rem;

    left: 1rem;
    top: calc(50% + 0.5rem);
    transform: translateY(-50%);
    color: #475569;
    padding: 0 0.5rem;
    transition: 0.3s ease;
  }

  .currency {
    position: absolute;
    left: 1.2rem;
    top: calc(50% - 0.3rem);
    font-size: 1rem;
  }

  .icon {
    position: absolute;
    top: 50%;
    // transform: translateY(-10%);
    right: 10px;
    cursor: pointer;
  }
}
</style>
