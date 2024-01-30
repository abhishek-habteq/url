<template>
  <div id="app">
    <!-- <Nav_bar /> -->
    <UrlShortener />
    <savedUrls />
  </div>
</template>

<script>
// import Nav_bar from '@/components/Navbar.vue';
import UrlShortener from '@/components/UrlShortener.vue';
import savedUrls from '@/components/SavedUrls.vue';


export default {
  name: 'App',
  components: {
    UrlShortener,
    savedUrls,
    // Nav_bar,
  },
};
</script>
