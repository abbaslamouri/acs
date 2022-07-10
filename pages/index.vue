<script setup lang="ts">
const config = useRuntimeConfig()

console.log(config)
// const data = await $fetch('/api/v1/users')
// console.log(data)
</script>

<template>
  <div>
    <h3 class="text-6xl">Welcome to ACS</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam tempora animi aliquam accusantium, provident autem
      minus magnam dolorem! Inventore placeat nulla omnis, modi repellendus error quos officia nesciunt? Porro,
      repudiandae!
    </p>
    <!-- {{ pending }} -->
    <!-- <div v-if="pending">Loading ...</div> -->
    <!-- <div>{{ data }}</div> -->
  </div>
</template>

<style lang="scss" scoped></style>
