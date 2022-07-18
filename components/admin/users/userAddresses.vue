<script setup>
defineProps({
  user: {
    type: Object,
    required: true,
  },
})

defineEmits(['insertNewAddress', 'editAddress', 'deleteAddress', 'switchShippingAddress', 'switchBillingAddress'])
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <div
        class="customer-address flex flex-row items-start justify-between p-4 border border-slate-300 rounded"
        v-for="(userAddress, i) in user.userAddresses"
        :key="userAddress.id"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-3 text-xs">
            <h3 class="text-xl">Address</h3>
            <AdminUsersUserAddress :userAddress="userAddress" />
            <div>
              <div class="text-green-700 flex flex-row items-center gap-2" v-if="userAddress.defaultShippingAddress">
                <IconsCheck class="w-5 h-5 fill-green-700" /> <span>Default shipping address</span>
              </div>
              <div class="text-green-700 flex flex-row items-center gap-2" v-if="userAddress.defaultBillingAddress">
                <IconsCheck class="w-5 h-5 fill-green-700" /> <span>Default billing address</span>
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-1">
            <button class="btn btn-secondary px-4 py-2 text-xs rounded" @click="$emit('editAddress', i)">
              Edit Address
            </button>
            <button
              class="btn btn-secondary px-4 py-2 text-xs rounded"
              v-if="!userAddress.defaultBillingAddress && !userAddress.defaultShippingAddress"
              @click="$emit('deleteAddress', i)"
            >
              Delete Address
            </button>
          </div>
          <div class="flex flex-col gap-1 items-start text-xs">
            <button
              class="text-yellow-700"
              @click="$emit('switchShippingAddress', i)"
              v-if="!userAddress.defaultShippingAddress"
            >
              Set as the default shipping address
            </button>
            <button
              class="text-yellow-700"
              @click="$emit('switchBillingAddress', i)"
              v-if="!userAddress.defaultBillingAddress"
            >
              Set as the default billing address
            </button>
          </div>
        </div>
        <div class="flex flex-col text-xs">
          <h3 class="text-lg">Phone Numbers</h3>
          <div class="" v-for="userPhoneNumber in userAddress.phoneNumbers">
            <AdminUsersUserPhoneNumber :userPhoneNumber="userPhoneNumber" />
          </div>
        </div>
      </div>
    </div>
    <button
      class="btn btn-secondary px-4 py-1 self-end text-xs"
      :class="{ disabled: !user.id }"
      @click="$emit('insertNewAddress')"
    >
      Add Address
    </button>
  </div>
</template>

<style lang="scss"></style>
