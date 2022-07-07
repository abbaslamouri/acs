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

const emit = defineEmits(['deleteTerm', 'deleteAllTerms'])

const product = useState('product')
const termSelectId = ref('')

const handleAddTerm = () => {
  const index = product.value.attributes[props.attributeIndex].terms.findIndex((t) => t._id == termSelectId.value)
  if (index === -1)
    product.value.attributes[props.attributeIndex].terms.push(
      product.value.attributes[props.attributeIndex].attribute.attributeterms.find((t) => t._id == termSelectId.value)
    )
}

const deleteTerm = (termId) => {
  emit('deleteTerm', { attributeIndex: props.attributeIndex, termId })
}

const deleteAllTerms = () => {
  emit('deleteAllTerms', { attributeIndex: props.attributeIndex })
}
</script>

<template>
  <div>
    <div
      v-if="Object.keys(product.attributes[attributeIndex].attribute).length"
      class="terms flex-row gap1 border border-slate-300 p-1 br-3 text-xs"
    >
      <div class="term-actions flex-col justify-center gap-05">
        <button
          class="text-xs border bg-slate-400 text-slate-50 px-1 py-02 br-3 cursor-pointer"
          @click.prevent="
            product.attributes[attributeIndex].terms = [...product.attributes[attributeIndex].attribute.attributeterms]
          "
          v-if="
            product.attributes[attributeIndex].terms.length !=
            product.attributes[attributeIndex].attribute.attributeterms.length
          "
        >
          Select All
        </button>

        <button
          class="text-xs min-w-8 border bg-slate-400 text-slate-50 px-1 py-02 br-3 cursor-pointer"
          @click.prevent="deleteAllTerms"
          v-if="product.attributes[attributeIndex].terms.length"
        >
          Select None
        </button>

        <div
          class="border border-slate-400 py-02 px-05 br-3"
          v-if="
            product.attributes[attributeIndex].terms.length !=
            product.attributes[attributeIndex].attribute.attributeterms.length
          "
        >
          <select v-model="termSelectId" @change="handleAddTerm" class="w-full text-xs">
            <option value="">Add term</option>
            <option
              v-for="term in product.attributes[attributeIndex].attribute.attributeterms"
              :key="term._id"
              :value="term._id"
              :disabled="product.attributes[attributeIndex].terms.find((t) => t._id == term._id)"
            >
              {{ term.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="border border-slate-300 min-w-12 br-3 py-05">
        <div class="list flex-row items-center gap-05 wrap p-1" v-if="product.attributes[attributeIndex].terms.length">
          <div
            v-if="product.attributes[attributeIndex].terms.length"
            class="shadow-md flex-row items-cdenter gap-05 bg-slate-500 text-slate-50 py-02 px-05 br-3"
            v-for="term in product.attributes[attributeIndex].terms"
            :key="term._id"
          >
            <span>{{ term.name }}</span>
            <span class="cursor-pointer" @click="deleteTerm(term._id)">
              <IconsClose class="w-1 h-1 fill-slate-50" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
