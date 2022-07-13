<script setup>
import cloneDeep from 'lodash.clonedeep'
const props = defineProps({
	// countries: {
	//   type: Array,
	//   required: true,
	// },

	// states: {
	//   type: Array,
	//   required: true,
	// },

	userAddress: {
		type: Object,
		required: true,
	},
	// addressIndex: {
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
	// orderPhoneNumbers: {
	//   type: Array,
	//   // default: [],
	// },
	// showDefaultToggleField: {
	//   type: Boolean,
	//   default: false,
	// },
})

const emit = defineEmits([
	'updateUserAddress',
	'setDefaultShippingAddress',
	'setDefaultBillingAddress',
	'insertNewPhoneNumber',
	'updatePhoneNumber',
])

// const user = useState('user')

const countries = inject('countries')
const states = inject('states')

// const localOrderCustomer = ref({})
const localUserAddress = ref(cloneDeep(props.userAddress))
// const user.userAddresses[addressIndex].shippingAddress = ref({})
// const user.userAddresses[addressIndex].customer.phoneNumbers = ref([...props.orderPhoneNumbers])

// const blankPhoneNumber = { phoneType: 'Cell', phoneCountryCode: '62ae373e2347015d44d3fb2d', phoneNumber: '2165026378' }

// user.userAddresses[addressIndex].value =
//   props.orderShippingAddress && Object.values(props.orderShippingAddress).length
//     ? { ...props.orderShippingAddress }
//     : { addressType: 'Residential' }

// if (!props.orderPhoneNumbers.length) {
//   user.userAddresses[addressIndex].customer.phoneNumbers.value = [blankPhoneNumber]
// } else {
//   for (const prop in props.orderPhoneNumbers) {
//     user.userAddresses[addressIndex].customer.phoneNumbers.value[prop] = props.orderPhoneNumbers[prop]
//   }
// }
// const localEmail = ref(props.customerEmail)

// user.userAddresses[addressIndex].value = { ...props.orderShippingAddress }
// localEmail.value = props.email

// const updatePhoneNumber = (payload) => {
//   console.log('HHHHHH', payload)
//   user.userAddresses[addressIndex].value.phoneNumbers[payload.index] = payload.phoneNumber
//   if (user.userAddresses[addressIndex].value.phoneNumbers[payload.index].isDefault) {
//     for (const prop in user.userAddresses[addressIndex].value.phoneNumbers) {
//       user.userAddresses[addressIndex].value.phoneNumbers[prop].isDefault = false
//     }
//     user.userAddresses[addressIndex].value.phoneNumbers[payload.index].isDefault = true
//   }
//   // user.userAddresses[addressIndex].phoneNumbers[k] = $event
// }

const setAddressState = (event) => {
	const selectedState = states.value.find((s) => s.id == event.target.value)
	if (selectedState) localUserAddress.state = selectedState
}

const setAddressCountry = (event) => {
	const selectedCountry = countries.value.find((c) => c.id == event.target.value)
	if (selectedCountry) localUserAddress.country = selectedCountry
}

const setDefaultShippingAddress = () => {
	for (const prop in user.value.userAddresses) {
		user.value.userAddresses[prop].defaultShippingAddress = false
	}
	localUserAddress.defaultShippingAddress = true
}

const setDefaultBillingAddress = () => {
	for (const prop in user.value.userAddresses) {
		user.value.userAddresses[prop].defaultBillingAddress = false
	}
	localUserAddress.defaultBillingAddress = true
}

// const insertNewPhoneNumber = () => {
//   user.userAddresses[addressIndex].customer.phoneNumbers.value.push({ phoneType: '', phoneCountryCode: '', phoneNumber: '' })
// }

// watch(
//   () => user.userAddresses[addressIndex].customer.phoneNumbers.value,
//   (newVal) => {
//     emit('updatePhoneNumbers', newVal)
//   },
//   { deep: true }
// )

watch(
	() => localUserAddress.value,
	(newVal) => {
		emit('updateUserAddress', newVal)
	},
	{ deep: true }
)
</script>

<template>
	<!-- <div class="flex-row gap-2 bg-slate-900"> -->
	<div class="flex-1 flex-col gap-1 bg-slate-50 p-2">
		<!-- {{ user }}=== -->
		<!-- <h3>Shipping Address</h3> -->
		<p>All fields with * are mandatory</p>
		<section class="flex-col gap-1">
			<div>
				<FormsBaseRadioGroup
					label="My delivery address is"
					v-model="localUserAddress.addressType"
					:options="[
						{ key: 'Residential', name: 'Residential' },
						{ key: 'Commercial', name: 'Commercial' },
					]"
				/>
			</div>
			<div class="flex-row items-center gap-2">
				<div class="min-w-20">
					<FormsBaseSelect
						label="Title"
						v-model="localUserAddress.title"
						:options="[
							{ key: 'Mr/Ms', name: 'Mr/Ms' },
							{ key: 'Ms', name: 'Ms' },
							{ key: 'Mr', name: 'Mr' },
							{ key: 'Dr', name: 'Dr' },
							{ key: 'Mrs', name: 'Mrs' },
							{ key: '', name: '-' },
						]"
					/>
				</div>
				<div class="flex-1">
					<FormsBaseInput
						class="flex-1"
						label="Name"
						placeholder="Name"
						v-model="localUserAddress.name"
						:required="true"
					/>
				</div>
			</div>
			<!-- <div class="flex-1">
        <FormsBaseInput class="flex-1" label="Email" placeholder="Email" v-model="localUserAddress.email" />
      </div> -->
		</section>
		<section class="flex-col gap-1 border border-slate-400 p-2 br-3">
			<AdminUsersPhoneNumbersForm
				:phoneNumbers="localUserAddress.phoneNumbers"
				@updatePhoneNumbers="localUserAddress.phoneNumbers = $event"
			/>
			<!-- <button
        class="btn btn__secondary items-self-end px-2 py-05"
        @click="$emit('insertNewPhoneNumber')"
        :disabled="localUserAddress.phoneNumbers.length >= 4"
      >
        Add Phone Number
      </button> -->
			<!-- </div> -->
			<!-- <div
        class="flex-row gap-2 items-center"
        v-for="(phone, j) in localUserAddress.phoneNumbers"
        :key="`${phone}-${j}`"
      >
        <div class="min-w-14">
          <FormsBaseSelect
            label="PhoneType"
            v-model="phone.phoneType"
            :options="[
              { key: 'Cell', name: 'Cell' },
              { key: 'Home', name: 'Home' },
              { key: 'Work', name: 'Work' },
            ]"
          />
        </div>
        <div class="min-w-20">
          <FormsBaseInput label="Phone Number" placeholder="Phone Number" v-model="phone.phoneNumber" />
        </div>
        <div class="flex-1">
          <FormsBaseSelect
            v-model="phone.phoneCountryCode"
            label="Country Code"
            nullOption="-"
            :options="
              countries.map((c) => {
                return { key: c.id, name: c.countryName }
              })
            "
          />
        </div>
        <button
          class="btn btn__secondary"
          @click="localUserAddress.phoneNumbers.splice(j, 1)"
          v-if="localUserAddress.phoneNumbers.length > 1"
        >
          <IconsMinus />
        </button>
      </div>
      <button
        class="btn btn__secondary items-self-end px-2 py-05"
        @click="$emit('insertNewPhoneNumber')"
        :disabled="localUserAddress.phoneNumbers.length >= 4"
      >
        Add Phone Number
      </button> -->
		</section>
		<section>
			<FormsBaseInput label="Company" placeholder="Company" v-model="localUserAddress.company" />
			<div class="flex-row gap-2">
				<div class="flex-1">
					<FormsBaseInput label="Address Line 1" placeholder="Address Line 1" v-model="localUserAddress.addressLine1" />
				</div>
				<div class="flex-1">
					<FormsBaseInput label="Address Line 2" placeholder="Address Line 2" v-model="localUserAddress.addressLine2" />
				</div>
			</div>
			<div class="flex-row gap-2 items-center">
				<div class="flex-1">
					<FormsBaseInput label="City" placeholder="City" v-model="localUserAddress.city" />
				</div>
				<div class="flex-1">
					<!-- <FormsBaseSelect
            v-model="localUserAddress.state"
            label="State"
            nullOption="-"
            :options="
              states.map((s) => {
                return { key: s.id, name: s.name }
              })
            "
          /> -->
					<label class="base-select">
						<div class="label text-xs px-1">State</div>
						<select @change="setAddressState" class="text-xs">
							<option value=""></option>
							<option
								v-for="option in states.map((c) => {
									return { key: c.id, name: c.name }
								})"
								:key="option.key"
								:value="option.key"
								:selected="localUserAddress && localUserAddress.state && localUserAddress.state.id == option.key"
							>
								{{ option.name }}
							</option>
						</select>
					</label>
				</div>
			</div>
			<div class="flex-row items-center gap-2">
				<div class="min-w-20">
					<FormsBaseInput label="Postal Code" placeholder="Postal Code" v-model="localUserAddress.postalCode" />
				</div>
				<div class="flex-1">
					<!-- <FormsBaseSelect
            v-model="localUserAddress.country"
            label="Country"
            nullOption="-"
            :options="
              countries.map((c) => {
                return { key: c.id, name: c.countryName }
              })
            "
          /> -->
					<label class="base-select">
						<div class="label text-xs px-1">Country</div>
						<select @change="setAddressCountry" class="text-xs">
							<option value=""></option>
							<option
								v-for="option in countries.map((c) => {
									return { key: c.id, name: c.countryName }
								})"
								:key="option.key"
								:value="option.key"
								:selected="localUserAddress && localUserAddress.country && localUserAddress.country.id == option.key"
							>
								{{ option.name }}
							</option>
						</select>
					</label>
				</div>
			</div>
		</section>
		<section class="delivery-instructions">
			<div class="field-group">
				<FormsBaseTextarea label="Delivery Instructions" rows="5" v-model="localUserAddress.deliveryInstructions" />
			</div>
		</section>
		<section class="items-self-start flex-row gap-4">
			<FormsBaseToggle
				label="Set as the default delivery address"
				v-model="localUserAddress.defaultShippingAddress"
				@update:modelValue="$emit('setDefaultShippingAddress')"
			/>
			<FormsBaseToggle
				label="Set as the default billing address"
				v-model="localUserAddress.defaultBillingAddress"
				@update:modelValue="$emit('setDefaultBillingAddress')"
			/>
		</section>
	</div>
	<!-- <div class="bg-slate-50 p-2 min-w-30">
      <div class="flex-col gap-1">
        <h3>Shipping Address</h3>
        <FormsBaseCheckbox label="Same as Shipping" v-model="localUserAddress.billingAddress.sameAsShipping" />
      </div>
      <div v-if="!localUserAddress.billingAddress.sameAsShipping">
        <FormsBaseInput
          label="Address Line 1"
          placeholder="Address Line 1"
          v-model="localUserAddress.billingAddress.addressLine1"
        />
        <FormsBaseInput
          label="Address Line 2"
          placeholder="Address Line 2"
          v-model="localUserAddress.billingAddress.addressLine2"
        />
        <FormsBaseInput label="City" placeholder="City" v-model="localUserAddress.billingAddress.city" />
        <FormsBaseSelect
          v-model="localUserAddress.billingAddress.state"
          label="State"
          nullOption="-"
          :options="
            states.map((s) => {
              return { key: s.id, name: s.name }
            })
          "
        />
        <FormsBaseInput
          label="Postal Code"
          placeholder="Postal Code"
          v-model="localUserAddress.billingAddress.postalCode"
        />
        <FormsBaseSelect
          v-model="localUserAddress.billingAddress.country"
          label="Country"
          nullOption="-"
          :options="
            countries.map((c) => {
              return { key: c.id, name: c.countryName }
            })
          "
        />
      </div>
    </div> -->
	<!-- </div> -->
</template>

<style lang="scss" scoped></style>
