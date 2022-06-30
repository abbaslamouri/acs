<script setup>
import cloneDeep from 'lodash.clonedeep'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updateUser', 'saveUserInfo'])

const localUser = ref(cloneDeep(props.user))

watch(
  () => localUser.value,
  (newVal) => {
    emit('updateUser', newVal)
  },
  { deep: true }
)
</script>

<template>
  <section class="shadow-lg border xxshadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">User Information</div>
      <div></div>
    </div>
    <div class="flex-col gap-1">
      <div class="flex-1 flex-row gap-2">
        <div class="flex-1">
          <FormsBaseInput label="Name" placeholder="Name" :required="true" v-model="localUser.name" />
        </div>
        <div class="flex-1">
          <FormsBaseInput label="Email" placeholder="Email" :required="true" v-model="localUser.email" />
        </div>
      </div>
      <div>
        <div class="flex-1">
          <FormsBaseInput
            label="Password"
            placeholder="Password"
            :required="true"
            v-model="localUser.password"
            :readonly="!!localUser.id"
          />
        </div>
      </div>
      <div>
        <div class="flex-1 flex-row gap-4">
          <div class="min-w-20">
            <FormsBaseSelect
              label="Role"
              v-model="localUser.role"
              :options="[
                { key: 'admin', name: 'Admin' },
                { key: 'shop-manager', name: 'Shop Manager' },
                { key: 'customer', name: 'Customer' },
                { key: 'user', name: 'User' },
                { key: '', name: '-' },
              ]"
            />
          </div>
          <FormsBaseToggle label="Verified" v-model="localUser.verified" />
          <FormsBaseToggle label="Active" v-model="localUser.active" />
        </div>
      </div>
      <button class="btn btn__secondary px-2 py-05 items-self-end text-xs" @click="$emit('saveUserInfo')">
        Save User Information
      </button>
    </div>
  </section>
</template>

<style lang="" scoped></style>
