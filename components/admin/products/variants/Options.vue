<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
})

const product = useState('product')

const getTermValue = (attributeId) => {
  const term = product.value.variants[props.index].attrTerms.find((t) => t && t.parent == attributeId)
  return term ? term._id : null
}

const setAttributeTerm = async (termId, i) => {
  const term = product.value.attributes[i].terms.find((t) => t._id == termId)
  const k = product.value.variants[props.index].attrTerms.findIndex(
    (t) => t && t.parent && t.parent._id == product.value.attributes[i].attribute._id
  )
  if (k !== -1) {
    product.value.variants[props.index].attrTerms[k] = term
  } else {
    product.value.variants[props.index].attrTerms[i] = term
  }
}
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="details">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Variant Options</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div class="flex-row gap-2">
        <div class="flex-1" v-for="(attribute, i) in product.attributes" :key="attribute.attribute._id">
          <label class="base-select">
            <div class="label text-xs px-1">{{ attribute.attribute.name }}</div>
            <select :value="getTermValue(attribute.attribute._id)" @change="setAttributeTerm($event.target.value, i)">
              <option :value="null">Select Term</option>
              <option v-for="term in attribute.terms" :key="term._id" :value="term._id">{{ term.name }}</option>
            </select>
          </label>
        </div>
      </div>
      <div class="flex-row items-center gap-2">
        <div class="enabled">
          <FormsBaseToggle v-model="product.variants[index].enabled" label="Enabled" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Price" placeholder="Price" currency v-model="product.variants[index].price" />
        </div>
        <div class="flex-1">
          <FormsBaseInput
            label="Sale Price"
            placeholder="Sale Price"
            currency
            v-model="product.variants[index].salePrice"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
