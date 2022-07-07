<script setup>
defineProps({
  index: {
    type: Number,
  },
})

const product  = useState('product')</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="details">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Price</div>
      <div></div>
    </div>
    <div class="flex-row gap-2">
      <div class="flex-1">
        <FormsBaseInput label="Price" placeholder="Price" currency v-model="product.variants[index].price" />
      </div>
      <div class="flex-1">
        <FormsBaseInput
          label="Sale Price"
          placeholder="Sale Price"
          currency
          v-model="product.variants[index].salePrice"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
