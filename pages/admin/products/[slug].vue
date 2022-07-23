<script setup>
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('Product | YRL')

const config = useRuntimeConfig()
// const { errorMsg, message, galleryMedia, mediaReference, showMediaSelector } = useAppState()
// const { fetchAll, saveMedia, saveDoc, deleteDocs } = useHttp()
const route = useRoute()
const router = useRouter()

let response = null
const product = useState('product', () => {
  return { productType: 'variable', gallery: [], categories: [], attributes: [], variants: [] }
})
const slug = route.params.slug === '_' ? null : route.params.slug

if (slug) {
  response = await fetchAll('products', { slug })
  if (response.docs) product.value = response.docs[0]
  if (product.value.id) {
    response = await fetchAll('variants', { product: product.value.id })
    if (response.docs) product.value.variants = response.docs
  }
}

watch(
  () => galleryMedia.value,
  (currentVal) => {
    if (mediaReference.value === 'productMedia') product.value.gallery[0] = currentVal[0]
  },
  { deep: true }
)
</script>

<template>
  <div class="h-full flex flex-col items-center gap-2 p-3">
    <Title>{{ pageTitle }}</Title>
    <header class="flex flex-col gap-2 w-full">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="admin-link" :to="{ name: 'admin-products' }">
          <IconsArrowWest /><span>Products</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Product</h3>
    </header>
    <main class="main flex-1 w-full">
      <!-- <div class="left-sidebar shadow-md">
        <EcommerceAdminProductLeftSidebar :product="product" />
      </div> -->
      <div class="flex-col gap-2">
        <AdminProductsGeneralInfo />
        <!-- <EcommerceAdminProductPrice :product="product" @updatePrice="product.value = { ...product.value, ...$event }" /> -->
        <!-- <EcommerceAdminProductEligibility /> -->
        <!-- <EcommerceAdminProductNextHigherAssembly /> -->
        <!-- <EcommerceAdminProductStockManagement
          :product="product"
          @updateStock="product.value = { ...product.value, ...$event }"
        /> -->

        <!-- <EcommerceAdminProductAttributesContent
          v-if="product.id && product.productType === 'variable'"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
        /> -->
        <!-- <EcommerceAdminProductAttributesSlideout
          v-if="showAttributesSlideout"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
          @saveAttributes="saveProduct"
        /> -->

        <!-- <EcommerceAdminProductVariantsContent
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          v-if="product.id && product.productType === 'variable' && product.attributes.length"
        /> -->
        <!-- <EcommerceAdminProductVariantsSlideout
          v-if="showVariantsSlideout"
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          @saveVariants="saveProduct"
        /> -->
        <!-- <EcommerceProductDetails :product="product" @updateDetails="product.value = { ...product.value, ...$event }" /> -->

        <!-- <EcommerceProductShippingOptions :product="product" /> -->
        <!-- <EcommerceProductDigitalDelivery :product="product" /> -->
        <!-- <EcommerceProductExtraFields :product="product" /> -->
        <!-- <EcommerceProductSeo :product="product" /> -->
        <!-- <EcommerceProductMisc :product="product" /> -->
      </div>
      <div class="right-sidebar">
        <!-- <AdminProductsRightSidebar @productStatusUpdated="product.status = $event" @saveProduct="saveProduct" /> -->
        <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
          <!-- <EcommerceAdminImageGallery :gallery="product.gallery" /> -->
        </section>
      </div>
    </main>
    <div class="w-full flex-row justify-end px-4 sticky bottom-4 go-to-top">
      <a href="#product-go-back" class="btn btn__secondary px-2 py-1">Go To Top</a>
    </div>
    <!-- <footer class="w-full max-width-130 bg-slate-300 px-2 py-1 br-5 flex-row justify-center text-2xl">Footer</footer> -->
  </div>
</template>

<style lang="scss" scoped>

.main {
  display: grid;
  grid-template-columns: 1fr 25rem;
  gap: 2rem;
  align-items: flex-start;

  .left-sidebar {
    position: sticky;
    top: 10rem;
    background-color: white;
    // border: 1px solid $slate-100;
    border-radius: 3px;
    padding: 2rem 0.5rem;
  }

  .right-sidebar {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

// .go-to-top {
//   position: sticky;
//   bottom: 4rem;
// }
</style>
