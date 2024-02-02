<template>
  <div class="container mt-5">
    <div class="shadow-lg p-3 mb-5 bg-light rounded">
      <h1 class="mb-4 pt-3 text-center">URL Shortener</h1>
      <div class="row">
        <div class="col-md-8">
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div class="form-group">
            <label for="urlInput">Enter URL:</label>
            <input v-model="url" @input="onUrlInput" id="urlInput" type="url" class="form-control" placeholder="https://example.com" required />
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
        <!-- Preview Section -->
        <div class="col-md-4">
          <div class="card mt-3" v-if="urlPreview" @click="redirectToUrl" style="cursor: pointer; max-height: 400px;">
            <img :src="urlPreview.image" class="card-img-top" alt="Preview" style="max-height: 150px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">{{ urlPreview.title }}</h5>
              <p class="card-text">{{ urlPreview.description }}</p>
            </div>
            <div class="card-footer">
              <small class="text-muted" v-if="url">{{ url }}</small>
            </div>
          </div>
          <div class="card mt-3" v-else style="max-height: 200px; max-width: 100px;">
            <div class="card-body">
              <p>{{ url ? 'No preview available ' : 'Enter a URL to preview' }}</p>
            </div>
          </div>
        </div>
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
        urlPreview: null,
        opengraphApiKey: 'a7beb76d-a673-47b3-91c7-f8813c52b60c',
      };
    },
    methods: {
      async shortenUrl() {
        this.error = null;
        if (!this.url) {
          this.error = 'URL cannot be empty.';
          return;
        }
        if (!this.isValidUrl(this.url)) {
          this.error = 'Please enter a valid URL.';
          return;
        }
        if (!this.customShortName && !this.generateRandom) {
          this.error = 'Either give a custom shortname or check random shortname';
          return;
        }
        let shortName = this.generateRandom ? this.generateRandomShortName() : this.customShortName;
        const apiUrl = 'http://localhost:3000/urls';
        try {
          const currentDomain = 'http://localhost:3000';
          shortName = `${currentDomain}/${shortName}`;
          const openGraphData = await this.fetchOpenGraphData(this.url);
          await axios.post(apiUrl, {
            originalUrl: this.url,
            shortName: shortName,
          });
          this.urlPreview = openGraphData;
          this.url = '';
          this.fetchUrlPreview();
          location.reload();
        } catch (error) {
          console.error('Error shortening URL:', error);
        }
      },
      onUrlInput() {
        this.fetchUrlPreview();
      },
      generateRandomShortName() {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      },
      async fetchOpenGraphData(url) {
        try {
          const response = await axios.get(`https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${this.opengraphApiKey}`);
          return response.data.hybridGraph;
        } catch (error) {
          console.error('Error fetching Open Graph data:', error);
          return null;
        }
      },
      async fetchUrlPreview() {
        if (this.url) {
          const openGraphData = await this.fetchOpenGraphData(this.url);
          this.urlPreview = openGraphData;
        } else {
          this.urlPreview = null;
        }
      },
      redirectToUrl() {
        if (this.url) {
          window.open(this.url, '_blank');
        }
      },
      isValidUrl(url) {
        const urlRegex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
        return urlRegex.test(url);
      },
    },
  };
</script>