<template>
    <div class="container-md">
      <nav class="navbar sticky-top navbar-expand-lg navbar-light me-auto bg-">
        <div class="container-fluid opacity-100">
          <router-link to="/" class="navbar-brand d-lg-none no-active">Home</router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            :aria-expanded="isNavbarOpen"
            aria-label="Toggle navigation"
            @click="handleToggle"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div :class="['justify-content-center', 'collapse', 'navbar-collapse', isNavbarOpen ? 'show' : '']" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/" class="nav-link no-active" @click="handleToggle">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/my-links" class="nav-link no-active" @click="handleToggle">My Links</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </template>
  
  
  <script>
  export default {
    name: 'Nav_bar', 
  };
  </script>
