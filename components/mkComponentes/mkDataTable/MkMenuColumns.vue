<template>
  <v-menu bottom left v-model="open" :close-on-content-click="false">
    <v-btn icon slot="activator">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-list>
      <draggable v-model="items_" @change="onChange">
        <template v-for="item in items_">
          <v-list-tile :key="item.value" v-if="item.fixed!==true" ripple="ripple">
            <v-list-tile-content @click="onVisible(item.value)">
              <v-list-tile-title>
                <v-icon  v-if="!item.hidden">visibility</v-icon>
                <v-icon v-else color="red" >visibility_off</v-icon>
                {{item.text}}
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action style="min-width:30px">
              <v-btn icon ripple>::</v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </draggable>
    </v-list>
  </v-menu>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'mkMenuColumns',
  components: {
    draggable
  },
  props: {
    items: {
      type: [Array, Object],
      default: []
    }
  },
  data() {
    return {
      open: false,
      items_: this.items
    }
  },
  watch: {
    items(n,o){
      this.items_=n;
    }
  },
  methods: {
    onChange: function(e) {
      this.$emit('column:change', this.items_,false)
    },
    onVisible: function(value){
      //console.log('paso 1:',JSON.stringify(item),JSON.stringify(this.items_));
      //this.$set(item, 'hidden', !item.hidden);
      // this.items_.forEach((e) => {
      //   const a=e
      //   if (e.value == value) {
      //       e.hidden=!e.hidden;
      //     console.log(a.hidden,e.hidden);
      //   }
      // })
      //console.log('paso 2:',JSON.stringify(item),JSON.stringify(this.items_));
      this.$emit('column:change', value,true);
    }
  }
}
</script>
