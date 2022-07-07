<script setup>
const product  = useState('product')</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="stock">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Stock</div>
      <div></div>
    </div>
    <div class="flex-col gap-2">
      <FormsBaseInput label="SKU" placeholder="SKU" v-model="product.sku" />

      <div class="flex-row gap-2 items-center">
        <div class="flex-1">
          <FormsBaseToggle v-model="product.manageInventory" label="Manage Inventory" />
        </div>
        <div class="flex-row gap-1">
          <FormsBaseInput
            label="Available Stock"
            placeholder="Available Stock"
            v-model="product.stockQty"
            :readonly="!product.manageInventory"
          />
        </div>
      </div>
      <FormsBaseSelect
        label="Allow Backorders"
        :options="[
          { key: 'allow', name: 'Allow' },
          { key: 'disallow', name: 'Do not allow' },
          { key: 'notify', name: 'Allow, but notify customer' },
        ]"
        v-model="product.allowBackorders"
      />
      <FormsBaseInput
        label="Low Stock Threshold"
        placeholder="Low stock Threshold"
        :required="true"
        v-model="product.lowStockThreshold"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
