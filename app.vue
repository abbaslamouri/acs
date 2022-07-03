<script setup>
const { message, errorMsg, showMediaSelector, showCartSlideout } = useAppState()
const hideSnackbar = () => {
  errorMsg.value = null
  message.value = null
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
        duration="0"
        @hideSnackbar="hideSnackbar"
      />
    </NuxtLayout>
  </div>
</template>
