<script setup>
definePageMeta({
  layout: 'admin',
})
const title = ref('Seeder | YRL')

const config = useRuntimeConfig()
// const { errorMsg, message } = useAppState()
// const { fetchAll, deleteDoc, deleteDocs } = useHttp()
const { productSeeder } = useHttp()

const showDropZone = ref(false)

const fileToUpload = ref('')

const eligibilities = ref([])
const nextHigherAssemblies = ref([])
const totalCount = ref(null) // Total item count in the database
const count = ref(null) // item count taking into account params
const showActionKeys = ref([])
const page = ref(1)
const perPage = ref(5)
const fields = '-updatedAt'
const keyword = ref('')
const sort = reactive({
  field: 'createdAt',
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
    sort: `${sort.order}${sort.field}, _id `,
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

const fetchAllEligibilities = async () => {
  response = await fetchAll('eligibilities', params.value)
  console.log('EL', response)
  eligibilities.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

const fetchAllNextHigherAssemblies = async () => {
  response = await fetchAll('nexthigherassemblies', params.value)
  console.log('NEXT', response)
  nextHigherAssemblies.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

// const toggleDropZone = () => {
//   if (!selectedFolder.value.id) errorMsg.value = 'Please selecet a folder'
//   else showDropZone.value = !showDropZone.value
// }

const uploadFile = async (files) => {
  try {
    console.log(files)
    const formData = new FormData()

    if (fileToUpload.value === 'products') {
      formData.append('media', files[0])
      const response = await productSeeder(formData)
      console.log('SEEDER', response)
    }

    if (fileToUpload.value === 'countries') {
      formData.append('media', files[0])
      const response = await seedCountries(formData)
      console.log('RES', response)
    }

    if (fileToUpload.value === 'states') {
      formData.append('media', files[0])
      const response = await seedStates(formData)
      console.log('RES', response)
    }
  } catch (err) {
    console.log(err.data)
  }
}

const setFileToUpload = (event) => {
  fileToUpload.value = event
  showDropZone.value = true
}

// await fetchAllEligibilities()
// await fetchAllNextHigherAssemblies()
</script>

<template>
  <div class="flex-1 flex-col gap-3 p-4">
    <Title>{{ title }}</Title>
    <!-- <form class="form-inline"> -->
    <button class="btn btn__new-media gap-1 min-w-16 items-self-start" @click="setFileToUpload('products')">
      <IconsUpload />
      <span>Select CSV File</span>
    </button>

    <button class="btn btn__new-media gap-1 min-w-16 items-self-start" @click="setFileToUpload('countries')">
      <IconsUpload />
      <span>Select Countries File</span>
    </button>

    <button class="btn btn__new-media gap-1 min-w-16 items-self-start" @click="setFileToUpload('states')">
      <IconsUpload />
      <span>Select States File</span>
    </button>
    <transition name="dropZone">
      <MediaDropZone
        v-show="showDropZone"
        :fileTypes="['text/csv', 'application/json']"
        @cancelFileUpload="showDropZone = false"
        @uploadItemsSelected="uploadFile"
      />
    </transition>
    <!-- <div class="form-group">
        <label for="files">Upload a CSV formatted file:</label>
        <input type="file" id="files" class="form-control" accept=".csv" required @change="uploadProductSeeder" />
      </div> -->
    <!-- <div class="form-group">
        <button type="submit" id="submit-file" class="btn btn-primary">Upload File</button>
      </div>
    </form> -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.media {
  height: 92vh;
  width: 100%;
  background-color: $slate-100;
}
</style>
