<script setup>
const emit = defineEmits(['saveAttributes', 'updateAttributes', 'toggleAttributesSlideout'])

const { fetchAll } = useHttp()
const product = useState('product')
const { errorMsg, alert } = useAppState()
const allAttributes = ref([])
const attributeToDelteIndex = ref(null)
const attributeIndex = ref(null)
const termToDeleteId = ref(null)

const current = JSON.stringify(product.value.attributes)

const response = await fetchAll('attributes')
if (response && response.docs) allAttributes.value = response.docs

const removeVariantByTermId = (termId) => {
  // let j = 0
  // while (j < store.variants.length) {
  //   const k = store.variants[j].attrTerms.findIndex((t) => t._id == termId)
  //   const countBefore = store.variants[j].attrTerms.length
  //   if (k !== -1) store.variants[j].attrTerms.splice(k, 1)
  //   const countAfter = store.variants[j].attrTerms.length
  //   if (countBefore != countAfter) store.variants[j].discard = true
  //   j++
  // }
  // store.variants = store.variants.filter((el) => !el.discard)
}

const insertAttribute = (attribute = {}, defaultTerm = {}, terms = []) => {
  if (product.value.attributes.length == allAttributes.value.length)
    return (errorMsg.value = 'You have used up all available attributes')
  product.value.attributes.push({
    attribute,
    terms,
    defaultTerm,
    enabled: true,
    variation: true,
  })
  console.log(product.value)
}

const addAllAttributes = () => {
  for (const prop in allAttributes.value) {
    const attribute = allAttributes.value[prop]
    const terms = [...allAttributes.value[prop].attributeterms]
    const defaultTerm = allAttributes.value[prop].attributeterms[0]
    insertAttribute(attribute, defaultTerm, terms)
  }
}

const closeSlideout = () => {
  if (current == JSON.stringify(product.value.attributes)) return emit('toggleAttributesSlideout')
  window.alert('Please save your changes before closing this window or click cancel to exit without saving.')
}

const saveAttributes = async () => {
  if (current == JSON.stringify(product.value.attributes)) return emit('closeSlideout')
  const newAttributes = []
  for (const prop in product.value.attributes) {
    if (!product.value.attributes[prop].attribute.id)
      return (errorMsg.value = `Please select a value for attribute ${prop * 1 + 1} `)
    if (!product.value.attributes[prop].terms.length)
      return (errorMsg.value = `Attributes must contain at least one term.  Please select terms for attribute ${
        prop * 1 + 1
      }`)

    newAttributes.push(product.value.attributes[prop])
  }
  product.value.attributes = newAttributes
  emit('saveAttributes')
  emit('toggleAttributesSlideout')
}

const cancelAttributesUpdate = () => {
  product.value.attributes = JSON.parse(current)
  emit('toggleAttributesSlideout')
}

const deleteAttribute = (attributeIndex) => {
  if (
    !confirm(
      'Are you sure you want to delete this attribute? You also have to delete all product variants associated with this attribute.'
    )
  )
    return
  product.value.attributes.splice(attributeIndex, 1)
}

const deleteAllAttributes = () => {
  if (
    !confirm(
      'Are you sure you want to delete all attributes? You also have to delete all product variants associated with this attribute.'
    )
  )
    return
  product.value.attributes = []
}

const addTerm = (payload) => {
  const { attributeId, termId } = payload
  const index = product.value.attributes.findIndex((a) => a.attribute._id == attributeId)
  if (index !== -1) {
    const term = allAttributeTerms.find((t) => t._id == termId)
    if (term) {
      if (!product.value.attributes[index].terms.length) {
        product.value.attributes[index].terms = [term]
      } else {
        const i = product.value.attributes[index].terms.findIndex((t) => t._id == termId)
        if (i == -1) product.value.attributes[index].terms.push(term)
      }
    }
  }
}

const addAllTerms = (attributeId) => {
  const index = product.value.attributes.findIndex((a) => a.attribute._id == attributeId)
  if (index !== -1) product.value.attributes[index].terms = allAttributeTerms.filter((t) => t.parent._id == attributeId)
}

const deleteTerm = async (payload) => {
  if (
    !confirm(
      'Are you sure you want to remove all terms associated with this attribute?  You also have to delete all product variants associated with this attribute.'
    )
  )
    return
  const index = product.value.attributes[payload.attributeIndex].terms.findIndex((t) => t.id == payload.termId)
  if (index !== -1) product.value.attributes[payload.attributeIndex].terms.splice(index, 1)
  console.log(product.value.attributes)
}

const deleteAllTerms = (payload) => {
  if (
    !confirm(
      'Are you sure you want to remove all terms associated with this attribute?  You also have to delete all product variants associated with this attribute.'
    )
  )
    return
  product.value.attributes[payload.attributeIndex].terms = []
}
</script>

<template>
  <div>
    <div class="fixed inset-0 w-100vw h-100vh z-9 bg-slate-900 opacity-70"></div>
    <div class="fixed top-0 right-0 h-100vh z-99 max-w-120 w-100-percent">
      <div class="h-100vh flex-col justify-between bg-slate-200">
        <div class="bg-slate-400 p-1 flex-row items-center justify-between py-1 px-2">
          <h3 class="font-bold text-lg">Edit Attributes</h3>
          <button class="btn btn__close" @click.prevent="closeSlideout"><IconsClose /></button>
        </div>
        <div class="flex-1 p-2 flex-col gap-2">
          <div class="flex-row items-center justify-between bg-white p-2 br-3 shadow-md">
            <h2>Attributes</h2>
            <div class="flex-row gap-2" v-if="!product.attributes.length">
              <button
                class="btn btn__primary py-05 px-2 text-xs"
                @click.prevent="insertAttribute()"
              >
                Add Attribute
              </button>
              <button
                class="btn btn__primary py-05 px-2 text-xs"
                @click.prevent="addAllAttributes"
                v-if="product.attributes.length !== allAttributes.length"
              >
                Add All Attributes
              </button>
              <button
                class="btn btn__secondary py-05 px-2 text-xs"
                @click.prevent="deleteAllAttributes"
              >
                deleted All Attributes
              </button>
            </div>
          </div>
          <div>
            <EcommerceAdminProductAttributesList
              v-if="product.attributes.length"
              :allAttributes="allAttributes"
              @deleteAttribute="deleteAttribute"
              @addTerm="addTerm"
              @addAllTerms="addAllTerms"
              @deleteTerm="deleteTerm"
              @deleteAllTerms="deleteAllTerms"
            />
            <EcommerceAdminProductAttributesEmptyMsg v-else :allAttributes="allAttributes" />
          </div>
        </div>
        <div class="flex-row items-center justify-end gap-2 p-1 bg-slate-400">
          <button class="btn btn_secondary py-05 px-3" @click.prevent="cancelAttributesUpdate">Cancel</button>
          <button
            class="btn btn__primary py-05 px-3"
            :disabled="current == JSON.stringify(product.attributes)"
            @click.prevent="saveAttributes"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
