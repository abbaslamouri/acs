<script setup>
	const props = defineProps({
		modelValue: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		rows: {
			type: String,
			default: '5',
		},
		cols: {
			type: String,
			default: '',
		},
	})
	defineEmits(['update:modelValue'])

	const inputRef = ref('')
	const errorMsg = ref('')
	const uuid = useUniqueId().getId()
</script>

<script>
	export default {
		inheritAttrs: false,
	}
</script>

<template>
	<div class="base-textarea border-2 border-gray-300 rounded relative">
		<!-- <label :for="`base-input-${uuid}`" v-if="label">{{ label }}</label> -->
		<textarea
    class="w-full"
			ref="inputRef"
			v-bind="$attrs"
			:value="modelValue"
			:id="`base-input-${uuid}`"
			@input="$emit('update:modelValue', $event.target.value)"
			:aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
			:aria-invalid="errorMsg ? true : null"
			:aria-readonly="typeof $attrs.readonly != undefined ? true : null"
			:aria-required="typeof $attrs.required != undefined ? true : null"
			:rows="rows"
			:cols="cols"
		/>
		<span class="placeholder absolute left-3 top-0 transform -translate-y-2 text-xs bg-[#ffffff] px-2">{{ label }}</span>
	</div>
</template>

<style scoped lang=""></style>
