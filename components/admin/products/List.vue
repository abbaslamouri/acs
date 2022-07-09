<script setup>
const props = defineProps({
  products: {
    type: Array,
  },
  totalCount: {
    type: Number,
  },
})
const emit = defineEmits(['deleteProduct'])

const config = useRuntimeConfig()

const router = useRouter()

const showActionKeys = ref([])

const resetActions = () => {
  for (const prop in props.products) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}

// const handleEditProduct = (slug) => {
//   resetActions()
//   router.push({ name: 'ecommerce-products-slug', params: { slug } })
// }

const deleteProduct = (productId) => {
  emit('deleteProduct', productId)
  resetActions()
}
</script>

<template>
  <table class="text-xs shadow-md">
    <thead>
      <tr class="bg-slate-200">
        <th class="w-6">Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Sale Price</th>
        <th>Stock Qty.</th>
        <th>Orders</th>
        <th>Sales</th>
        <th class="text-right min-w-12">actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(product, index) in products" :key="product._id">
        <td class="w-10 flex-row justify-center items-center">
          <div class="w-8 h-8 justify-center items-center">
            <img
              class="w-full h-full cover"
              v-if="product.gallery.length && product.gallery[0] && product.gallery[0].mimetype.includes('image')"
              :src="`${config.backendUrl}/${product.gallery[0].path}`"
            />
            <img v-else class="w-full hfull contain" :src="`/placeholder.png`" />
          </div>
        </td>
        <td class="text-center font-bold">{{ product.name }}</td>
        <td class="w-12 text-center">{{ product.price }}</td>
        <td class="w-12 text-center">{{ product.salePrice }}</td>
        <td class="w-12 text-center">{{ product.stockQty }}</td>
        <td class="w-12 text-center">{{ product.orders }}</td>
        <td class="w-12 text-center">{{ product.sales }}</td>
        <td class="w-12">
          <AdminRowActions
            :showAction="showActionKeys[index]"
            :showEdit="true"
            @moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
            @deleteAction="deleteProduct(product.id)"
            @editAction="router.push({ name: 'admin-ecommerce-products-slug', params: { slug: product.slug } })"
            @cancel="resetActions"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

tr {
  border-bottom: 1px solid $slate-300;
}
th {
  padding: 2rem;
}
td {
  padding: 1rem;

  // border: 1px solid red;
}
</style>
