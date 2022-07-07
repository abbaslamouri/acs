<script setup>
defineProps({
  index: {
    type: Number,
  },
})

const product  = useState('product')</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Description</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div class="flex-col gap-2">
        <FormsBaseTextarea label="Description" v-model="product.variants[index].description" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
