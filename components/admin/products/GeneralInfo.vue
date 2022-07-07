<script setup>
const product = useState('product')
</script>

<template>
  <section class="shadow-lg border w-full bg-white p-2 flex flex-col gap-4 rounded" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border border-transparent border-b-gray-400 font-bold py-1">General Info</div>
    </div>
    <div class="flex-1 flex-row gap-2">
      <div class="flex-1">
        <FormsBaseInput label="ACS Part Number" placeholder="ACS Part Number" :required="true" v-model="product.name" />
      </div>
      <div class="flex-1">
        <!-- <FormsBaseInput label="OEM" placeholder="OEM" :required="true" v-model="product.oemPartNumber.parent.name" /> -->
      </div>
      <!-- <FormsBaseInput
        label="OEM Part Number"
        placeholder="OEM Part Number"
        :required="true"
        v-model="product.oemPartNumber.name"
      /> -->
    </div>
    <FormsBaseInput label="Description" placeholder="Description" :required="true" v-model="product.description" />
  </section>
</template>

<style lang="scss" scoped></style>
