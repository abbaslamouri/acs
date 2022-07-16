<script setup>
defineProps({
  userPhoneNumber: {
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
  <div class="text-xs flex gap-2">
    <div v-if="userPhoneNumber.phoneCountryCode">+{{ userPhoneNumber.phoneCountryCode.phoneCode }}</div>
    <div class="flex flex-row gap-3">
      <span>{{ userPhoneNumber.phoneNumber }}</span
      ><span class="text-green-700" v-if="userPhoneNumber.default">Default phone Number</span>
    </div>
  </div>

  <!-- </div> -->
  <!-- </div>
      </div>
    </div> -->

  <!-- </div> -->
</template>

<style lang="scss" scoped></style>
