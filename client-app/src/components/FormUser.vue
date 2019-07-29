<template>
  <div class="row">
    <div class="col-sm"></div>
    <div class="col-sm">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-2" label="User name:">
          <b-form-input
            v-model="form.walletName"
            required
            placeholder="Enter your name"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Money:">
          <b-form-input id="input-2" v-model="form.money" required placeholder="Enter money"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Owner:" label-for="owner">
          <b-form-input id="input-2" v-model="form.owner" required placeholder="Enter your name"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </div>

    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>

    <div class="col-sm"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        walletName: "",
        money: "",
        owner: ""
      },
      show: true
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.walletName = "";
      this.form.money = "";
      this.form.owner = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>
