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
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Stock Management</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <div class="flex-row gap-2">
        <div class="flex-1">
          <FormsBaseInput label="SKU" placeholder="SKU" v-model="product.variants[index].sku" />
        </div>
        <div class="flex-1 flex-col gap-1">
          <FormsBaseInput
            label="Stck Qty"
            placeholder="Stock Qty"
            v-model="product.variants[index].stockQty"
            :readonly="!product.manageInventory"
          />
          <div>Enable product manageInventory to set Stock Qty.</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
