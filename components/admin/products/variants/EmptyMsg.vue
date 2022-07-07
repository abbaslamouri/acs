<script setup>
defineEmits(['closeSlideout'])

const product  = useState('product')</script>

<template>
  <div class="flex-row items-center justify-center mt-10 text-sm">
    <div class="flex-col gap-2 maxw60 bg-white p-4 br-5 shadow-md">
      <div class="flex-col gap-2" v-if="product._id">
        <h3>Set up attributes for this product</h3>
        <p class="message">
          Variants help you to sell products with slight differences, but are still the same product. For example, you
          might sell a t-shirt in different colors, or a plant pot in different sizes.<br /><br />You can configure
          variants to have their own price, SKU, and stock inventory. To get started, create attributes and attribute
          terms for your variants. Attributes define the type of variant (e.g. color). Terms are a choice your customer
          can make within that group (e.g. blue).
        </p>
      </div>

      <div class="flex-col gap-2" v-else>
        <p class="flex-row items-center gap2 bg-sky-100 p-2 br-3">
          <IconsInfo />Using this feature requires you to save the product first.
        </p>
        <button class="btn btn__primary items-self-end px-3 py-05" @click="$emit('closeSlideout')">Go Back</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
