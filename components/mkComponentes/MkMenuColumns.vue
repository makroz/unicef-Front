<template>
  <v-menu bottom left v-model="open">
    <v-btn icon slot="activator">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-list>
      <template v-for="item in items">
        <v-list-tile :key="item.value" v-if="!item.fixed" ripple="ripple" @click="$emit('input',item.value)">
          <v-list-tile-content>
            <v-list-tile-title >
              <v-checkbox
                :input-value="item.visible?'true':''"
                :label="item.text"

              ></v-checkbox>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'mkMenuColumns',
  props: {
    items: {
      type: [Array, Object],
      default: []
    }
  },
  data() {
    return {
      open: false
    }
  }
}
</script>
