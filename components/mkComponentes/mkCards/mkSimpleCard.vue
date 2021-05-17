<template>
  <v-flex pa-1 mx-1 :class="[classText, 'text-xs-center','elevation-10',color]"
  :color="color"
   >
    <div :class="[classTit, 'text-xs-center','caption']">
      {{ title }}
    </div>
    <div :class="[classText, 'text-xs-center','title','white--text']">
      {{ text }}
    </div>
  </v-flex>
</template>
<script>
export default {
  name: 'mkSimpleCard',
  props: {  
    title: {
      type: String,
      default: ''
    },
    text: {
      type: [String,Number],
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    classTit: {
      type: String,
      default: ''
    },
    classText: {
      type: String,
      default: ''
    },
  },
  data() {
    return {}
  },
  methods: {
  },
}
</script>
<style >
</style>

