<script setup>
const product = useState('product')
</script>

<template>
  <ul class="">
    <li><a href="#general-info">General</a></li>
    <li><a href="#price">Price</a></li>
    <li><a href="#stock">Stock</a></li>
    <li><a href="#image-gallery">Image Gallery</a></li>
    <li v-if="product._id && product.productType === 'variable'"><a href="#attributes">Attributes</a></li>
    <li v-if="product.id && product.attributes && product.attributes.length && product.productType === 'variable'">
      <a href="#variants">Variants</a>
    </li>
    <li><a href="#details">Details</a></li>
    <li><a href="#shipping-options">Shipping Options</a></li>
    <li><a href="#digital-delivery">Digital Delivery</a></li>
    <li><a href="#extra-fields">Extra Fields</a></li>
    <li><a href="#seo">SEO</a></li>
    <li><a href="#misc">Misc.</a></li>
  </ul>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

li {
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    background-color: $slate-200;
  }
}
</style>
