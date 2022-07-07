<script setup>
	defineProps({
		showRegularPriceInput: {
			type: Boolean,
		},
		showSalePriceInput: {
			type: Boolean,
		},
	})

	const emit = defineEmits(['setRegularPrices', 'setSalePrices'])

	const regularPrice = ref(null)
	const salePrice = ref(null)

	const setRegularPrices = () => {
		emit('setRegularPrices', regularPrice.value)
		regularPrice.value = null
	}

	const setSalePrices = () => {
		emit('setSalePrices', salePrice.value)
		salePrice.value = null
	}
</script>
<template>
	<div class="">
		<form class="flex-row items-center" v-if="showRegularPriceInput" @submit.prevent="setRegularPrices">
			<div class="minw16">
				<FormsBaseInput v-model="regularPrice" label="Set Regular Price" placeholde="Set Regular Price" />
			</div>
			<button class="btn btn__secondary px2 py1">Submit</button>
		</form>

		<form class="flex-row items-center" v-if="showSalePriceInput" @submit.prevent="setSalePrices">
			<div class="minw16">
				<FormsBaseInput v-model="salePrice" label="Set Sale Price" placeholde="Set Sale Price" />
			</div>
			<button class="btn btn__secondary px2 py1">submit</button>
		</form>
	</div>
</template>
