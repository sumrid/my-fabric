<template>
  <div id="nav">
    <b-nav align="center">
      <router-link to="/user">User</router-link><router-link to="/wallet">_Wallet_</router-link><router-link to="/Query">Query</router-link>
    </b-nav>
  </div>
</template>

<style>
#nav {
  padding: 30px;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
