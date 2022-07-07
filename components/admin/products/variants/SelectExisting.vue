<script setup>
const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['galleryImagesSet'])

const config = useRuntimeConfig()
const product = useState('product')
const galleryThumbRef = ref([])
const selectedImages = ref([])

const setSelectedImages = (image, j) => {
  galleryThumbRef.value[j].classList.toggle('selected')
  const i = selectedImages.value.findIndex((img) => img._id == image._id)
  if (i === -1) selectedImages.value.push(image)
  else selectedImages.value.splice(i, 1)
}

const SetVariantGallery = () => {
  product.value.variants[props.index].gallery = [
    ...product.value.variants[props.index].gallery,
    ...selectedImages.value,
  ]
  selectedImages.value = []
  emit('galleryImagesSet', false)
}
const cancelSelectedImages = () => {
  selectedImages.value = []
  emit('galleryImagesSet', false)
}
</script>

<template>
  <div>
    <div class="overlay"></div>
    <div class="wrapper fixed top-0 left-0 flex-col items-center justify-center w-full h-full z-9">
      <div class="content flex-col gap-2 max-w-75-percent br-5 bg-slate-50 py-4 px-6 shadow-md">
        <h3>Select from product images</h3>
        <div class="thumbs gap-2 p-4 border border-slate-200 br-5" v-if="product.gallery">
          <div
            v-for="(image, j) in product.gallery.filter(
              (img) => !product.variants[index].gallery.find((item) => item._id == img._id)
            )"
            :key="image._id"
            class="thumb shadow-md relative p-1 br-3 cursor-pointer"
            :class="{
              selected: product.variants[index].gallery.find((img) => img._id == image._id),
            }"
            :ref="(el) => (galleryThumbRef[j] = el)"
            @click="setSelectedImages(image, j)"
          >
            <div>
              <img
                class="w-full h-full fit"
                :src="`${config.backendUrl}/${image.path}/${image.name}`"
                :alt="`${image.name} Photo`"
              />
              <span
                v-if="selectedImages.find((img) => img._id == image._id)"
                class="check absolute top-0 left-0 w-2 h-2 br-50per flex-row items-center justify-center"
                ><IconsSuccess class="fill-slate-50"
              /></span>
            </div>
          </div>
        </div>
        <div class="actions flex-row justify-end gap-2">
          <button class="btn btn__secondary px-2 py-1" @click.prevent="cancelSelectedImages">
            <span> Cancel</span>
          </button>
          <button class="btn btn__primary px-2 py-1" @click.prevent="SetVariantGallery">
            <span> Select</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

.thumbs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  .thumb {
    display: flex;
    &.selected {
      border: 1px solid $green-600;

      .check {
        background-color: $green-600;
        padding: 0.25rem;
        transform: translate(-50%, -50%);
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
