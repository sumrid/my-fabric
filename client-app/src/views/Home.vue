<template>
  <div class="home">
    <hr>
    <!-- แถบเมนูด้านบนของหน้า home -->
    <Nav></Nav>

    <!-- แสดงหน้าตาม route -->
    <router-view/>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import WalletForm from "@/components/FormWallet.vue";
import Nav from "@/components/NavBar.vue";

export default {
  name: "home",
  components: {
    Nav,
    HelloWorld,
    WalletForm
  }
};
</script>
