<script setup>
const props = defineProps({
  error: Object,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div>
    {{ error }}
    <button @click="handleError">Clear errors</button>
  </div>
</template>
