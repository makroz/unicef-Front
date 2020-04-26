<template>
  <v-menu bottom left v-model="open">
    <v-btn icon slot="activator">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-list>
      <template v-for="item in items">
        <v-list-tile :key="item.value" v-if="!item.fixed">
          <v-checkbox
            primary
            hide-details
            input-value="item.visible" value
            @change="$emit('input',item.value)"
          ></v-checkbox>
          <v-list-tile-title>{{ item.text }}</v-list-tile-title>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'mkMenuColumns',
  props: {
    items:{
      type: [Array,Object],
      default: []
    }},
  data() {
    return {
      open: false,
    }
  },
}
</script>
