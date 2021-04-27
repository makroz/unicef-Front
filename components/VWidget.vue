<template>
  <div @mouseover="elevation='elevation-9'" @mouseout="elevation=''">
    <v-card :class="elevation">
      <v-toolbar  :color="color" flat dense card v-if="enableHeader">
        <v-toolbar-title><h4 class="font-weight-black">{{title}}</h4></v-toolbar-title>
        <v-spacer></v-spacer>
        <slot name="widget-header-action"></slot>
      </v-toolbar>
      <v-divider v-if="enableHeader"></v-divider>
      <v-card-text :class="contentBg">
        <slot></slot>       
      </v-card-text>       
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'v-widget',
  props: {
    title: {
      type: String,
    },
    enableHeader: {
      type: Boolean,
      default: true
    },
    contentBg: {
      type: String,
      default: 'white'
    },
    color: {
      type: String,
      default: 'grey'
    }

  },

  data () {
    return {
      elevation:''
    };
  },
  computed: {

  },  
};
</script>
