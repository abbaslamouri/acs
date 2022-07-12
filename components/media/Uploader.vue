<script setup>
defineEmits(['setSelectedMedia'])
const config = useRuntimeConfig()
// console.log(config)

const route = useRoute()
const { fetchAll, saveMedia } = useHttp()
// const { message, errorMsg, showMediaSelector, galleryMedia } = useAppState()
const errorMsg = useState('errorMsg')
const message = useState('message')
const selectedMedia = ref([])
const toggleSlideout = ref(false)
const media = ref([])
const count = ref(0)
const totalCount = ref(0)
const page = ref(1)
const perPage = ref(50)
const keyword = ref('003')
const showDropZone = ref(false)
// const fields = 'name, filePath, mimetype, originalFilename'
let response = ''

const mediaSort = reactive({
  field: 'originalFilename',
  order: '-',
})
const mediaSortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
  { key: 'createdAt', name: 'Date Created' },
]

const params = computed(() => {
  const params = {
    match: '',
    project: 'name, filePath, mimetype, originalFilename',
    lookup: '',
    page: page.value,
    limit: perPage.value,
    sort: `${mediaSort.order}${mediaSort.field}`,
    keyword: keyword.value ? keyword.value : '',
  }
  // if (!keyword.value) delete params.keyword
  return params
})

const pages = computed(() =>
  totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
)

const fetchMedia = async () => {
  // selectedMedia.value = []
  response = await fetchAll('media', params.value)
  // console.log('FETCHALLRES', response)
  if (!response) return
  media.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

const uplodMedia = async (files) => {
  showDropZone.value = false
  if (files.length > config.maxFileUploads) return (errorMsg.value = '1000 files maximum')
  for (const prop in files) {
    media.value.unshift({
      name: 'spinner.gif',
      mimetype: files[prop].type,
    })
  }
  if (!files.length) return
  const formData = new FormData()
  for (const prop in files) {
    formData.append('media', files[prop])
  }
  response = await saveMedia(formData)
  console.log('RES', response)
  if (!response) {
    media.value = media.value.filter((m) => m.name !== 'spinner.gif')
  } else {
    await fetchMedia()
  }
}

const setPage = async (currentPage) => {
  page.value = currentPage
  await fetchMedia()
}

const toggleMediaSort = async (event) => {
  mediaSort.field = event.field
  mediaSort.order = event.order
  await fetchMedia()
}

const addToSelectedMedia = (file) => {
  const index = media.value.findIndex((m) => m._id == file._id)
  if (index !== -1 && !selectedMedia.value.find((m) => m._id == file._id)) selectedMedia.value.push(file)
}

const removeFromSelectedMedia = (file) => {
  const index = selectedMedia.value.findIndex((m) => m._id == file._id)
  if (index !== -1) selectedMedia.value.splice(index, 1)
}

const deleteMedia = async () => {
  // console.log('E1', errorMsg.value)
  // const deltetedMedia = []
  if (!confirm('Are you sure you want to delete these files?')) return
  // await Promise.all(
  // selectedMedia.value.map(async (item) => {
  // response = await deleteDoc('media', item.id)
  response = await $fetch('/api/v1/media', { method: 'DELETE', body: selectedMedia.value })
  console.log('RES', response)
  // if (response) deleteMedia = response
  // })
  // )
  // response = await $fetch('/api/v1/media', { method: 'POST', body: { id: item._id } })
  // console.log('RES', response)
  // if (response) deleteMedia = response
  if (!errorMsg.value) {
    // console.log('E2', errorMsg.value)

    await fetchMedia()
    message.value = 'Media deleted succesfully asdsdassad sadsdaasddsa adsdasads'
    selectedMedia.value = []
  }
}

const saveSelectedImage = async () => {
  console.log(selectedMedia.value[0])
  const response = await saveDoc('media', selectedMedia.value[0])
  console.log(response)
  if (!response) return
  message.value = 'Media updated succesfully'
  toggleSlideout.value = false
}

const handleSearch = async (searchKeyword) => {
  page.value = 1
  keyword.value = searchKeyword
  await fetchMedia()
}

const setSelectedMedia = () => {
  galleryMedia.value = selectedMedia.value
  showMediaSelector.value = false
}

const selectMediaType = async (event) => {
  params.value.keyword = event
  response = await fetchMedia()
}

const toggleSelectAll = (event) => {
  selectedMedia.value = event ? media.value : []
}

await fetchMedia()
</script>

<template>
  <div class="media-uploader flex flex-col justify-between h-full border-6">
    <div class="top">
      <div class="file-actions">
        <MediaFileActions
          :selectedMedia="selectedMedia"
          :sort="mediaSort"
          :sortOptions="mediaSortOptions"
          @toggleSort="toggleMediaSort"
          @fileUploadBtnClicked="showDropZone = !showDropZone"
          @deleteMedia="deleteMedia"
          @searchKeywordSelected="handleSearch"
          @toggleSelectAll="toggleSelectAll"
          @selectMediaType="selectMediaType"
          @toggleSlideout="toggleSlideout = !toggleSlideout"
        />
        <transition name="dropZone">
          <MediaDropZone
            v-show="showDropZone"
            :fileTypes="['image/*', 'text/csv', 'application/pdf']"
            @cancelFileUpload="showDropZone = !showDropZone"
            @uploadItemsSelected="uplodMedia"
          />
        </transition>
      </div>
    </div>

    <div class="bottom flex flex-col justify-between gap-1 flex-1 overflow-auto p-4">
      <div v-if="!media.length">loading</div>
      <div v-else>
        <MediaFileList
          :media="media"
          :selectedMedia="selectedMedia"
          @addToSelectedMedia="addToSelectedMedia"
          @removeFromSelectedMedia="removeFromSelectedMedia"
        />
      </div>
      <div class="pagination">
        <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1" />
      </div>
    </div>
    <div class="actions bg-slate-300 py-2 px-4 flex flex-row gap-2 justify-end" v-if="route.name !== 'admin-media'">
      <button class="btn btn-secondary text-xs px-4 py-1" @click="$emit('mediaSelectCancel')">Cancel</button>
      <button class="btn btn-primary text-xs px-4 py-1" @click="$emit('setSelectedMedia', selectedMedia)">
        Select
      </button>
    </div>
    <transition name="slideout">
      <Slideout v-if="toggleSlideout" @closeSlideout="toggleSlideout = false">
        <template #header>
          <h3>Edit Image</h3>
        </template>
        <template #default>
          <div class="flex flex-row gap-4 p-4">
            <div class="w-sm h-sm">
              <img
                class="w-full h-full contain"
                :src="`${config.doSpaceEndpoint}/uploads/${selectedMedia[0].originalFilename}`"
                :alt="`${selectedMedia[0].originalFilename} Photo`"
              />
            </div>
            <div class="flex-1 flex flex-col gap-4 mt-5">
              <div class="">
                <FormsBaseInput
                  label="Alt Text"
                  placeholder="Alt Text"
                  :required="true"
                  v-model="selectedMedia[0].altText"
                />
              </div>
              <div class="">
                <FormsBaseInput
                  label="Caption"
                  placeholder="Caption"
                  :required="true"
                  v-model="selectedMedia[0].caption"
                />
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-row gap-2 justify-end">
            <button class="btn btn-secondary text-xs px-4 py-1" @click="toggleSlideout = !toggleSlideout">
              Cancel
            </button>
            <button class="btn btn-primary text-xs px-4 py-1" @click="saveSelectedImage">Save</button>
          </div>
        </template>
      </Slideout>
    </transition>
  </div>
</template>

<style lang="scss" scoped></style>
