<script setup>
const props = defineProps({
  gallery: {
    type: Object,
  },
})
// const gallery = useState('gallery')

const emit = defineEmits(['updateDetails'])
const localDetails = ref({
  name: props.gallery.name,
  sortOrder: props.gallery.sortOrder,
  description: props.gallery.description,
})

// const details = reactive({
//   name: props.slider.name ? props.slider.name : '',
//   // permalink: props.slider.permalink,
//   sortOrder: props.slider.sortOrder ? props.slider.sortOrder : 0,
//   description: props.slider.description ? props.slider.description : '',
// })

// const updateDetails = () => {
//   emit('updateDetails', details)
// }

watch(
  () => localDetails.value,
  (currentVal) => {
    // console.log(currentVal)
    // updateDetails()
    emit('updateDetails', currentVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-lg w-full bg-white p-2 br-5" id="details">
    <div class="flex flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Details</div>
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2">
        <div class="flex-1">
          <FormsBaseInput label="Name" placeholder="Name" required v-model="localDetails.name" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Order" placeholder="Order" v-model="localDetails.sortOrder" />
        </div>
      </div>
      <FormsBaseTextarea label="Description" placeholder="Description" v-model="localDetails.description" />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
