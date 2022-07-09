<script setup>
const product = useState('product')
// const { saveDoc, deleteDoc } = useHttp()
// const { message } = useAppState()

const newNextHigherAssembly = ref({ name: '' })
const nextHigherAssemblyInputRef = ref('')

const addNextHigherAssembly = async () => {
  const savedNextHigherAssembly = await saveDoc('nexthigherassemblies', newNextHigherAssembly.value)
  if (!Object.values(savedNextHigherAssembly).length) return
  product.value.nextHigherAssemblies.push(savedNextHigherAssembly)
  const savedProduct = await saveDoc('products', product.value)
  console.log('savedProduct', savedProduct)
  if (!Object.values(savedProduct).length) return
  nextHigherAssemblyInputRef.value.focus()
  newNextHigherAssembly.value.name = ''
}

const removeNextHigherAssembly = async (eligibilityId) => {
  let nextHigherAssemblyName = ''
  console.log(eligibilityId)
  if (!(await deleteDoc('nexthigherassemblies', eligibilityId))) return
  const j = product.value.nextHigherAssemblies.findIndex((e) => e.id == eligibilityId)
  if (j !== -1) {
    nextHigherAssemblyName = product.value.nextHigherAssemblies[j].name
    product.value.nextHigherAssemblies.splice(j, 1)
  }
  const response = await saveDoc('products', product.value)
  if (!response) return
  message.value = `NextHigherAssembly ${nextHigherAssemblyName} deleted succesfully`
}
</script>

<template>
  <section class="shadow-md w-full bg-white p-2 br-5" id="general-info">
    <div class="flex-row items-center justify-between text-sm mb-1">
      <div class="uppercase inline-block border-b-stone-300 font-bold pb-05">Next Higher Assembly</div>
      <div></div>
    </div>
    <div class="flex-row items-center wrap gap-1">
      <div v-for="(nextHigherAssembly, i) in product.nextHigherAssemblies" :key="`next-higher-assembly-${i}`">
        <div class="flex-row gap-1 items-center text-xs text-slate-50 border border-slate-400 bg-slate-600 br-3">
          <span class="px-1">{{ nextHigherAssembly.name }}</span>
          <span class="bg-slate-50 h-full cursor-pointer">
            <IconsClose @click="removeNextHigherAssembly(nextHigherAssembly.id)" />
          </span>
        </div>
      </div>
      <div class="">
        <input
          type="text"
          ref="nextHigherAssemblyInputRef"
          v-model="newNextHigherAssembly.name"
          @keyup.enter="addNextHigherAssembly"
        />
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
