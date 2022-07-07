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

const  product  = useState('product')

const setAttribute = (event) => {
  product.value.attributes[props.attributeIndex].attribute = props.allAttributes.find(
    (a) => a.id === event.target.value
  )
  product.value.attributes[props.attributeIndex].defaultTerm =
    product.value.attributes[props.attributeIndex].attribute.attributeterms[0]
}
</script>

<template>
  <div class="min-w-10">
    <label class="base-select">
      <div class="label text-xs px-1">Attribute</div>
      <select @change="setAttribute" class="text-xs">
        <option value=""></option>
        <option
          v-for="option in allAttributes.map((a) => {
            return { key: a.id, name: a.name }
          })"
          :key="option.key"
          :value="option.key"
          :selected="product.attributes[attributeIndex].attribute.id == option.key"
          :disabled="product.attributes.find((a) => a.attribute.id == option.key)"
        >
          {{ option.name }}
        </option>
      </select>
    </label>
  </div>
</template>

<style lang="scss" scoped></style>
