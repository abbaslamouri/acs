<script setup>
defineEmits(['toggleVariantsSlideout'])
const product = useState('product')
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="variants">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Variant</div>
      <button class="btn btn-heading" @click="$emit('toggleVariantsSlideout', true)">
        <span v-show="!product.variants.length">Add</span>
        <span v-show="product.variants.length">Edit</span>
      </button>
    </div>
    <div class="flex-col gap-2 items-center">
      <div class="text-sm" v-if="!product.variants.length">Different types of this product (e.g. size, color)</div>
      <table class="text-xs max-w-40" v-else>
        <colgroup>
          <col span="1" style="width: 20%" />
          <col span="1" style="width: 40%" />
          <col span="1" style="width: 40%" />
        </colgroup>
        <thead>
          <tr>
            <th class="text-center">Variant</th>
            <!-- <th class="text-center" v-for="term in variants[0].attrTerms" :key="term._id">
              {{ product.attributes.find((a) => a.attribute._id == term.parent._id).attribute.name }}
            </th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="(variant, index) in product.variants" :key="`variant-${index}`">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center" v-for="term in variant.attrTerms" :key="term._id">
              {{ term.name }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
