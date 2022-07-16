<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updateUser', 'saveUserInfo'])

const localUser = ref(props.user)

watch(
  () => localUser.value,
  (newVal) => {
    emit('updateUser', newVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="border rounded p-4 shadow-lg" id="user-info">
    <div class="admin-section-header">User Information</div>
    <div class="flex flex-col gap-5">
      <div class="flex flex-row gap-2">
        <div class="flex-1">
          <FormsBaseInput label="Name" placeholder="Name" :required="true" v-model="localUser.name" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Email" placeholder="Email" :required="true" v-model="localUser.email" />
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div class="flex-1">
          <FormsBaseInput
            label="Password"
            placeholder="Password"
            :required="true"
            v-model="localUser.password"
            :readonly="!!localUser.id"
          />
        </div>
        <div class="min-w-sm">
          <FormsBaseSelect
            label="Role"
            :value="localUser.role"
            :options="[
              { key: 'admin', name: 'Admin' },
              { key: 'shop-manager', name: 'Shop Manager' },
              { key: 'customer', name: 'Customer' },
              { key: 'user', name: 'User' },
              { key: '', name: '-' },
            ]"
          />
        </div>
      </div>
      <div>
        <div class="flex flex-row gap-4">
          <FormsBaseToggle label="Verified" v-model="localUser.verified" />
          <FormsBaseToggle label="Active" v-model="localUser.active" />
        </div>
      </div>
      <button class="btn btn-primary px-4 py-1 self-end text-sm" @click="$emit('saveUserInfo')">
        Save User Information
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
