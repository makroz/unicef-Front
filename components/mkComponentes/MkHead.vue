<template>
    <v-flex sm12>
          <h3><span v-if="Auth.recycled">Papelera de </span>{{ titulo }}</h3>
    </v-flex>
</template>

<script>
export default {
  name: "mkHead",
  props: {
    titulo: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
    };
  },
    inject: ['can', 'Auth'],
};
</script>

