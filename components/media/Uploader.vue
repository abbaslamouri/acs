<script setup>
const config = useRuntimeConfig()

const route = useRoute()
const { fetchAll, saveMedia, saveDoc, deleteDoc, deleteDocs } = useHttp()
const { message, errorMsg, showMediaSelector, galleryMedia } = useAppState()
const selectedMedia = ref([])
const toggleSlideout = ref(false)
const media = ref([])
const count = ref(0)
const totalCount = ref(0)
const page = ref(1)
const perPage = ref(350)
const keyword = ref('')
const showDropZone = ref(false)
const fields = 'name, filePath, mimetype'
let response = ''

const mediaSort = reactive({
  field: 'name',
  order: '-',
})
const mediaSortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
  { key: 'createdAt', name: 'Date Created' },
]

const params = computed(() => {
  const params = {
    fields,
    page: page.value,
    limit: perPage.value,
    sort: `${mediaSort.order}${mediaSort.field}`,
    keyword: keyword.value ? keyword.value : null,
  }
  if (!params.folder) delete params.folder
  if (!keyword.value) delete params.keyword
  return params
})

const pages = computed(() =>
  totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
)

const fetchMedia = async () => {
  // selectedMedia.value = []
  response = await $fetch('/api/v1/media', { params: params.value })
  console.log('FETCHALLRES', response)
  if (!response) return
  media.value = response.docs
  count.value = response.results
  totalCount.value = response.totalCount
}

const handleUplodMedia = async (gallery) => {
  console.log('GGGGG', gallery)
  try {
    showDropZone.value = false
    console.log(gallery)
    if (gallery.length > 2000) return (errorMsg.value = '200 files maximum')
    for (const prop in gallery) {
      media.value.unshift({
        name: 'spinner.gif',
        originalName: gallery[prop].name,
        path: '',
        mimetype: gallery[prop].type,
      })
    }
    if (!gallery.length) return
    const formData = new FormData()
    for (const prop in gallery) {
      formData.append('gallery', gallery[prop])
    }
    response = await $fetch('/api/v1/media', { method: 'POST', body: formData })
    console.log('RES', response)
    // if (!uploaded) return
    // response = await $fetch('/api/v1/media', { method: 'POST', body: uploaded })
    // console.log('RES', response)

    if (!response) return
    // for (const prop in media.value) {
    //   const i = response.media.findIndex((m) => m.originalName == media.value[prop].originalName)
    //   if
    console.log('KKKKKKKKKKKKK')
    await fetchMedia()
  } catch (err) {
    console.log('EEEEEE', err.data)
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
  <div class="media-uploader flex-col h-full">
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
            @uploadItemsSelected="handleUplodMedia"
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
        <!-- <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" /> -->
      </div>
    </div>
    <div class="actions bg-slate-300 py-2 px-4 flex-row gap-2 justify-end" v-if="route.name !== 'admin-media'">
      <button class="btn btn__secondary cancel px-2 py-1" @click="$emit('mediaSelectCancel')">Cancel</button>
      <button class="btn btn__primary px-2 py-1" @click="setSelectedMedia">Select</button>
    </div>
    <Slideout v-if="toggleSlideout" @closeSlideout="toggleSlideout = false">
      <template #header>
        <h3>Edit Image</h3>
      </template>
      <template #default>
        <div class="flex-row gap-2 p-4">
          <div class="w-20 h-20">
            <!-- <img
              class="w-full h-full contain"
              :src="`${config.backendUrl}/${selectedMedia[0].path}`"
              :alt="`${selectedMedia[0].originalName} Photo`"
            /> -->
          </div>
          <div class="flex-1">
            <div class="">
              <!-- <FormsBaseInput label="Name" placeholder="Name" :required="true" v-model="selectedMedia[0].name" /> -->
            </div>
            <div class="flex-1">
              <!-- <FormsBaseInput
                label="Alt Text"
                placeholder="Alt Text"
                :required="true"
                v-model="selectedMedia[0].altText"
              /> -->
            </div>
            <div class="flex-1">
              <!-- <FormsBaseInput
                label="Caption"
                placeholder="Caption"
                :required="true"
                v-model="selectedMedia[0].caption"
              /> -->
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex-row gap-2 justify-end">
          <button class="btn btn__secondary px-2 py-1" @click="toggleSlideout = !toggleSlideout">Cancel</button>
          <button class="btn btn__primary px-2 py-1" @click="saveSelectedImage">Save</button>
        </div>
      </template>
    </Slideout>
  </div>
</template>

<style lang="scss" scoped></style>
