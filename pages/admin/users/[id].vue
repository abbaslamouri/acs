<script setup>
definePageMeta({
  layout: 'admin',
})
const pageTitle = ref('User | YRL')

// const config = useRuntimeConfig()
const { errorMsg, message, galleryMedia, mediaReference, showMediaSelector } = useAppState()
// const { fetchAll, fetchDoc, saveMedia, saveDoc, deleteDocs } = useHttp()
const route = useRoute()
// const router = useRouter()
// const addressToEditIndex = ref('')
// const showAddressFormModal = ref(false)
// const countries = ref([])
// const states = ref([])
// let response
const user = ref({ name: 'Abbas Lamouri', email: 'abbaslamouri@yrlus.com', password: 'adrar0714' })
// const user = useState('user', () => {
//   return { userAddresses: [] }
// })

const id = route.params.id === '_' ? undefined : route.params.id

// response = await fetchAll('countries', { sort: 'countryName' })
// if (response) countries.value = response.docs
// provide('countries', countries)

// response = await fetchAll('states', { sort: 'name' })
// if (response) states.value = response.docs
// provide('states', states)

if (id) {
  // response = await fetchAll('users', { id, populate: 'userAddresses gallery' })
  // if (response && response.docs && response.docs[0]) user.value = response.docs[0]
  // else router.push({ name: 'admin-users' })
}
console.log(user.value)

// const blankPhoneNumber = {
//   phoneType: 'Cell',
//   phoneNumber: '2165026378',
//   phoneCountryCode: countries.value.find((c) => c.threeLetterCountryCode == 'USA'),
// }
// provide('blankPhoneNumber', blankPhoneNumber)

// user.value.name = 'Abbas Lamouri'
// user.value.email = 'abbaslamouri@yrlus.com'
// user.value.password = 'adrar0714'

// const fetchUser = async () => {
//   const id = route.params.id === '_' ? undefined : route.params.id
//   if (!id) return router.push({ name: 'admin-users' })
//   response = await fetchAll('users', { id, populate: 'userAddresses gallery' })
//   if (response && response.docs && response.docs[0]) user.value = response.docs[0]
//   console.log(user.value)
// }

// const insertNewAddress = () => {
//   user.value.userAddresses.push({
//     addressType: 'Residential',
//     // // email: 'abbaslamnouri1@yrlus.com',
//     title: 'Ms',
//     name: 'Nelly Vileikis',
//     company: 'YRL Consulting LLC',
//     addressLine1: '599 Deep Woods Dr.',
//     addressLine2: 'Room 101',
//     city: 'Aurora',
//     postalCode: '44202',
//     state: states.value.find((c) => c.name === 'Alaska'),
//     country: countries.value.find((c) => c.threeLetterCountryCode === 'USA'),
//     phoneNumbers: [{ ...blankPhoneNumber, default: true }],
//     // deliveryInstructions: 'Some delivery instructions1',
//   })
//   if (user.value.userAddresses.length == 1) {
//     user.value.userAddresses[0].defaultShippingAddress = true
//     user.value.userAddresses[0].defaultBillingAddress = true
//   }
//   addressToEditIndex.value = user.value.userAddresses.length - 1
//   showAddressFormModal.value = true
//   // displayStatus.value = 'editing'
//   // editAction.value = 'add'
// }

// const updatePhoneNumber = (payload) => {
//   user.value.userAddresses[addressToEditIndex.value].phoneNumbers[payload.index] = payload.phoneNumber
//   if (user.value.userAddresses[addressToEditIndex.value].phoneNumbers[payload.index].isDefault) {
//     for (const prop in user.value.userAddresses[addressToEditIndex.value].phoneNumbers) {
//       user.value.userAddresses[addressToEditIndex.value].phoneNumbers[prop].isDefault = false
//     }
//     user.value.userAddresses[addressToEditIndex.value].phoneNumbers[payload.index].isDefault = true
//   }
// }

// const editAddress = (i) => {
//   addressToEditIndex.value = i
//   showAddressFormModal.value = true
//   // displayStatus.value = 'editing'
//   // editAction.value = 'add'
// }

// const deleteAddress = async (i) => {
//   if (!confirm('Are you sure you want to delete this address?')) return
//   console.log('user', user.value)
//   if (!user.value.id) return (errorMsg.value = 'Nothing to delete')
//   user.value.userAddresses.splice(i, 1)

//   const defaultShipAddress = user.value.userAddresses.find((a) => a.defaultShippingAddress)
//   if (!defaultShipAddress) user.value.userAddresses[0].defaultShippingAddress = true

//   const defaultBillAddress = user.value.userAddresses.find((a) => a.defaultBillingAddress)
//   if (!defaultBillAddress) user.value.userAddresses[0].defaultBillingAddress = true

//   const newUser = await saveDoc('users', user.value)
//   if (newUser) {
//     console.log(newUser)
//     // user.value = newUser
//     router.push({ name: 'admin-users-id', params: { id: user.value.id } })
//   }

//   // displayStatus.value = 'editing'
//   // editAction.value = 'add'
// }

// const insertNewPhoneNumber = () => {
//   user.value.userAddresses[addressToEditIndex.value].phoneNumbers.push({
//     ...blankPhoneNumber,
//     default: false,
//   })
// }

// const removePhoneNumber = (event) => {
//   user.value.userAddresses[addressToEditIndex.value].phoneNumbers.splice(event, 1)
//   if (user.value.userAddresses[addressToEditIndex.value].phoneNumbers.length === 1) {
//     user.value.userAddresses[addressToEditIndex.value].phoneNumbers[0].isDefault = true
//   } else {
//     if (!user.value.userAddresses[addressToEditIndex.value].phoneNumbers.find((p) => p.isDefault))
//       user.value.userAddresses[addressToEditIndex.value].phoneNumbers[0].isDefault = true
//   }
// }

// const setDefaultPhoneNumber = (event) => {
//   for (const prop in user.value.userAddresses[addressToEditIndex.value].phoneNumbers) {
//     user.value.userAddresses[addressToEditIndex.value].phoneNumbers[prop].isDefault = false
//   }
//   user.value.userAddresses[addressToEditIndex.value].phoneNumbers[event].isDefault = true
// }

// const closeModal = () => {
//   if (currentUserAddress !== JSON.stringify(user.value.userAddresses))
//     return alert('You have unsaved changes, please save your chnages or click cancel to discard your changes')
//   showAddressFormModal.value = false
// }

// const cancelAddressUpdate = () => {
//   user.value.userAddresses = JSON.parse(currentUserAddress)
//   showAddressFormModal.value = false
// }

// const setDefaultShippingAddress = () => {
//   for (const prop in user.value.userAddresses) {
//     user.value.userAddresses[prop].defaultShippingAddress = false
//   }
//   user.value.userAddresses[addressToEditIndex.value].defaultShippingAddress = true
// }

// const setDefaultBillingAddress = () => {
//   for (const prop in user.value.userAddresses) {
//     user.value.userAddresses[prop].defaultBillingAddress = false
//   }
//   user.value.userAddresses[addressToEditIndex.value].defaultBillingAddress = true
// }

// const updateUserAddress = (event) => {
// user.userAddresses[addressToEditIndex] = $event
// }

const saveUserInfo = async () => {
  console.log(user.value)
  const { pending, error, data } = await useFetch('/api/v1/users', {
    method: 'POST',
    body: user.value,
  })
  if (error.value) errorMsg.value = error.value.data.statusMessage
  console.log('D', data.value)

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

// const saveAddress = async () => {
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

//   showAddressFormModal.value = false
// }

// const setUserMedia = async (mediaFiles) => {
//   for (const prop in mediaFiles) {
//     console.log(mediaFiles[prop].id)
//     const found = user.value.gallery.find((m) => m.id == mediaFiles[prop].id)
//     if (!found) user.value.gallery.push(mediaFiles[prop])
//   }
//   const newUser = await saveDoc('users', user.value)
//   if (newUser) {
//     console.log(newUser)
//     // user.value = newUser
//     router.push({ name: 'admin-users-id', params: { id: user.value.id } })
//   }
// }

// watch(
//   () => galleryMedia.value,
//   (currentVal) => {
//     console.log(currentVal)

//     if (mediaReference.value === 'userMedia') setUserMedia(currentVal)
//   },
//   { deep: true }
// )

// await fetchUser()
// const currentUserAddress = JSON.stringify(user.value.userAddresses)

// watch(
//   () => galleryMedia.value,
//   (currentVal) => {
//     if (mediaReference.value === 'userMedia') user.value.gallery[0] = currentVal[0]
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="h-full w-full flex flex-col items-center p-3">
    <Title>{{ pageTitle }}</Title>
    <div class="w-full max-w-screen-xl">
      <header class="flex flex-col gap-2 w-full">
        <div class="go-back" id="product-go-back">
          <NuxtLink class="flex flex-row gap-2 text-yellow-700" :to="{ name: 'admin-users' }">
            <IconsArrowWest class="fill-yellow-700" />
            <span>Users</span>
          </NuxtLink>
        </div>
        <h3 class="header">Edit User</h3>
      </header>
      <main class="main flex-1 max-width-130 w-full">
        <!-- <div class="left-sidebar shadow-md">
        <EcommerceAdminProductLeftSidebar :product="product" />
      </div> -->
        <div class="flex-col gap-2">
          <AdminUsersUserInfo :user="user" @updateUser="user = { ...user, ...$event }" @saveUserInfo="saveUserInfo" />

          <section class="shadow-md w-full p-2" id="general-info">
            <div class="flex-row items-center justify-between mb-1">
              <div class="uppercase border border-b-gray-400 font-bold inline-block">User Addresses</div>
              <div></div>
            </div>
            <div class="flex-col gap-2">
              <div v-if="!user.id">Please save user information before adding userAddresses</div>
              <div v-else>
                <div
                  class="customer-address flex-col items-start gap-2 p-2 border border-slate-200 br-3"
                  v-for="(userAddress, i) in user.userAddresses"
                  :key="userAddress.id"
                >
                  <h3>Address</h3>

                  <!-- <AdminUsersUserAddress :userAddress="userAddress" /> -->
                  <div class="flex-col">
                    <h3>Phone Numbers</h3>
                    <!-- <div class="flex-row" v-for="userPhoneNumber in userAddress.phoneNumbers">
                    <AdminUsersUserPhoneNumber :userPhoneNumber="userPhoneNumber" />
                  </div> -->
                  </div>
                  <div class="flex-col gap-05">
                    <!-- <div class="text-green-700 flex-row items-center gap-05" v-if="userAddress.defaultShippingAddress">
                    <IconsCheck class="w-16px h-16px fill-green-700" /> <span>Default shipping address</span>
                  </div> -->
                    <!-- <div class="flex-row items-center" v-if="userAddress.defaultBillingAddress">
                    <IconsCheck class="w-16px h-16px fill-green-700" /> <span>Default billing address</span>
                  </div> -->
                  </div>
                  <div class="flex-row gap-1">
                    <!-- <button class="btn btn__secondary px-2 py-05 text-xs br-3" @click="editAddress(i)">
                    Edit Address
                  </button> -->
                    <!-- <button
                    class="btn btn__secondary px-2 py-05 text-sm br-3"
                    v-if="!userAddress.defaultBillingAddress && !userAddress.defaultShippingAddress"
                    @click="deleteAddress(i)"
                  >
                    Delete Address
                  </button> -->
                  </div>
                </div>
              </div>
              <!-- <button
              class="btn btn__secondary px-2 py-05 items-self-end text-xs"
              :class="{ disabled: !user.id }"
              @click="insertNewAddress"
            >
              Add Address
            </button> -->
            </div>
            <!-- <Modal :outerBoxWidth="75" :outerBoxHeight="90" @closeModal="closeModal" v-if="showAddressFormModal">
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
              <section class="flex-row gap-2 justify-end px-3">
                <button class="btn btn__secondary px-2 py-1" @click="cancelAddressUpdate">Cancel</button>
                <button class="btn btn__primary px-2 py-1" @click="saveAddress">Save Address</button>
              </section>
            </template>
          </Modal> -->
          </section>
          <!-- <EcommerceAdminProductPrice :product="product" @updatePrice="product.value = { ...product.value, ...$event }" /> -->
          <!-- <EcommerceAdminProductEligibility /> -->
          <!-- <EcommerceAdminProductNextHigherAssembly /> -->
          <!-- <EcommerceAdminProductStockManagement
          :product="product"
          @updateStock="product.value = { ...product.value, ...$event }"
        /> -->

          <!-- <EcommerceAdminProductAttributesContent
          v-if="product.id && product.productType === 'variable'"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
        /> -->
          <!-- <EcommerceAdminProductAttributesSlideout
          v-if="showAttributesSlideout"
          @toggleAttributesSlideout="showAttributesSlideout = $event"
          @saveAttributes="saveProduct"
        /> -->

          <!-- <EcommerceAdminProductVariantsContent
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          v-if="product.id && product.productType === 'variable' && product.attributes.length"
        /> -->
          <!-- <EcommerceAdminProductVariantsSlideout
          v-if="showVariantsSlideout"
          @toggleVariantsSlideout="showVariantsSlideout = $event"
          @saveVariants="saveProduct"
        /> -->
          <!-- <EcommerceProductDetails :product="product" @updateDetails="product.value = { ...product.value, ...$event }" /> -->

          <!-- <EcommerceProductShippingOptions :product="product" /> -->
          <!-- <EcommerceProductDigitalDelivery :product="product" /> -->
          <!-- <EcommerceProductExtraFields :product="product" /> -->
          <!-- <EcommerceProductSeo :product="product" /> -->
          <!-- <EcommerceProductMisc :product="product" /> -->
        </div>
        <div class="right-sidebar">
          <!-- <AdminUsersRightSidebar /> -->
          <section class="admin-image-gallery shadow-md p-2 flex-col gap-2 bg-white" id="image-gallery">
            <!-- <AdminImageGallery :gallery="user.gallery" mediaReference="userMedia" /> -->
          </section>
        </div>
      </main>
      <div class="w-full flex-row justify-end px-4 sticky bottom-4 go-to-top">
        <a href="#product-go-back" class="btn btn__secondary px-2 py-1">Go To Top</a>
      </div>
      <!-- <footer class="w-full max-width-130 bg-slate-300 px-2 py-1 br-5 flex-row justify-center text-2xl">Footer</footer> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* @import '@/assets/scss/variables'; */

/* .customer-address {
  &:nth-of-type(even) {
    background-color: $slate-200;
  }
  // &:nth-of-type(odd) {
  //   background-color: $slate-400;
  // }
}

.main {
  display: grid;
  grid-template-columns: 1fr 30rem;
  gap: 2rem;
  align-items: flex-start;

  .left-sidebar {
    position: sticky;
    top: 10rem;
    background-color: white;
    border: 1px solid $slate-100;
    border-radius: 3px;
    padding: 2rem 0.5rem;
  }

  .right-sidebar {
    position: sticky;
    top: 10rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

// .go-to-top {
//   position: sticky;
//   bottom: 4rem;
// } */
</style>
