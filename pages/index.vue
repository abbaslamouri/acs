<script setup>
const title = ref('Main | YRL')
const config = useRuntimeConfig()

// const { fetchAll } = useHttp()

const carouselGallery = ref([])

const counters = [
  { target: 98, suffix: '% +', text: 'On-time delivery' },
  { target: 850, suffix: ' +', text: 'PMA Parts' },
  { target: 20, suffix: ' +', text: 'Countries served' },
  { target: 500, suffix: ' +', text: 'Valued customers' },
]

// const response = await fetchAll('galleries', { name: 'Carousel' })
// console.log(response)
// if (response) carouselGallery.value = response.docs[0]
</script>

<template>
  <div class="flex-1 tracking-wide">
    <Title>{{ title }}</Title>
    <div
      class="flex flex-col gap-4 justify-center items-center h-96 bg-center bg-no-repeat bg-cover"
      :style="{ backgroundImage: `url('/acshomepage-hero.jpg')` }"
    >
      <h3 class="text-4xl text-slate-50 tracking-wider uppercase">Aviation Component Solutions</h3>
      <h4 class="text-md text-slate-50 tracking-wider uppercase">
        Delivering the Difference Through Innovation and Integrity
      </h4>
    </div>
    <section class="flex flex-row justify-center py-4">
      <div class="container flex flex-col gap-1 items-center">
        <h3 class="text-4xl uppercase">Creation of Value</h3>
        <IconsChart class="w-20 h-20" />
        <p>
          ACS is a leading supplier of OEM alternative parts. We realize there’s more to our customer’s purchasing
          decision than just price. This is why ACS seeks not only to provide the best pricing in the industry, but to
          create value using any means available to us. Stocking 100% of our inventory for next day delivery, offering
          eCommerce solutions for online customers, utilizing the latest data management technology, and offering the
          latest manufacturing / design solutions are some of the many methods we’ve adopted to create value for our
          customers. All ACS parts are FAA-PMA approved.
        </p>
      </div>
    </section>
    <section class="flex flex-row justify-center py-4">
      <div class="container flex flex-row justify-center gap-2 py-2">
        <div class="flex-1 flex flex-col gap-2 items-center">
          <div class="flex flex-row items-center gap-2 self-start">
            <IconsLightBulb class="w-16 h-16 self-start" />
            <h3 class="text-md uppercase">Design & Engineering</h3>
          </div>
          <p>
            To assure customers that the parts we provide will perform as promised, both functional and dimensional
            analyses are critical to our design process.
          </p>
        </div>
        <div class="flex-1 flex flex-col gap-2 items-center">
          <div class="flex flex-row items-center gap-2 self-start">
            <IconsEdit class="w-16 h-16 self-start" />
            <h3 class="text-md uppercase">Design & Engineering</h3>
          </div>
          <p>
            The driving force behind our approach to quality control is simple - to assure that our customers receive
            the highest quality, airworthy parts, every single time they order.
          </p>
        </div>
        <div class="flex-1 flex flex-col gap-2 items-center">
          <div class="flex flex-row items-center gap-2 self-start">
            <IconsAnalyse class="w-16 h-16 s self-start" />
            <h3 class="text-md uppercase">Design & Engineering</h3>
          </div>
          <p>
            To assure customers that the parts we provide will perform as promised, both functional and dimensional
            analyses are critical to our design process.
          </p>
        </div>
      </div>
    </section>
    <AnimatedCounters :counters="counters" />
    <!-- <div> -->
    <!-- <Carousel
      :slides="carouselGallery.gallery"
      indicators
      controls
      interval="5"
      height="30"
      :slidesToDisplayCount="6"
    /> -->
    <!-- </div> -->
  </div>
</template>

<style lang="scss" scoped>
// img {
//   box-sizing: border-box;
//   transform: scale(1.1);
// }
</style>
