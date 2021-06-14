<template>
  <v-card class="pa-2">
    <v-toolbar :color="color" dark dense>
      <v-toolbar-title class="body-1">{{ titulo }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="titBtn"></slot>
    </v-toolbar>
    <v-layout row wrap>
      <slot></slot>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'MkPanel',
  props: {
    titulo: {
      type: String,
      default: ''
    },
    accion: {
      type: String,
      default: 'add'
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>