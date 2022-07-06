<script setup>
const { message, errorMsg, showMediaSelector, showCartSlideout } = useAppState()
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
        duration="5"
        @hideSnackbar="hideSnackbar"
      />
    </NuxtLayout>
  </div>
</template>
