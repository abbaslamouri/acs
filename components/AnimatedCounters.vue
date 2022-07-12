<script setup>
const props = defineProps({
  counters: {
    type: Array,
    required: true,
  },
  speed: {
    type: Number,
    default: 200,
  },
})

const counterRefs = ref([])

onMounted(() => {
  for (const prop in counterRefs.value) {
    const updateCount = () => {
      const target = counterRefs.value[prop].getAttribute('data-target') * 1
      const count = counterRefs.value[prop].innerText * 1
      const inc = target / props.speed
      if (count < target) {
        counterRefs.value[prop].innerText = Math.ceil(count + inc)
        setTimeout(updateCount, 1)
      } else {
        counterRefs.value[prop].innerText = target
      }
    }
    updateCount()
  }
})
</script>

<template>
  <div class="flex flex-row gap-2 justify-center items-center p-4 bg-slate-300 text-lg uppercase">
    <div
      class="flex-1 flex flex-col gap-1 items-center bg-slate-600 text-slate-50 p-4 rounded"
      v-for="(counter, index) in counters"
    >
      <div>
        <span
          :ref="
            (el) => {
              counterRefs[index] = el
            }
          "
          :data-target="counter.target"
          >0</span
        >
        <span>{{ counter.suffix }}</span>
      </div>
      <p>{{ counter.text }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
