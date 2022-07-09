<script setup>
const errorMsg = useState('errorMsg', () => '')
const message = useState('message', () => '')
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
      <SnackBar
        :show="errorMsg ? true : message ? true : false"
        :message="errorMsg ? errorMsg : message ? message : ''"
        :snackbarType="errorMsg ? 'Error' : 'Success'"
        duration="10"
        @hideSnackbar="hideSnackbar"
      />
    </NuxtLayout>
  </div>
</template>
