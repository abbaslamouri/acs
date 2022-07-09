<script setup>
import ListFallback from '~~/components/admin/ListFallback.vue'
definePageMeta({
  layout: 'admin',
})
const title = ref('Products | YRL')

const config = useRuntimeConfig()
const { errorMsg, message } = useAppState()
const { fetchAll, deleteDoc, deleteDocs } = useHttp()

const products = ref([])
const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params
const page = ref(1)
const perPage = ref(10)
const fields = 'name, acsPartNumber, gallery, eligibilities'
const keyword = ref('')
const sort = reactive({
  field: 'acsPartNumber',
  order: '-',
})

let response = null
const sortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
  { key: 'createdAt', name: 'Date Created' },
]

const params = computed(() => {
  const params = {
    fields,
    page: page.value,
    limit: perPage.value,
    sort: `${sort.order}${sort.field}`,
    keyword: keyword.value ? keyword.value : null,
  }
  if (!keyword.value) delete params.keyword
  return params
})

const pages = computed(() => {
  return totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
})

const fetchAllProducts = async () => {
  // selectedMedia.value = []
  response = await $fetch('/api/v1/products', { params: params.value })
  console.log('FETCHALLRES', response)
  if (!response) return
  products.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount

  // response = await fetchAll('products', params.value)
  // console.log(response)
  // products.value = response.docs
  // count.value = response.results
  // totalCount.value = response.totalCount
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAllProducts()
}

const toggleSort = async (event) => {
  sort.field = event.field
  sort.order = event.order
  await fetchAllProducts()
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllProducts()
}

const setPerPage = async () => {
  await fetchAllProducts()
}

const deleteProduct = async (productId) => {
  if (
    !confirm(
      'Are you sure you want to delete this products?  This product and all associated variants will also be deleted'
    )
  )
    return
  if (!(await deleteDoc('products', productId))) return
  console.log(response)
  fetchAllProducts()
  message.value = 'Product and product variants deleted succesfully'
}

await fetchAllProducts()
</script>

<template>
  <div class="flex-1 flex flex-col p-6">
    <Title>{{ title }}</Title>
    <div class="flex-1 flex flex-col justify-between gap-3" v-if="totalCount">
      <header class="flex flex-row items-center justify-between w-full">
        <h3 class="title">Products</h3>
        <NuxtLink class="text-sm" :to="{ name: 'admin-products-slug', params: { slug: '_' } }">
          <button class="btn btn-primary px-4 py-1">
            <IconsPlus class="w-5 h-5 fill-white" />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header>
      <main class="flex-1 w-full flex-col gap-4">
        <div class="flex flex-col gap-3 flex-col">
          <div class="flex flex-row items-center gap-4" v-if="totalCount">
            <FormsBaseInput name="Per Page" label="Per Page" v-model="perPage" @update:modelValue="setPerPage" />
            <Sort
              :sort="sort"
              :sortOptions="sortOptions"
              @toggleSort="toggleSort"
              v-if="totalCount && products.length > 1"
            />
            <Search class="flex-1" @searchKeywordSelected="handleSearch" v-if="totalCount && products.length > 1" />
          </div>
          <!-- <AdminProductsList :products="products" :totalCount="totalCount" @deleteProduct="deleteProduct" /> -->
        </div>
      </main>
      <footer class="w-full max-width-130">
        <!-- <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" /> -->
      </footer>
    </div>
    <ListFallback v-else>
      <template #header>Add your first physical or digital product</template>
      <template #default>
        <div class="">Add your product and variants. Products must have at least a name and a price</div>
      </template>
      <template #footer>
        <NuxtLink class="btn btn-primary py-1 px-3" :to="{ name: 'admin-products-slug', params: { slug: '_' } }">
          <IconsPlus class="w-5 h-5 fill-white" />
          <span>Add</span>
        </NuxtLink>
      </template>
    </ListFallback>
  </div>
</template>

<style lang="scss" scoped></style>
