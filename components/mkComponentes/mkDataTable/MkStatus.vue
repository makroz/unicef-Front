<template>
  <v-icon
    :color="status=='1'?'green':'red'"
    small
    @click="setStatus(status==1?0:1)"
  >fiber_manual_record</v-icon>
</template>
<script>
export default {
  name: 'setstatus',
  props: {
    status: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {}
  },
  inject: { Auth: { default: {} }, can: { default: () => true } },
  methods: {
    setStatus(estado) {
      if (this.can('edit')) {
        this.$emit('onStatus', this.id, estado)
      }
    }
  }
}
</script>

