<script setup>
// import isEqual from 'lodash.isequal'

const emit = defineEmits(['saveVariants', 'toggleVariantsSlideout'])

const product = useState('product')
const { alert, errorMsg } = useAppState()
const { fetchAll } = useHttp()

const allAttributes = ref([])
const variantToDelteIndex = ref('')
const variantsActionSelect = ref('')
const showRegularPriceInput = ref(false)
const showSalePriceInput = ref(false)

// const allAttributes = (await $fetch(`/api/v1/attributes`, { fields: 'name, slug' })).docs
// const allAttributeTerms = (await $fetch(`/api/v1/attributeterms`, { fields: 'name, slug, parent' })).docs
// provide('allAttributes', allAttributes)
// provide('allAttributeTerms', allAttributeTerms)
const response = await fetchAll('attributes')
if (response.docs) allAttributes.value = response.docs
provide('allAttributes', allAttributes)
// console.log(allAttributes)
console.log(product.value)
const current = JSON.stringify(product.value.variants)

const variantBase = (terms = []) => {
  return {
    productId: product.value.id,
    attrTerms: terms,
    enabled: true,
    shipping: {
      dimensions: {},
    },
    stockQty: 0,
    price: product.value.price,
    salePrice: product.value.salePrice,
    sku: '',
    gallery: product.value.gallery[0] ? [{ ...product.value.gallery[0] }] : [],
  }
}

const getVariantAttribute = (term, j) => {
  if (Object.values(term).length) {
    return allAttributes.find((a) => a.id == term.parent.id)
  } else {
    return product.value.attributes[j].attribute
  }
}

const getCombinations = (options) => {
  let combinations = [[]]
  for (let count = 0; count < options.length; count++) {
    const tmp = []
    combinations.forEach((v1) => {
      options[count].forEach((v2) => {
        tmp.push(v1.concat([v2]))
      })
      combinations = tmp
    })
  }
  return combinations
}

const checkMissingVariantTerms = () => {
  let errorMessage = ''
  for (const i in product.value.variants) {
    for (const j in product.value.variants[i].attrTerms) {
      if (!Object.keys(product.value.variants[i].attrTerms[j]).length)
        errorMessage += `Term missing for variant ${i * 1 + 1} attribute ${
          getVariantAttribute(product.value.variants[i].attrTerms[j], j).name
        }<br>`
    }
  }
  if (!errorMessage) return true
  errorMsg.value = `Attribute terms are required<br> ${errorMessage}`
  return false
}

const checkDuplicateVariants = () => {
  for (const i in product.value.variants) {
    for (const j in product.value.variants) {
      // if (
      //   j * 1 !== i * 1 &&
      //   isEqual(
      //     product.value.variants[j].attrTerms.map((t) => t._id),
      //     product.value.variants[i].attrTerms.map((t) => t._id)
      //   )
      // ) {
      //   errorMsg.value = `Duplicate variants not allowed.  Variant ${j * 1 + 1} uses the same attributes and terms as ${
      //     i * 1 + 1
      //   }`
      //   return
      // }
    }
  }
  return true
}

// const bulkAddVariants = () => {
//   if (product.value.variants.length)
//     showAlert(
//       'Are you sure you want to recreate all variants?',
//       'This action will overwrite all existing variants',
//       'bulkVariants',
//       true
//     )
//   else bulkAddVariants()
// }

const addSingleVariant = () => {
  const filteredAttributes = product.value.attributes.filter((a) => a.enabled && a.variation)
  const maxVariantCount = filteredAttributes
    .map((a) => {
      return a.terms.length
    })
    .reduce((a, b) => a * b, 1)

  if (!maxVariantCount) return (errorMsg.value = 'You do not have any attributes enabled for variations')

  if (product.value.variants.length >= maxVariantCount)
    return (errorMsg.value = 'You have created all possible variantions.  Please edit an existing one.')

  const terms = []
  for (const prop in filteredAttributes) {
    terms[prop] = {}
  }
  product.value.variants.unshift(variantBase([...terms]))
  console.log('PPVV', product.value.variants)
}

const bulkAddVariants = () => {
  if (product.value.variants.length) {
    if (!confirm('Are you sure you want to recreate all variants? This action will overwrite all existing variants'))
      return
  }
  let terms = []
  if (!product.value.attributes.length)
    return (errorMsg.value = 'I do not know how you got here but you need to create attributes first')
  const filteredAttributes = product.value.attributes.filter((a) => a.enabled && a.variation)
  for (const prop in filteredAttributes) {
    if (!filteredAttributes[prop].terms.length)
      return (errorMsg.value = `All attributes must contain terms.  Attribute ${filteredAttributes[prop].attribute.name} does not contain any terms.  Please delete this attribute or add terms`)
  }
  terms = filteredAttributes.map((el) => [...el.terms])
  if (getCombinations(terms)[0].length)
    product.value.variants = [...getCombinations(terms)].map((el) => {
      return variantBase([...el])
    })
  console.log('PV', product.value.variants)

  // alert.value.show = false
  // alert.value.action = ''
}

const updateVariants = async () => {
  // if (!checkMissingVariantTerms() || !checkDuplicateVariants()) return
  for (const i in product.value.variants) {
    for (const j in product.value.variants[i].gallery) {
      const index = product.value.gallery.findIndex((m) => m.id == product.value.variants[i].gallery[j].id)
      if (index === -1) product.value.gallery.push(product.value.variants[i].gallery[j])
    }
  }

  emit('toggleVariantsSlideout', false)
  emit('saveVariants', false)
}

const toggleEnabled = () => {
  for (const prop in product.value.variants) {
    product.value.variants[prop].enabled = !product.value.variants[prop].enabled
  }
}

const setRegularPrices = (price) => {
  for (const prop in product.value.variants) {
    product.value.variants[prop].price = price
  }
  showRegularPriceInput.value = false
}

const setSalePrices = (price) => {
  for (const prop in product.value.variants) {
    product.value.variants[prop].salePrice = price
  }
  showSalePriceInput.value = false
}

const closeSlideout = () => {
  if (current == JSON.stringify(product.value.variants)) return emit('toggleVariantsSlideout', false)
  window.alert('Please save your changes before closing this window or click cancel to exit without saving.')
  // if (current !== JSON.stringify(product.value.variants)) {
  //   showAlert(
  //     'You have unsaved changes',
  //     'Please save your changes before closing this window or click cancel to exit without saving',
  //     'closeSlideout',
  //     false
  //   )
  // } else {
  //   emit('toggleVariantsSlideout', false)
  // }
}

const cancelVariantUpdate = () => {
  product.value.variants = JSON.parse(current)
  emit('toggleVariantsSlideout', false)
}

const handleVariantsAction = () => {
  if (!variantsActionSelect.value) return (errorMsg.value = 'Please select an action')
  switch (variantsActionSelect.value) {
    case 'create-all':
      bulkAddVariants()
      break
    case 'add-variant':
      addSingleVariant()
      break
    case 'delete-all':
      removeAllVariants()
      break
    case 'toggle-enabled':
      toggleEnabled()
      break
    case 'set-regular-prices':
      showRegularPriceInput.value = true
      break
    case 'set-sale-prices':
      showSalePriceInput.value = true
      break
  }
  setTimeout(() => {
    variantsActionSelect.value = ''
  }, 10)
}

// const showRemoveVariantAlert = (variantIndex) => {
//   variantToDelteIndex.value = variantIndex * 1
//   showAlert('Are you sure you want to delete this product variant?', '', 'removeVariant', true)
// }

const removeVariant = (variantIndex) => {
  if (!confirm('Are you sure you want to delete this product variant?')) return
  product.value.variants.splice(variantIndex * 1, 1)
  // alert.value.show = false
}

const removeAllVariants = async () => {
  if (!confirm('Are you sure? All variants associated with this product will be deleted')) return
  product.value.variants = []
  // alert.value.show = false
}

// const showAlert = (heading, paragraph, action, showCancelBtn) => {
//   alert.value.heading = heading
//   alert.value.paragraph = paragraph
//   alert.value.action = action
//   alert.value.showCancelBtn = showCancelBtn
//   alert.value.show = true
// }

// watch(
//   () => alert.value.show,
//   (currentVal) => {
//     if (currentVal === 'ok' && alert.value.action === 'bulkVariants') bulkAddVariants()
//     if (currentVal === 'ok' && alert.value.action === 'removeVariant') removeVariant()
//     if (currentVal === 'ok' && alert.value.action === 'removeAllVariants') removeAllVariants()
//     if (currentVal === 'ok' && alert.value.action === 'closeSlideout') alert.value.show = false
//   },
//   { deep: true }
// )
</script>

<template>
  <div v-if="product.attributes">
    <div class="fixed inset-0 w-100vw h-100vh z-9 bg-slate-900 opacity-70"></div>
    <div class="fixed top-0 right-0 h-100vh z-99 max-w-100 w-100-percent">
      <div class="h-100vh flex-col justify-between bg-slate-200">
        <div class="bg-slate-400 p-1 flex-row items-center justify-between py-1 px-2">
          <h3 class="font-bold text-lg">Edit Variants</h3>
          <button class="btn btn__close" @click.prevent="closeSlideout"><IconsClose /></button>
        </div>
        <div class="flex-1 p-2 flex-col gap-2 overflow-auto">
          <div class="flex-row items-center justify-between bg-white p-2 br-3 shadow-md">
            <h2>Variants</h2>
            <div class="flex-row align-center gap-2">
              <label class="base-select">
                <div class="label text-xs px-1">Actions</div>
                <select v-model="variantsActionSelect" @change="handleVariantsAction">
                  <option value="">Select Action</option>
                  <option value="create-all">Create variations form all attribute</option>
                  <option value="add-variant">Add Variant</option>
                  <option value="delete-all" :disabled="!product.variants.length">Delete All Variants</option>
                  <option value="" disabled>Status</option>
                  <option value="toggle-enabled">Toggle Enabled</option>
                  <option value="" disabled>Pricing</option>
                  <option value="set-regular-prices" :disabled="!product.variants.length">Set Regular Prices</option>
                  <option value="set-sale-prices" :disabled="!product.variants.length">Set Sale Prices</option>
                </select>
              </label>
              <EcommerceAdminProductVariantsPriceForm
                :showRegularPriceInput="showRegularPriceInput"
                :showSalePriceInput="showSalePriceInput"
                @setRegularPrices="setRegularPrices"
                @setSalePrices="setSalePrices"
              />
              <button class="btn btn__primary min-w-12 justify-center" @click="bulkAddVariants">Bulk&nbsp;Add</button>
            </div>
          </div>
          <div>
            <EcommerceAdminProductVariantsList v-if="product.variants.length" @removeVariant="removeVariant" />
            <EcommerceAdminProductVariantsEmptyMsg v-else @togglevariantsSlideout="$emit('togglevariantsSlideout')" />
          </div>
        </div>
        <div class="flex-row items-center justify-end gap-2 p-1 bg-slate-400">
          <button class="btn btn_secondary py-05 px-3" @click.prevent="cancelVariantUpdate">Cancel</button>
          <button
            class="btn btn__primary py-05 px-3"
            :disabled="current == JSON.stringify(product.variants)"
            @click.prevent="updateVariants"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
