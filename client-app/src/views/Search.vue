<template>
  <div class="container">
    <div class="row">
      <b-input
        type="text"
        v-model="search"
        required
        @keyup.enter="query"
        placeholder="Search.... then Enter"
      />
    </div>
    <div class="row">
      <h3>Result:</h3>
    </div>
    <div class="row">
      {{result}}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function() {
    return {
      search: "",
      result: ""
    };
  },
  methods: {
    async query() {
      const URL = "http://192.168.1.2:8000/api/query/" + this.search;
      this.result = URL;
      this.search = "";

      const res = await axios.get(URL);
      this.result = res.data;
    }
  }
};
</script>
