<script setup>
defineEmits(['saveUser'])

const product = useState('product')
const { fetchAll } = useHttp()

const selectedCategoryIds = ref([])

// const response = await fetchAll('categories')
// const allCategories = response.docs

// selectedCategoryIds.value = product.value.categories
//   ? [
//       ...product.value.categories.map((c) => {
//         return c._id
//       }),
//     ]
//   : []

// const updateProductCategories = (event) => {
//   product.value.categories = []
//   for (const prop in selectedCategoryIds.value) {
//     const category = allCategories.find((c) => c._id == selectedCategoryIds.value[prop])
//     product.value.categories.push(category)
//   }
// }
</script>

<template>
  <section class=" rounded p-2" id="user-info">
    <div class=""></div>
    <div class="w-full">
      <button class="w-full text-center btn-checkout px-2 py-1" @click.prevent="$emit('saveUser')">Save Changes</button>
    </div>
  </section>
  <!-- <div class="flex-col gap-2"> -->
  <!-- <section class="shadow-md w-full bg-white p-2 rounded"> -->
  <!-- <div class="flex-col gap-2"> -->
  <!-- <div class="flex-col gap-2"> -->

  <!-- <FormsBaseToggle v-model="product.active" label="Active" /> -->
  <!-- </div> -->
  <!-- </div> -->
  <!-- </section> -->
  <!-- <section class="shadow-md w-full bg-white p-2 br-5">
      <div class="flex-row items-center justify-between text-sm mb-1">
        <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Categories</div>
        <div></div>
      </div>
      <div class="flex-col gap-2">
        <div class="">
          <FormsBaseSelectMultiple
            v-model="selectedCategoryIds"
            @update:modelValue="updateProductCategories"
            label="Select Categories"
            :options="
              allCategories.map((c) => {
                return { key: c._id, name: c.name }
              })
            "
          />
        </div>
        <NuxtLink class="link" :to="{ name: 'admin-ecommerce-categories' }">
          <span>Edit Categories</span>
        </NuxtLink>
      </div>
    </section> -->
  <!-- </div> -->
</template>

<style lang="scss" scoped></style>
