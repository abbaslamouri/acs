<script setup>
const product  = useState('product')
defineEmits(['toggleAttributesSlideout'])
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="attributes">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Attributes</div>
      <button class="btn btn-heading" @click="$emit('toggleAttributesSlideout', true)">
        <span v-show="!product.attributes.length">Add</span>
        <span v-show="product.attributes.length">Edit</span>
      </button>
    </div>
    <div class="flex-col gap-2">
      <div class="content flex-col gap-1">
        <div>Different attributes for this product (e.g. size, color)</div>
        <div class="attributes flex-col gap-1">
          <div
            class="attribute text-xs flex-row gap-1"
            v-for="attribute in product.attributes"
            :key="attribute.attribute.id"
          >
            <p class="attribute-name">{{ attribute.attribute.name }}:</p>
            <div class="terms flex-1 flex-row gap-1">
              <div
                class="term bg-slate-500 py-02 px-1 text-slate-50 br-5"
                v-for="term in attribute.terms"
                :key="term.id"
              >
                <span class="term-name">{{ term.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
