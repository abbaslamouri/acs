<script setup>
const props = defineProps({
  attributeIndex: {
    type: Number,
  },
  allAttributes: {
    type: Array,
    default: [],
  },
})

const product  = useState('product')
const setDefaultTerm = (event) => {
  product.value.attributes[props.attributeIndex].defaultTerm = product.value.attributes[
    props.attributeIndex
  ].attribute.attributeterms.find((t) => t._id == event.target.value)
}
</script>

<template>
  <div>
    <label class="base-select" v-if="Object.keys(product.attributes[attributeIndex].attribute).length">
      <div class="label text-xs px-1">Default Term</div>
      <select class="text-xs" @change="setDefaultTerm" :disabled="!product.attributes[attributeIndex].enabled">
        <option value=""></option>
        <option
          v-for="option in product.attributes[attributeIndex].attribute.attributeterms.map((t) => {
            return { key: t._id, name: t.name }
          })"
          :key="option.key"
          :value="option.key"
          :selected="product.attributes[attributeIndex].defaultTerm._id == option.key"
        >
          {{ option.name }}
        </option>
      </select>
    </label>
  </div>
</template>

<style lang="scss" scoped></style>
