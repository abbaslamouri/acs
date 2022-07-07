<script setup>
const product = useState('product')
const { saveDoc, deleteDoc } = useHttp()
const { message } = useAppState()

const newEligibility = ref({ name: '' })
const eligibilityInputRef = ref('')

const addEligibility = async () => {
  const savedEligibility = await saveDoc('eligibilities', newEligibility.value)
  if (!Object.values(savedEligibility).length) return
  product.value.eligibilities.push(savedEligibility)
  const savedProduct = await saveDoc('products', product.value)
  if (!Object.values(savedProduct).length) return
  eligibilityInputRef.value.focus()
  newEligibility.value.name = ''
}

const removeEligibility = async (eligibilityId) => {
  let eligibilityName = ''
  console.log(eligibilityId)
  if (!(await deleteDoc('eligibilities', eligibilityId))) return
  const j = product.value.eligibilities.findIndex((e) => e.id == eligibilityId)
  if (j !== -1) {
    eligibilityName = product.value.eligibilities[j].name
    product.value.eligibilities.splice(j, 1)
  }
  const response = await saveDoc('products', product.value)
  if (!response) return
  message.value = `Eligibility ${eligibilityName} deleted succesfully`
}
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Eligibility</div>
      <div></div>
    </div>
    <div class="flex-row wrap gap-1">
      <div v-for="(eligibility, i) in product.eligibilities" :key="`eligibility-${i}`">
        <div class="flex-row gap-1 items-center text-xs text-slate-50 border border-slate-400 bg-slate-600 br-3">
          <span class="px-1">{{ eligibility.name }}</span>
          <span class="bg-slate-50 h-full cursor-pointer" >
            <IconsClose @click="removeEligibility(eligibility.id)"/>
          </span>
        </div>
      </div>
      <div class="">
        <input type="text" ref="eligibilityInputRef" v-model="newEligibility.name" @keyup.enter="addEligibility" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';

svg {
  fill: $slate-500;
  width: 1.5rem;
  height: 1.5rem;
}
</style>
