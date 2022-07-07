<script setup>
const emit = defineEmits(['removeVariant', 'saveVariants', 'closeSlideout'])
const config = useRuntimeConfig()

const allAttributes = inject('allAttributes')

const showVariantEditSlideoutKeys = ref([])

const product = useState('product')
const showActionKeys = ref([])

const resetActions = () => {
	for (const prop in product.value.variants) {
		showActionKeys.value[prop] = false
	}
}

const setActions = (payload) => {
	resetActions()
	showActionKeys.value[payload.index] = payload.action
}

const removeVariant = (variantIndex) => {
	resetActions()
	emit('removeVariant', variantIndex)
}

const getVariantAttribute = (term, j) => {
	if (Object.values(term).length) return product.value.attributes.find((a) => a.attribute._id == term.parent).attribute
	return product.value.attributes[j].attribute
}

const openVariantEditSlideout = (i) => {
	resetActions()
	showVariantEditSlideoutKeys.value[i] = true
}

const handleSaveVariant = (event) => {
	// showVariantEditSlideoutKeys[index] = false
}
</script>

<template>
	<table class="text-xs shadow-md">
		<thead>
			<tr class="bg-slate-200">
				<th>ID</th>
				<th class="">Image</th>
				<th>Variation</th>
				<th>Enabled</th>
				<th>Stock Qty.</th>
				<th>Price</th>
				<th>Sale Price</th>
				<th>SKU</th>
				<th class="text-right minw12">Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(variant, index) in product.variants" :key="`variant-${index}`">
				<td class="w-4 text-center">
					<div class="bg-slate-200 p-1 br-3">{{ index + 1 }}</div>
				</td>
				<td class="w-5 h-5">
					<img
						class="w-full hfull contain"
						v-if="variant.gallery[0]"
						:src="`${config.backendUrl}/${variant.gallery[0].path}`"
						alt="Variant Image"
					/>
					<img class="w-full h-full contain" v-else src="/placeholder.png" alt="Variant Image" />
				</td>
				<td class="px-05">
					<div class="flex-row gap-1">
						<div class="flex-row" v-for="(term, j) in product.variants[index].attrTerms" :key="term">
							<div class="attribute bg-slate-400">
								{{ getVariantAttribute(term, j).name }}
							</div>
							<div class="term bg-slate-300">
								{{ term.name }}
							</div>
						</div>
					</div>
				</td>
				<td class="w-6 text-center">{{ variant.enabled ? 'Enabled' : 'Disabled' }}</td>
				<td class="w-8 text-center">
					<div v-if="!product.manageInventory">&infin;</div>
					<div v-else>{{ product.variants[index].stockQty }}</div>
				</td>
				<td class="w-6 text-center">{{ product.variants[index].price }}</td>
				<td class="w-6 text-center">{{ product.variants[index].salePrice }}</td>
				<td class="w-6 text-center">{{ product.variants[index].sku }}</td>
				<td class="w-12">
					<EcommerceAdminRowActions
						:showAction="showActionKeys[index]"
						:showEdit="true"
						@moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
						@deleteAction="removeVariant(index)"
						@editAction="openVariantEditSlideout(index)"
						@cancel="resetActions"
					/>
					<EcommerceAdminProductVariantsEditSlideout
						v-if="showVariantEditSlideoutKeys[index]"
						:index="index"
						@toggleVariantEditSlideout="showVariantEditSlideoutKeys[index] = $event"
						@saveVariant="showVariantEditSlideoutKeys[index] = false"
					/>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/variables';
td {
	// border: 1px solid red;
}

.attribute {
	color: white;
	padding: 0.25rem 0.5rem 0.3rem;
	border-radius: 2rem 0 0 2rem;
}

.term {
	padding: 0.25rem 0.5rem 0.3rem;
	border-radius: 0 2rem 2rem 0;
}
</style>
