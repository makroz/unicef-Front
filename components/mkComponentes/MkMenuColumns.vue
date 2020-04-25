<template>
    <v-menu bottom left v-model="open" >
          <v-btn icon slot="activator">
      <v-icon>filter_list</v-icon>
    </v-btn>

      <v-list>
        <v-list-tile v-for="item in items" :key="item.value" >
          <v-checkbox primary hide-details v-model="selected" :value="item.value" @change="$emit('input',item.value)"></v-checkbox>
          <v-list-tile-title>
             {{ item.text }}
            </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
</template>

<script>
export default {
  name: 'mkMenuColumns',
  props: {
    items: null
  },
  data() {
    return {
      open: false,
      campos:this.items,
      selected:this.items.filter(e=>e.visible).map(e=>{if (e.visible){return e.value}}),
    }
  },
  computed: {
  },
  methods: {}
}
</script>
