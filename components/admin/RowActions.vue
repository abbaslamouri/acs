<script setup>
const props = defineProps({
	showAction: {
		type: Boolean,
	},
	showEdit: {
		type: Boolean,
		default: false,
	},
	showActivate: {
		type: Boolean,
		default: false,
	},
	showVerify: {
		type: Boolean,
		default: false,
	},
	active: {
		type: Boolean,
		default: false,
	},
})

const emit = defineEmits(['moreHoriz', 'editAction', 'deleteAction', 'activateAction', 'verifyAction', 'cancel'])

if (process.client) {
	document.addEventListener('click', (event) => {
		if (
			props.showAction &&
			!event.target.closest(`.btn__close`) &&
			!event.target.closest(`.delete-action`) &&
			!event.target.closest(`.edit-action`)
		) {
			emit('cancel')
		}
	})
}
</script>

<template>
	<div class="flex-row justify-end gap-05">
		<div class="shadow-md p-1 border border-slate-300 flex-col gap-05" v-show="showAction">
			<a href="#" class="edit-action text-slate-800 font-bold" @click.prevent="$emit('editAction')" v-if="showEdit">
				<div class="">Edit</div>
			</a>
			<a href="#" class="text-slate-800 font-bold" @click.prevent="$emit('activateAction')" v-if="showActivate">
				<div class="" v-if="!active">Activate</div>
				<div class="" v-else>Deactivate</div>
			</a>
			<a href="#" class="text-slate-800 font-bold" @click.prevent="$emit('verifyAction')" v-if="showVerify">
				<div class="">Verify</div>
			</a>
			<a href="#" class="delete-action text-xs text-red-700" @click.prevent="$emit('deleteAction')"> Delete </a>
		</div>
		<button class="btn btn__close p-05" @click.prevent="$emit('moreHoriz')">
			<IconsMoreHoriz />
		</button>
	</div>
</template>

<style lang="scss" scoped></style>
