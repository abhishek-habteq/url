<template>
  <div class="container mt-5">
    <div class="shadow-lg p-3 mb-5 bg- rounded">
      <h1 class="mb-4 pt-3 text-center">Saved URLs</h1>
      <div class="container" style="height: 300px; overflow-y: auto;">
        <div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Original URL</th>
                <th scope="col">Shortened URL</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="url in savedUrls" :key="url.id">
                <td><a :href="url.originalUrl" target="_blank">{{ url.originalUrl }}</a></td>
                <td><a :href="url.originalUrl" target="_blank">{{ url.shortName }}</a></td>
                <td>
                  <button @click="deleteSavedUrl(url.id)" class="btn btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
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
      savedUrls: [],
    };
  },
  mounted() {
    this.fetchSavedUrls();
  },
  methods: {
    async fetchSavedUrls() {
      const apiUrl = 'http://localhost:3000/urls';

      try {
        const response = await axios.get(apiUrl, { timeout: 5000 });
        this.savedUrls = response.data;
      } catch (error) {
        console.error('Error fetching saved URLs:', error);
      }
    },
    async deleteSavedUrl(id) {
      const apiUrl = `http://localhost:3000/urls/${id}`;

      try {
        await axios.delete(apiUrl);
        this.fetchSavedUrls();
      } catch (error) {
        console.error('Error deleting saved URL:', error);
      }
    },
    getShortenedUrl(url) {
      return `http://localhost:8080/${url.shortName}`;
    },
  },
};
</script>
