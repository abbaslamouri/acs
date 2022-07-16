<script setup>
import cloneDeep from 'lodash.clonedeep'

const props = defineProps({
  // countries: {
  //   type: Array,
  // },
  // states: {
  //   type: Array,
  // },
  // index: {
  //   type: Number,
  // },
  // orderCustomer: {
  //   type: Object,
  // },
  // orderShippingAddress: {
  //   type: Object,
  // },
  // orderBillingAddress: {
  //   type: Object,
  // },
  phoneNumbers: {
    type: Array,
    // default: [],
  },

  // phoneNumber: {
  //   type: Object,
  //   // default: [],
  // },

  // addressIndex: {
  //   type: Number,
  // },
  // phoneIndex: {
  //   type: Number,
  // },
  // showDefaultToggleField: {
  //   type: Boolean,
  //   default: false,
  // },
})

const emit = defineEmits(['insertNewPhoneNumber', 'removePhoneNumber', 'setDefaultPhoneNumber', 'updatePhoneNumbers'])

const localPhoneNumbers = ref(props.phoneNumbers)

// const user = useState('user')
// console.log(user.value)

// const { cart } = useCart()

const countries = inject('countries')
// const blankPhoneNumber = inject('blankPhoneNumber')

// const user.userAddresses[addressIndex].phoneNumbers[phoneIndex] = ref({ ...props.phoneNumber })
const phoneTypeOptions = [
  { key: 'Cell', name: 'Cell' },
  { key: 'Home', name: 'Home' },
  { key: 'Work', name: 'Work' },
]

const insertNewPhoneNumber = () => {
  localPhoneNumbers.value.push({
    phoneType: 'Cell',
    phoneNumber: '2165026378',
    phoneCountryCode: countries.value.find((c) => c.threeLetterCountryCode == 'USA'),
    default: false,
  })
}
// const localCartPhoneNumber = ref({ ...props.cartPhoneNumber })

// for (const prop in props.phoneNumbers) {
//   user.userAddresses[addressIndex].phoneNumbers[phoneIndex]s.value[prop] = props.phoneNumbers[prop]
// }
// const cart.billingAddress = ref({})
// const cart.shippingAddress = ref({})
// const cart.customer.phoneNumbers = ref([...props.orderPhoneNumbers])

// const blankPhoneNumber = { phoneType: 'Cell', phoneCountryCode: '62ae373e2347015d44d3fb2d', phoneNumber: '2165026378' }

// cart.shippingAddress.value =
//   props.orderShippingAddress && Object.values(props.orderShippingAddress).length
//     ? { ...props.orderShippingAddress }
//     : { addressType: 'Residential' }

// if (!props.orderPhoneNumbers.length) {
//   cart.customer.phoneNumbers.value = [blankPhoneNumber]
// } else {
//   for (const prop in props.orderPhoneNumbers) {
//     cart.customer.phoneNumbers.value[prop] = props.orderPhoneNumbers[prop]
//   }
// }
// const localEmail = ref(props.customerEmail)

// cart.shippingAddress.value = { ...props.orderShippingAddress }
// localEmail.value = props.email

// const updatePhoneCountryCode = (event, j) => {
//   console.log(event, j)

//   const country = props.countries.find((c) => c._id == event)
//   if (country) user.userAddresses[addressIndex].phoneNumbers[phoneIndex].value.phoneCountryCode = country

//   // user.userAddresses[addressIndex].phoneNumbers[phoneIndex]s[j].phoneCountryCode = $event.target.value
// }

const setPhoneNumber = (event, j) => {
  console.log(event, j)
  console.log('LPN', localPhoneNumbers.value)
  const selectedCountry = countries.value.find((c) => c._id == event)
  console.log(selectedCountry)
  if (selectedCountry) localPhoneNumbers.value[j].phoneCountryCode = selectedCountry

  // localPhoneNumbers[j].phoneCountryCode = countries.find((c) => c._id == $event)
}

const setDefaultPhoneNumber = (event, j) => {
  console.log(event, j)
  if (event) {
    for (const prop in localPhoneNumbers.value) {
      localPhoneNumbers.value[prop].default = false
    }
    localPhoneNumbers.value[j].default = true
  }
}

const removePhoneNumber = (j) => {
  console.log('HHHHHH', j)
  localPhoneNumbers.value.splice(j, 1)
  if (localPhoneNumbers.value.length === 1) {
    localPhoneNumbers.value[0].default = true
  } else {
    if (!localPhoneNumbers.value.find((p) => p.default)) localPhoneNumbers.value[0].default = true
  }
}

// watch(
//   () => user.userAddresses[addressIndex].phoneNumbers[phoneIndex].value,
//   (newVal) => {
//     emit('updatePhoneNumber', { phoneNumber: newVal, phoneIndex: props.index })
//   },
//   { deep: true }
// )

// watch(
//   () => cart.shippingAddress.value,
//   (newVal) => {
//     emit('updateOrderShippingAddress', newVal)
//   },
//   { deep: true }
// )

watch(
  () => localPhoneNumbers.value,
  (newVal) => {
    console.log('NV', newVal)
    emit('updatePhoneNumbers', newVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- {{ localPhoneNumbers }} -->
    <div class="flex flex-row items-center gap-4" v-for="(phoneNbr, j) in localPhoneNumbers" :key="`phone-number-${j}`">
      <div class="w-40">
        <FormsBaseSelect label="PhoneType" :value="localPhoneNumbers[j].phoneType" :options="phoneTypeOptions" />
      </div>
      <div class="w-40">
        <FormsBaseInput label="Phone Number" placeholder="Phone Number" v-model="localPhoneNumbers[j].phoneNumber" />
      </div>
      <div class="flex-1">
        <FormsBaseSelect
          :value="localPhoneNumbers[j].phoneCountryCode._id"
          @update:modelValue="setPhoneNumber($event, j)"
          label="Country Code"
          nullOption="-"
          :options="
            countries.map((c) => {
              return { key: c._id, name: c.countryName }
            })
          "
        />
        <!-- <label class="base-select">
          <div class="label text-xs px-1">Country</div>
          <select
            @change="localPhoneNumbers[j].phoneCountryCode = countries.find((c) => c._id == $event.target.value)"
            class="text-xs"
          >
            <option value=""></option>
            <option
              v-for="option in countries.map((c) => {
                return { key: c._id, name: c.countryName }
              })"
              :key="option.key"
              :value="option.key"
              :selected="localPhoneNumbers[j] && localPhoneNumbers[j].phoneCountryCode._id == option.key"
            >
              {{ option.name }}
            </option>
          </select>
        </label> -->
      </div>
      <div class="text-xs">
        <FormsBaseCheckbox
          v-model="localPhoneNumbers[j].default"
          label="Set as Default"
          @update:modelValue="setDefaultPhoneNumber($event, j)"
        />
      </div>
      <button class="btn" @click="removePhoneNumber(j)" v-if="localPhoneNumbers.length > 1">
        <IconsClose class="w-5 h-5" />
      </button>
    </div>
    <button
      class="btn btn-secondary self-end px-4 py-2 text-xs"
      @click="insertNewPhoneNumber"
      v-if="localPhoneNumbers.length <= 4"
    >
      Add Phone Number
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
