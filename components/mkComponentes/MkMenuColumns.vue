<template>
  <v-menu bottom left v-model="open" :close-on-content-click='false'>
    <v-btn icon slot="activator">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-list>
      <template v-for="(item, index) in items_">
        <v-list-tile :key="item.value" v-if="!item.fixed" ripple="ripple" >
          <v-list-tile-content @click="$emit('column:visible',item.value)" >
            <v-list-tile-title >
              <v-checkbox
                :input-value="item.visible?'true':''"
                :label="item.text"
              ></v-checkbox>
            </v-list-tile-title>
          </v-list-tile-content>
           <v-list-tile-action style="min-width:30px">
              <v-btn icon ripple v-if="index<items_.length-1" @click="$emit('column:sort',index,index+1)">
                <v-icon color="grey lighten-1">arrow_downward</v-icon>
              </v-btn>
            </v-list-tile-action>
           <v-list-tile-action style="min-width:30px">
              <v-btn icon ripple v-if="index>0" @click="$emit('column:sort',index,index-1)" >
                <v-icon color="grey lighten-1">arrow_upward</v-icon>
              </v-btn>
            </v-list-tile-action>

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
  },
  computed: {
    items_:function (){
      return this.items.filter(e=>!e.fixed);
    }
  },
}
</script>
