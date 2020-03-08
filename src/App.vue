<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>|
      <router-link to="/player/3719xx">Spekio</router-link>|
      <input type="text" v-model="id" />
      <button @click="playerSearch">Submit</button>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      id: ""
    };
  },
  methods: {
    playerSearch() {
      this.$router.push({ name: "Player", params: { id: this.id } });
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:600&display=swap");

#app {
  font-family: "Yanone Kaffeesatz", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  text-align: left;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
