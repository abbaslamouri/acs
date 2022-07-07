<script setup>
defineProps({
  allAttributes: {
    type: Array,
  },
})
const product = useState('product')
</script>

<template>
  <div class="flex-row items-center justify-center mt-10 text-sm shadow-md">
    <div class="bg-slate-100 maxw-60 p-4 flex-col gap-2 br-5">
      <h3>Set up attributes for this product</h3>
      <div class="message">
        create attributes and attribute terms for your product. Attributes define the type of variant (e.g. color).
        Terms are a choice your customer can make within that group (e.g. blue).
      </div>
      <div class="flex-row items-center gap-2 bg-slate-50 p-2 br-3" v-if="!product.id">
        <IconsInfo />Using this feature requires you to save the product first.
      </div>
      <div v-if="!allAttributes.length" class="flex-col gap-1 font-bold">
        <p>You have not created any attributes yet. Click the link below to creaate new attributes for your peoducts</p>
        <NuxtLink class="link text-md flex-row items-center" :to="{ name: 'admin-ecommerce-attributes' }">
          <span>Go to Attributes</span><IconsArrowEast class="w-2 h-2"/>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
