<script setup>
const product = useState('product')
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="price">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Price</div>
      <div></div>
    </div>
    <div class="flex-row gap-2">
      <div class="flex-1"><FormsBaseInput label="Price" required currency v-model="product.price" /></div>
      <div class="flex-1"><FormsBaseInput label="Sale Price" currency v-model="product.salePrice" /></div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
