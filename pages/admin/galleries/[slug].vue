<script setup>
import slugify from 'slugify'
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('Slider | YRL')

const config = useRuntimeConfig()
// const mediaReference = useState('mediaReference')
const errorMsg = useState('errorMsg')

// const { errorMsg, message, galleryMedia } = useAppState()
const { fetchAll, saveMedia, saveDoc } = useHttp()
const route = useRoute()
const router = useRouter()

// const sliders = ref([])
// const gallery = ref()
const showDropZone = ref(false)
const gallery = ref({ sortOrder: 0, media: [] })

const galleryIntro = ref('This image gallery contains all images associated with this gallery.')

let response = null
// useState('gallery', () => {
//   return { sortOrder: 0, media: [] }
// })
const slug = route.params.slug === '_' ? null : route.params.slug
const params = {
  match: `slug[eq]=${slug}`,
  project: '',
  lookup: 'media',
}
// if (!keyword.value) delete params.keyword

console.log('slug', slug)

// if (route.params.slug && route.params.slug !== "_") {
response = await fetchAll('galleries', params)
console.log(response)
if (response.docs.length) gallery.value = response.docs[0]
// }
// else gallery.value = { sortOrder: 0, gallery: [] }

// response = await fetchAll('sliders')
// sliders.value = response.docs

const updateDetails = (details) => {
  gallery.value.name = details.name
  gallery.value.description = details.description
  gallery.value.sortOrder = details.sortOrder
}

const addImagesToGallery = async (images) => {
  if (!images.length) return
  for (const prop in images) {
    const i = gallery.value.gallery.findIndex((m) => m.id == images[prop].id)
    if (i === -1) gallery.value.gallery.push(images[prop])
  }
}

const saveGallery = async () => {
  if (!gallery.value.name) return (errorMsg.value = 'Gallery name is required')
  gallery.value.slug = slugify(gallery.value.name, { lower: true })
  console.log('GGGG', gallery.value)
  response = await saveDoc('galleries', gallery.value)
  console.log(response)
  if (!response) return
  router.push({ name: 'admin-galleries' })
}

// const setSelectedMedia = (event) => {
//   console.log('EE', event)
//   gallery.value.media = event
// }

// watch(
//   () => galleryMedia.value,
//   (currentVal) => {
//     if (mediaReference.value === 'galleryMedia') addImagesToGallery(currentVal)
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="hfull flex flex-col items-center gap-2 p-3">
    <Title>{{ pageTitle }}</Title>
    <header class="flex flex-col gap-2 w-full max-width-130">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="text-yellow-700 flex flex-row" :to="{ name: 'admin-galleries' }">
          <IconsArrowWest class="fill-yellow-700" />
          <span>Gallery</span>
        </NuxtLink>
      </div>
      <h3 class="header">Edit Gallery</h3>
      {{ gallery }}
    </header>
    <main class="w-full flex flex-row gap-4">
      <div class="flex-1 flex flex-col gap-2">
        <AdminGalleriesDetails :gallery="gallery" @updateDetails="updateDetails" />
        <section class="shadow-lg p-2 flex-col gap-2 bg-white" id="image-gallery">
          <AdminImageGallery
            :gallery="gallery.media"
            :galleryIntro="galleryIntro"
            @removeGalleryImage="gallery.media.splice($event, 1)"
            @setGalleryImage="gallery.media[$event.index] = $event.value"
            @setSelectedMedia="gallery.media = $event"
          />
        </section>
      </div>
      <div class="w-[16rem]">
        <AdminGalleriesRightNav :gallery="gallery" @saveGallery="saveGallery" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

// main {
//   display: grid;
//   grid-template-columns: 1fr 30rem;
//   gap: 2rem;
//   align-items: flex-start;

//   .center-col {
//     display: flex;
//     flex-direction: column;
//     gap: 3rem;
//   }

//   .right-col {
//     position: sticky;
//     top: 10rem;
//     display: flex;
//     flex-direction: column;
//     gap: 2rem;
//   }
// }
</style>
