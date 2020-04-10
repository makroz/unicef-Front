<template>
  <v-chip
    v-if="status=='1'"
    class="ma-2"
    color="green"
    text-color="white"
    small
    @click="setStatus(0)"
  >activo</v-chip>
  <v-chip v-else class="ma-2" color="red" small text-color="white" @click="setStatus(1)">inactivo</v-chip>
</template>
<script>
export default {
  name: "setstatus",
  props: {
    status: 0,
    id: 0
  },
  data() {
    return {};
  },
  methods: {
    setStatus(estado) {
      this.$emit("onStatus", this.id, estado);
    }
  }
};
</script>

