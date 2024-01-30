<template>
  <div class="container mt-5">
    <div class="shadow-lg p-3 mb-5 bg-light rounded">
      <h1 class="mb-4 pt-3 text-center">URL Shortener</h1>
      <div class="container">
        <div v-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>
        <div class="form-group">
          <label for="urlInput">Enter URL:</label>
          <input v-model="url" id="urlInput" type="text" class="form-control" placeholder="https://example.com" required />
        </div>
        <div class="form-group">
          <label for="customShortName">Custom Short Name:</label>
          <input v-model="customShortName" id="customShortName" type="text" class="form-control" />
        </div>
        <div class="form-check">
          <input v-model="generateRandom" type="checkbox" class="form-check-input" id="generateRandom" />
          <label class="form-check-label" for="generateRandom">Generate Random Short Name</label>
        </div>
        <button @click="shortenUrl" class="btn btn-primary mt-3 d-block mx-auto">Shorten URL</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      url: '',
      customShortName: '',
      generateRandom: true,
      error: null,
    };
  },
  methods: {
    async shortenUrl() {
      this.error = null;
      if (!this.url) {
        this.error = 'URL cannot be empty.';
        return;
      }

      if (!this.customShortName && !this.generateRandom) {
        this.error = 'Either give custom shortname or check random shortname';
        return;
      }

      let shortName = this.generateRandom ? this.generateRandomShortName() : this.customShortName;
      const apiUrl = 'http://localhost:3000/urls';

      try {
        const currentDomain = window.location.origin;
        shortName = `${currentDomain}/${shortName}`;

        await axios.post(apiUrl, {
          originalUrl: this.url,
          shortName: shortName,
        });
        location.reload();
      } catch (error) {
        console.error('Error shortening URL:', error);
      }
    },
    generateRandomShortName() {
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    },
  },
};
</script>
