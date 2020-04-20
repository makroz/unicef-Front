<template>
    <v-flex sm12>
          <h3><span v-if="Auth.recycled">Papelera de </span>{{ titulo }}</h3>
    </v-flex>
</template>

<script>
export default {
  name: "mkHead",
  props: {
    titulo: '',
  },
  data() {
    return {
    };
  },
  inject: {Auth:{ default: {} },can:{default:()=>true}},
  methods: {
  }
};
</script>

