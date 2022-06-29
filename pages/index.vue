<script setup>
const { data } = await useFetch('/api/hello')
</script>

<template>
	<div>
		<h3 class="text-6xl">Hello World</h3>
		<button class="btn-green">Click me</button>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam tempora animi aliquam accusantium, provident autem
			minus magnam dolorem! Inventore placeat nulla omnis, modi repellendus error quos officia nesciunt? Porro,
			repudiandae!
		</p>
		<div>{{ data }}</div>
	</div>
</template>

<style lang="scss" scoped></style>
