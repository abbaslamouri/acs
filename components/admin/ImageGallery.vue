<script setup>
const props = defineProps({
  gallery: {
    type: Array,
    required: true,
  },
  galleryIntro: String,
  // mediaReference: String,
})
const emit = defineEmits(['setMedia', 'placeMedia', 'removeMedia', 'selectFromProductGallery'])
// const mediaReference = useState('mediaReference')

// const { errorMsg, message, showMediaSelector, mediaReference, galleryMedia } = useAppState()

const showMediaSelector = ref(false)
const setMediaReference = () => {
  mediaReference.value = props.mediaReference
  showMediaSelector.value = true
}

const setMedia = (event) => {
  showMediaSelector.value = false
  emit('setMedia', event)
}
</script>

<template>
  <section class=" w-full bg-white p-2 br-5" id="details">
    <!-- <div class="flex flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Image Gallery</div>
    </div> -->
    <div class="flex flex-col items-center gap-4">
      <div class="intro flex flex-row items-center gap-2 bg-slate-200 p-2 rounded text-sm" v-if="galleryIntro">
        <IconsInfo class="w-5 h-5 fill-sky-600" />
        <p>{{ galleryIntro }}</p>
      </div>
      <AdminImageGalleryDisplay
        :gallery="gallery"
        :galleryIntro="galleryIntro"
        galleryType="product"
        @removeMedia="$emit('removeMedia', $event)"
        @placeMedia="$emit('placeMedia', $event)"
      />
      <button class="btn bg-gray-300 text-xs" @click.prevent="showMediaSelector = !showMediaSelector">
        <IconsImage />
        <span> Select New Images </span>
      </button>
      <p class="text-xs">PNG, JPG, and GIF Accepted</p>
    </div>
    <div class="" bg-white v-if="showMediaSelector">
      <div class="fixed inset-0 bg-gray-600 opacity-75 w-screen h-screen"></div>
      <div class="fixed top-[2vw] left-[2vw] w-[96vw] h-[96vh] bg-white">
        <LazyMediaUploader @setMedia="setMedia" @mediaSelectCancel="showMediaSelector = false" />
      </div>
    </div>
  </section>
  <!-- <div>
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Image Gallery</div>
      <div></div>
    </div>
    <div class="flex-col flex-col gap-2 items-center">
      <div
        class="intro flex-row items-center gap-1 bg-slate-200 py-05 px-2 br-3 text-sm border-red"
        v-if="galleryIntro"
      >
        <IconsInfo class="w-2 h-2 fill-sky-600" />
        <p>{{ galleryIntro }}</p>
      </div>
      <AdminImageGalleryDisplay
        :gallery="gallery"
        :galleryIntro="galleryIntro"
        galleryType="product"
        @removeMedia="$emit('removeMedia', $event)"
        @placeMedia="$emit('placeMedia', $event)"
      />
      <div class="w-full flex-col items-center gap-2">
        <div class="flex-row gap-2">
          <button class="btn btn__image-select text-xs" @click.prevent="setMediaReference">
            <IconsImage />
            <span> Select New Images </span>
          </button>
        </div>
      </div>
      <p class="text-xs">PNG, JPG, and GIF Accepted</p>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>

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
