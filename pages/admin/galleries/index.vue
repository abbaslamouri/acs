<script setup>
import ListFallback from '~~/components/admin/ListFallback.vue'
definePageMeta({
  layout: 'admin',
})
const title = ref('Galleries | YRL')

const config = useRuntimeConfig()
// const { errorMsg, message } = useAppState()
const { fetchAll, deleteDoc, deleteDocs } = useHttp()

const galleries = ref([])
const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params
const showActionKeys = ref([])
const page = ref(1)
const perPage = ref(25)
const fields = '-updatedAt'
const keyword = ref('')
const sort = reactive({
  field: 'name',
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
    match: '',
    project: 'name,  media',
    lookup: 'media',
    page: page.value,
    limit: perPage.value,
    sort: `${sort.order}${sort.field}`,
    keyword: keyword.value ? keyword.value : '',
  }
  // if (!keyword.value) delete params.keyword
  return params
})

// const params = computed(() => {
//   const params = {
//     fields,
//     page: page.value,
//     limit: perPage.value,
//     sort: `${sort.order}${sort.field}, _id `,
//     keyword: keyword.value ? keyword.value : null,
//   }
//   if (!keyword.value) delete params.keyword
//   return params
// })

const pages = computed(() => {
  return totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
})

const fetchAllGalleries = async () => {
  response = await fetchAll('galleries', params.value)
  if (!response) return
  // products.value = response.docs
  // count.value = response.results
  // totalCount.value = response.totalCount

  // response = await fetchAll('galleries', params.value)
  // console.log(response)
  galleries.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAllGalleries()
}

const toggleSort = async (event) => {
  sort.field = event.field
  sort.order = event.order
  await fetchAllGalleries()
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchAllGalleries()
}

const deleteGallery = async (galleryId) => {
  if (!confirm('Are you sure you want to delete this gallery?')) return
  if (!(await deleteDoc('categories', galleryId))) return
  const gallery = galleries.value.find((c) => c.id == galleryId)
  fetchAllGalleries()
  message.value = `gallery ${gallery.name} deleted succesfully`
}

await fetchAllGalleries()
</script>

<template>
  <div class="flex-1 flex-col p-3">
    <Title>{{ title }}</Title>
    <div class="flex-1 flex-col justify-between gap-3" v-if="totalCount">
      <header class="flex-row items-center justify-between w-full">
        <h3 class="title">Galleries</h3>
        <NuxtLink :to="{ name: 'admin-galleries-slug', params: { slug: '_' } }">
          <button class="btn btn__primary btn__pill px-2 py-05">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header>
      <main class="flex-1 max-width-130 w-full flex-col gap-3">
        <div class="flex-col gap-3 flex-col br-5">
          <div class="flex-row gap-3" v-if="totalCount">
            <Search class="flex-1" @searchKeywordSelected="handleSearch" />
            <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="toggleSort" />
          </div>
          <AdminGalleriesList :galleries="galleries" :totalCount="totalCount" @deleteGallery="deleteGallery" />
        </div>
      </main>
      <footer class="w-full max-width-130">
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" />
      </footer>
    </div>
    <ListFallback v-else>
      <template #header>Add Gallery</template>
      <template #default>
        <div class="">Create as many galleries with as many images per gallery as you wish</div>
        <NuxtLink
          class="btn btn-primary btn-pill px-4 py-2 text-xs self-end"
          :to="{ name: 'admin-galleries-slug', params: { slug: '_' } }"
        >
          <IconsPlus class="fill-white w-5 h-5" />
          <span>Add</span>
        </NuxtLink>
      </template>
    </ListFallback>
  </div>
</template>

<style lang="scss" scoped></style>
