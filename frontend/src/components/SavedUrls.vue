<template>
  <div class="container mt-5">
    <div class="shadow-lg p-1 bg-light rounded">
      <h1 class="pt-2 text-center">Saved URLs</h1>
      <div class="container" style="max-height: 350px; overflow-y: auto;">
        <div v-if="alert.type" class="alert" :class="`alert-${alert.type}`" role="alert">
          {{ alert.message }}
        </div>
        <div class="btn-group mb-3">
          <button type="button" class="btn btn-secondary" @click="sortUrls('originalUrl')">Sort by Original URL</button>
          <button type="button" class="btn btn-secondary" @click="sortUrls('shortName')">Sort by Shortened URL</button>
          <button type="button" class="btn btn-secondary" @click="sortUrls('createdAt')">Sort by Creation Date</button>
        </div>
        <div class="input-group mb-5">
          <input v-model="searchTerm" type="text" class="form-control" placeholder="Search URLs" />
          <button class="btn btn-outline-secondary" type="button" @click="searchUrls">Search</button>
        </div>
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
              <tr v-for="url in displayedUrls" :key="url.id">
                <td>
                  <a :href="url.originalUrl" target="_blank">{{ url.originalUrl }}</a>
                </td>
                <td>
                  <template v-if="url.editing">
                    <form @submit.prevent="saveEditedUrl(url)">
                      <input v-model="url.shortName" class="form-control" required />
                      <button type="submit" class="btn btn-success btn-sm mt-2">Save</button>
                    </form>
                  </template>
                  <template v-else>
                    <span @click="redirectToUrl(url)" style="cursor: pointer; text-decoration: underline; color: rgb(0, 140, 255);">{{ url.shortName }}</span>
                  </template>
                </td>
                <td>
                  <span class="mr-3" @click="copyToClipboard(url.shortName)" style="cursor: pointer;" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to Clipboard">
                    <i class="bi bi-clipboard" style="font-size: 1.5rem;"></i>
                  </span>
                  <span style="font-size: 1.5rem;">|</span>
                  <span class="ml-3" @click="editShortenedUrl(url)" style="cursor: pointer;" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit this link">
                    <i class="bi bi-pencil" style="font-size: 1.5rem;"></i>
                  </span>
                  <span style="font-size: 1.5rem;">|</span>
                  <span class="ml-3" @click="deleteSavedUrl(url.id)" style="cursor: pointer;" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete this link">
                    <i class="bi bi-trash" style="font-size: 1.5rem;"></i>
                  </span>
                  <span style="font-size: 1.5rem;">|</span>
                  <a :href="'https://twitter.com/intent/tweet?url=Shortened Url: ' + url.shortName" target="_blank">
                    <i class="bi bi-twitter" style="font-size: 1.5rem;"></i>
                  </a>
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
        displayedUrls: [],
        alert: {
          type: null,
          message: null,
        },
        searchTerm: '',
        sortKey: '',
        sortDirection: 'asc',
        currentPage: 1,
        pageSize: 5,
      };
    },
    computed: {
      pageCount() {
        return Math.ceil(this.displayedUrls.length / this.pageSize);
      },
    },
    watch: {
      savedUrls() {
        this.applyFilters();
      },
      currentPage() {
        this.applyFilters();
      },
      pageSize() {
        this.applyFilters();
      },
      searchTerm() {
        this.applyFilters();
      },
      sortKey() {
        this.applyFilters();
      },
      sortDirection() {
        this.applyFilters();
      },
    },
    mounted() {
      this.fetchSavedUrls();
    },
    methods: {
      async fetchSavedUrls() {
        const apiUrl = 'http://localhost:3000/urls';
        try {
          const response = await axios.get(apiUrl, {
            timeout: 5000
          });
          this.savedUrls = response.data.map(url => ({
            ...url,
            editing: false
          }));
        } catch (error) {
          console.error('Error fetching saved URLs:', error);
        }
      },
      async deleteSavedUrl(id) {
        const apiUrl = `http://localhost:3000/urls/${id}`;
        try {
          await axios.delete(apiUrl);
          this.fetchSavedUrls();
          this.showAlert('success', 'URL deleted successfully.');
        } catch (error) {
          console.error('Error deleting saved URL:', error);
          this.showAlert('danger', 'Error deleting URL.');
        }
      },
      copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          this.showAlert('success', 'Shortened URL copied to clipboard!');
        }).catch(() => {
          this.showAlert('danger', 'Error copying URL to clipboard.');
        });
      },
      editShortenedUrl(url) {
        this.savedUrls.forEach(u => {
          if (u.id === url.id) {
            u.editing = !u.editing;
          } else {
            u.editing = false;
          }
        });
      },
      async saveEditedUrl(url) {
        const apiUrl = `http://localhost:3000/urls/${url.id}`;
        try {
          await axios.put(apiUrl, {
            shortName: url.shortName,
            originalUrl: url.originalUrl
          });
          this.fetchSavedUrls();
          this.showAlert('success', 'URL updated successfully.');
        } catch (error) {
          console.error('Error updating URL:', error);
          this.showAlert('danger', 'Error updating URL.');
        }
      },
      redirectToUrl(url) {
        if (!url.editing) {
          window.open(url.originalUrl, '_blank');
        }
      },
      showAlert(type, message) {
        this.alert.type = type;
        this.alert.message = message;
        setTimeout(() => {
          this.alert.type = null;
          this.alert.message = null;
        }, 3000);
      },
      applyFilters() {
        let filteredUrls = [...this.savedUrls];
        if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filteredUrls = filteredUrls.filter(url => url.originalUrl.toLowerCase().includes(term) || url.shortName.toLowerCase().includes(term));
        }
        if (this.sortKey) {
          filteredUrls.sort((a, b) => {
            const x = a[this.sortKey];
            const y = b[this.sortKey];
            return (x < y ? -1 : x > y ? 1 : 0) * (this.sortDirection === 'asc' ? 1 : -1);
          });
        }
        this.displayedUrls = filteredUrls;
      },
      sortUrls(key) {
        if (this.sortKey === key) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortKey = key;
          this.sortDirection = 'asc';
        }
      },
      searchUrls() {
        this.currentPage = 1;
        this.applyFilters();
      },
    },
  };
</script>