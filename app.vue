<script setup>
const errorMsg = useState('errorMsg', () => '')
const message = useState('message', () => '')
const showCart = useState('showCart', () => false)
const isAuthenticated = useState('isAuthenticated', () => (useCookie('jwt') && useCookie('jwt').value ? true : false))
const token = useState('jwt', () => (useCookie('jwt') && useCookie('jwt').value ? useCookie('jwt').value : ''))
const loggedInUser = useState('loggedInUser', () =>
  useCookie('userName') && useCookie('userName').value ? useCookie('userName').value : ''
)
// const mediaReference = useState('mediaReference', () => '')
// const { message, errorMsg, showMediaSelector, showCartSlideout } = useAppState()
const hideSnackbar = () => {
  errorMsg.value = ''
  message.value = ''
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <LazySnackBar
        :show="errorMsg ? true : message ? true : false"
        :message="errorMsg ? errorMsg : message ? message : ''"
        :snackbarType="errorMsg ? 'Error' : 'Success'"
        duration="10"
        @hideSnackbar="hideSnackbar"
      />
    </NuxtLayout>
  </div>
</template>
