<template>
  <div class="container mt-5">
    <div class="shadow-lg p-3 mb-5 bg-light rounded">
      <h1 class="mb-4 pt-3 text-center">URL Shortener</h1>
      <div class="container">
        <div class="form-group">
          <label for="urlInput">Enter URL:</label>
          <input v-model="url" id="urlInput" type="text" class="form-control" placeholder="https://example.com" />
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
        <div v-if="shortenedUrl" class="mt-4 text-center">
          <p>Shortened URL:</p>
          <a :href="shortenedUrl" target="_blank" rel="noopener noreferrer" class="text-break">{{ shortenedUrl }}</a>
          <div v-if="savedUrls.length">
            <p class="mt-3">Saved URLs:</p>
            <ul>
              <li v-for="(savedUrl, index) in savedUrls" :key="index" class="mb-2">
                <span class="mr-2">
                  <a :href="savedUrl" target="_blank" rel="noopener noreferrer" class="text-break">{{ savedUrl }}</a>
                </span>
                <button @click="deleteSavedUrl(index)" class="btn btn-danger btn-sm">Delete</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        url: '',
        customShortName: '',
        generateRandom: true,
        shortenedUrl: null,
        savedUrls: [],
      };
    },
    methods: {
      shortenUrl() {
        let shortName = this.generateRandom ? this.generateRandomShortName() : this.customShortName;
        const domainRoot = window.location.origin;
        this.shortenedUrl = `${domainRoot}/${shortName}`;
        this.saveUrlToLocalStorage(this.shortenedUrl);
      },
      saveUrlToLocalStorage(url) {
        const savedUrls = JSON.parse(localStorage.getItem('savedUrls')) || [];
        savedUrls.push(url);
        localStorage.setItem('savedUrls', JSON.stringify(savedUrls));
        this.savedUrls = savedUrls;
      },
      deleteSavedUrl(index) {
        this.savedUrls.splice(index, 1);
        localStorage.setItem('savedUrls', JSON.stringify(this.savedUrls));
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