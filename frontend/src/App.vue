<template>
  <div id="app">
    <!-- <Nav_bar /> -->
    <UrlShortener />
  </div>
</template>

<script>
// import Nav_bar from '@/components/Navbar.vue';
import UrlShortener from '@/components/UrlShortener.vue';


export default {
  name: 'App',
  components: {
    UrlShortener,
    // Nav_bar,
  },
};
</script>
