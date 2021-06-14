<template>
  <v-card class="pa-2">
    <v-toolbar :color="color" dark dense>
      <v-toolbar-title class="body-1">{{ titulo }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        icon
        color="green"
        @click="value.push({})"
        small
        v-if="accion != 'show'"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout
      row
      wrap
      fill-height
      v-for="(det, index) in value"
      :key="index"
      style="border-bottom: 1px dotted gray"
    >
      <v-flex grow>
        <v-layout row wrap>
          <slot v-bind:det="det"></slot>
        </v-layout>
      </v-flex>
      <v-flex shrink v-if="accion != 'show'">
        <v-btn icon color="red" @click="value.splice(index, 1)" small dark>
          <v-icon>remove</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: 'MkDetalle',
  props: {
    titulo: {
      type: String,
      default: ''
    },
    value: {
      type: [Array, Object],
      default: () => {
        return []
      }
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