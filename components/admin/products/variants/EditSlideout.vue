<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
})
const emit = defineEmits(['toggleVariantEditSlideout', 'saveVariant'])

const product = useState('product')
const allAttributes = inject('allAttributes')
const current = JSON.stringify(product.value.variants[props.index])

const closeSlideout = () => {
  if (current == JSON.stringify(product.value.variants[props.index])) return emit('toggleVariantEditSlideout', false)
  window.alert(
    'You have unsaved changes.  Please save your changes before closing this window or click cancel to exit without saving'
  )
}

const cancelVariantEdit = () => {
  product.value.variants[props.index] = JSON.parse(current)
  emit('toggleVariantEditSlideout', false)
}
</script>

<template>
  <div v-if="product.variants[index]">
    <div class="fixed inset-0 w-100vw h-100vh z-9 bg-slate-900 opacity-70"></div>
    <div class="fixed top-0 right-0 h-100vh z-99 max-w-100 w-100-percent">
      <div class="h-100vh flex-col justify-between bg-slate-200">
        <div class="bg-slate-400 p-1 flex-row items-center justify-between py-1 px-2">
          <h3 class="font-bold text-lg">Edit Variants</h3>
          <button class="btn btn__close" @click.prevent="closeSlideout"><IconsClose /></button>
        </div>
        <div class="flex-1 p-2 flex-col gap-2 overflow-auto">
          <EcommerceAdminProductVariantsOptions :index="index" />
          <EcommerceAdminProductVariantsGallery :index="index" />
          <!-- <EcommerceAdminProductVariantsPrice :index="index" /> -->
          <EcommerceAdminProductVariantsStock :index="index" />
          <EcommerceAdminProductVariantsDescription :index="index" />
        </div>
        <div class="flex-row items-center justify-end gap-2 p-1 bg-slate-400">
          <button class="btn btn_secondary py-05 px-3" @click.prevent="cancelVariantEdit">Cancel</button>
          <button
            class="btn btn__primary py-05 px-3"
            :disabled="current == JSON.stringify(product.variants[index])"
            @click.prevent="$emit('saveVariant')"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
