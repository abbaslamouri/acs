<script setup>
defineProps({
  userAddress: {
    type: Object,
  },
})

// const emit = defineEmits([
//   'setDefaultShippingAddress',
//   // 'setDefaultBillingAddress',
// ])

// const localDefaultShippingAddress = ref(props.userAddress.defaultShippingAddress)

// watch(
//   () => localDefaultShippingAddress.value,
//   (newVal) => {
//     emit('setDefaultShippingAddress', newVal)
//   },
//   { deep: true }
// )
</script>

<template>
  <!-- <div class="flex-row gap-4 text-xs">
    <div class="flex-col gap-1 min-w-20">
      <div class="flex-col"> -->
  <!-- <div class="flex-row items-center gap-2"> -->
  <!-- <div class="flex-col gap-1"> -->
  <div class="text-xs">
    <div class="flex flex-row gap-1">
      <div v-if="userAddress.title">{{ userAddress.title }}.</div>
      <div>{{ userAddress.name }}</div>
    </div>
    <div>{{ userAddress.company }}</div>
    <div>{{ userAddress.addressLine1 }}</div>
    <div>{{ userAddress.addressLine2 }}</div>
    <div class="flex flex-row gap-1" v-if="userAddress.city && userAddress.state">
      <div>{{ userAddress.city }},</div>
      <div v-if="userAddress.state">
        {{ userAddress.state.name }}
      </div>
      <div>{{ userAddress.postalCode }}</div>
    </div>
    <div v-if="userAddress.country">
      {{ userAddress.country.countryName }}
    </div>
  </div>

  <!-- </div> -->
  <!-- </div>
      </div>
    </div> -->

  <!-- </div> -->
</template>

<style lang="scss" scoped></style>
