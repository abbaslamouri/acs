<script setup>
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('User | YRL')
const { fetchAll, saveDoc } = useHttp()
const route = useRoute()
const router = useRouter()
const errorMsg = useState('errorMsg')
const addressToEditIndex = ref('')
const showAddressFormModal = ref(false)
const countries = ref([])
const states = ref([])
let response
const user = ref({
  name: 'Abbas Lamouri',
  email: '    AbbasLamouri@yrlus.com',
  password: 'adrar0714',
  userAddresses: [],
  media: [],
})
const galleryIntro = ref('This image gallery contains all images associated with this user.')

const id = route.params.id === '_' ? null : route.params.id

if (id) {
  const params = {
    match: `_id[eq]=${id}`,
    project: '',
    lookup: 'media',
  }
  response = await fetchAll('users', params)
  console.log('USER', response)
  if (response.docs.length) user.value = response.docs[0]
}

const currentUserAddress = JSON.stringify(user.value.userAddresses)

response = await fetchAll('countries', { sort: 'countryName', limit: 300 })
if (response.docs.length) countries.value = response.docs
provide('countries', countries)

response = await fetchAll('states', { sort: 'name', limit: 100 })
if (response.docs.length) states.value = response.docs
provide('states', states)

const insertNewAddress = () => {
  user.value.userAddresses.push({
    addressType: 'Residential',
    // // email: 'abbaslamnouri1@yrlus.com',
    title: 'Ms',
    name: 'Nelly Vileikis',
    company: 'YRL Consulting LLC',
    addressLine1: '599 Deep Woods Dr.',
    addressLine2: 'Room 101',
    city: 'Aurora',
    postalCode: '44202',
    state: 'Alaska',
    country: countries.value.find((c) => c.threeLetterCountryCode === 'USA'),
    phoneNumbers: [
      {
        phoneType: 'Cell',
        phoneNumber: '216502637800',
        phoneCountryCode: countries.value.find((c) => c.threeLetterCountryCode == 'USA'),
        default: true,
      },
    ],
    deliveryInstructions: 'Some delivery instructions1',
  })
  if (user.value.userAddresses.length == 1) {
    user.value.userAddresses[0].defaultShippingAddress = true
    user.value.userAddresses[0].defaultBillingAddress = true
  } else {
    user.value.userAddresses[0].defaultShippingAddress = false
    user.value.userAddresses[0].defaultBillingAddress = false
  }
  addressToEditIndex.value = user.value.userAddresses.length - 1
  showAddressFormModal.value = true
}

const editAddress = (i) => {
  addressToEditIndex.value = i
  showAddressFormModal.value = true
}

const deleteAddress = async (i) => {
  if (!confirm('Are you sure you want to delete this address?')) return
  console.log('user', user.value)
  if (!user.value._id) return (errorMsg.value = 'Nothing to delete')
  user.value.userAddresses.splice(i, 1)
  const defaultShipAddress = user.value.userAddresses.find((a) => a.defaultShippingAddress)
  if (!defaultShipAddress) user.value.userAddresses[0].defaultShippingAddress = true
  const defaultBillAddress = user.value.userAddresses.find((a) => a.defaultBillingAddress)
  if (!defaultBillAddress) user.value.userAddresses[0].defaultBillingAddress = true
  await saveUser()
}

const closeModal = () => {
  if (currentUserAddress !== JSON.stringify(user.value.userAddresses))
    return alert('You have unsaved changes, please save your chnages or click cancel to discard your changes')
  showAddressFormModal.value = false
}

const cancelAddressUpdate = () => {
  user.value.userAddresses = JSON.parse(currentUserAddress)
  showAddressFormModal.value = false
}

const resetDefaultAddress = (addressType, i) => {
  if (user.value.userAddresses.length < 2) return
  if (addressType === 'shippingAddress') {
    for (const prop in user.value.userAddresses) {
      user.value.userAddresses[prop].defaultShippingAddress = false
    }
    user.value.userAddresses[i].defaultShippingAddress = true
  } else if (addressType === 'billingAddress') {
    for (const prop in user.value.userAddresses) {
      user.value.userAddresses[prop].defaultBillingAddress = false
    }
    user.value.userAddresses[i].defaultBillingAddress = true
  }
}

const setDefaultShippingAddress = () => {
  resetDefaultAddress('shippingAddress', addressToEditIndex.value)
}

const setDefaultBillingAddress = () => {
  resetDefaultAddress('billingAddress', addressToEditIndex.value)
}

const switchShippingAddress = async (i) => {
  resetDefaultAddress('shippingAddress', i)
  await saveUser()
}

const switchBillingAddress = async (i) => {
  resetDefaultAddress('billingAddress', i)
  await saveUser()
}

const saveUser = async () => {
  console.log(user.value)
  // return
  // if (!user.value.name) return (errorMsg.value = 'User name is required')
  // if (!user.value.email) return (errorMsg.value = 'User email is required')
  // if (!user.value.password) return (errorMsg.value = 'User [password] is required')
  response = await saveDoc('users', user.value)
  console.log('SAVE', response)
  if (!response || !response.insertedId) return
  router.push({ name: 'admin-users-id', params: { id: response.insertedId } })
  // params.match = `_id[eq]=${response.insertedId}`,
  // router.push({ name: 'admin-galleries' })

  // const { pending, error, data } = await useFetch('/api/v1/users', {
  //   method: 'POST',
  //   body: user.value,
  // })
  // if (error.value) errorMsg.value = error.value.data.statusMessage
  // console.log('D', data.value)

  //   const newUser = await saveDoc('users', {
  //     id: user.value.id,
  //     name: user.value.name,
  //     email: user.value.email,
  //     password: !user.value.id ? user.value.password : undefined,
  //     verified: user.value.verified,
  //     active: user.value.active,
  //   })
  //   if (newUser) {
  //     console.log(newUser)
  //     // user.value = newUser
  //     router.push({ name: 'admin-users-id', params: { id: user.value.id } })
  //   }
}

const saveAddress = async () => {
  const defaultShippingAddress = user.value.userAddresses.find((a) => a.defaultShippingAddress)
  if (!defaultShippingAddress) user.value.userAddresses[0].defaultShippingAddress = true
  const defaultBillingAddress = user.value.userAddresses.find((a) => a.defaultBillingAddress)
  if (!defaultBillingAddress) user.value.userAddresses[0].defaultBillingAddress = true
  console.log('OOOOOO', user.value)
  showAddressFormModal.value = false
  await saveUser()

  //   let errorMessage = ''
  //   for (const prop in user.value.userAddresses[addressToEditIndex.value].phoneNumbers) {
  //     if (!user.value.userAddresses[addressToEditIndex.value].phoneNumbers[prop].phoneNumber) {
  //       errorMessage += '<p>Phone number is required</p>'
  //     }
  //     if (!user.value.userAddresses[addressToEditIndex.value].phoneNumbers[prop].phoneCountryCode) {
  //       errorMessage += '<p>Phone Country Code is required<p>'
  //     }
  //     if (errorMessage) return (errorMsg.value = errorMessage)
  //   }
  //   const defaultPhoneNumber = user.value.userAddresses[addressToEditIndex.value].phoneNumbers.find((p) => p.default)
  //   if (!defaultPhoneNumber) user.value.userAddresses[addressToEditIndex.value].phoneNumbers[0].default = true
  //   const newPhoneNumbers = []
  //   await Promise.all(
  //     user.value.userAddresses[addressToEditIndex.value].phoneNumbers.map(async (item) => {
  //       const savedPhoneNumber = await saveDoc('phonenumbers', item)
  //       if (savedPhoneNumber) {
  //         response = await fetchDoc('phonenumbers', savedPhoneNumber.id)
  //         if (response) newPhoneNumbers.push(response.doc)
  //       }
  //     })
  //   )
  //   user.value.userAddresses[addressToEditIndex.value].phoneNumbers = newPhoneNumbers
  //   for (const prop in user.value.userAddresses) {
  //     if (!user.value.userAddresses[prop].name) {
  //       errorMessage += '<p>Name is required</p>'
  //     }
  //     if (!user.value.userAddresses[prop].addressLine1) {
  //       errorMessage += '<p>Shipping address is required</p>'
  //     }
  //     if (!user.value.userAddresses[prop].postalCode) {
  //       errorMessage += '<p>Postal code is required</p>'
  //     }
  //     if (!user.value.userAddresses[prop].state) {
  //       errorMessage += '<p>State is required<p>'
  //     }
  //     if (errorMessage) return (errorMsg.value = errorMessage)
  //   }
  //   const defaultShipAddress = user.value.userAddresses.find((a) => a.defaultShippingAddress)
  //   if (!defaultShipAddress) user.value.userAddresses[0].defaultShippingAddress = true
  //   const defaultBillAddress = user.value.userAddresses.find((a) => a.defaultBillingAddress)
  //   if (!defaultBillAddress) user.value.userAddresses[0].defaultBillingAddress = true
  //   const newUserAddresses = []
  //   await Promise.all(
  //     user.value.userAddresses.map(async (item) => {
  //       const savedAddress = await saveDoc('useraddresses', item)
  //       if (savedAddress) {
  //         response = await fetchDoc('useraddresses', savedAddress.id)
  //         if (response) newUserAddresses.push(response.doc)
  //       }
  //       // if (newUserAddress) newUserAddresses.push(newUserAddress)
  //     })
  //   )
  //   user.value.userAddresses = newUserAddresses
  //   const newUser = await saveDoc('users', user.value)
  //   if (newUser) {
  //     // user.value = newUser
  //     // router.push({ name: 'admin-users-id', params: { id: user.value.id } })
  //   }
}

const setMedia = async (event) => {
  console.log(user.value)
  for (const prop in event) {
    const found = user.value.media.find((m) => m._id == event[prop]._id)
    if (!found) user.value.media.push(event[prop])
  }
  await saveUser()
}
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4 p-4">
    <Title>{{ pageTitle }}</Title>
    <header class="flex flex-col gap-2 w-full">
      <div class="go-back" id="product-go-back">
        <NuxtLink class="flex flex-row gap-2 text-yellow-700" :to="{ name: 'admin-users' }">
          <IconsArrowWest class="fill-yellow-700" />
          <span>Users</span>
        </NuxtLink>
      </div>
      <h3 class="">Edit User</h3>
    </header>
    <main class="w-full flex flex-row gap-4">
      <div class="flex-1 flex flex-col gap-8">
        <AdminUsersUserInfo :user="user" @updateUser="user = { ...user, ...$event }" @saveUserInfo="saveUser" />
        <section class="rounded border p-4 shadow-lg" id="user-addresses">
          <div class="admin-section-header">User Addresses</div>
          <div v-if="!user._id">Please save user information before adding userAddresses</div>
          <div class="flex flex-col gap-5" v-else>
            <AdminUsersUserAddresses
              :user="user"
              @insertNewAddress="insertNewAddress"
              @editAddress="editAddress"
              @deleteAddress="deleteAddress"
              @switchShippingAddress="switchShippingAddress"
              @switchBillingAddress="switchBillingAddress"
            />
          </div>
        </section>
        <section class="rounded border p-4 shadow-lg" id="user-addresses">
          <div class="admin-section-header">User Images</div>
          <div v-if="!user._id">Please save user information before adding images</div>
          <div class="flex flex-col gap-5" v-else>
            <AdminImageGallery
              :gallery="user.media"
              :galleryIntro="galleryIntro"
              @removeMedia="user.media.splice($event, 1)"
              @placeMedia="user.media[$event.index] = $event.value"
              @setMedia="setMedia"
            />
          </div>
        </section>

        <Modal :outerBoxWidth="75" :outerBoxHeight="90" @closeModal="closeModal" v-if="showAddressFormModal">
          <template v-slot:header>
            <h3>Edit User Address</h3>
          </template>
          <template v-slot:default>
            <AdminUsersUserAddressForm
              :userAddress="user.userAddresses[addressToEditIndex]"
              @updateUserAddress="user.userAddresses[addressToEditIndex] = $event"
              @setDefaultShippingAddress="setDefaultShippingAddress"
              @setDefaultBillingAddress="setDefaultBillingAddress"
            />
          </template>
          <template v-slot:footer>
            <section class="flex gap-2 justify-end px-3 py-1">
              <button class="btn btn-secondary px-4 py-1 text-xs" @click="cancelAddressUpdate">Cancel</button>
              <button class="btn btn-primary px-4 py-1 text-xs" @click="saveAddress">Save Address</button>
            </section>
          </template>
        </Modal>
      </div>
    </main>
    <div class="self-end px-4 sticky -z-10 bottom-4">
      <a href="#product-go-back" class="btn px-2 py-1">Go To Top</a>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
