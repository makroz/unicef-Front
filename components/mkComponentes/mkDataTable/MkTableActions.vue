<template>
  <v-container class="pa-1">
    <v-speed-dial
      v-if="type == 'dial'"
      v-model="fab"
      :direction="direction"
      :open-on-hover="true"
      :transition="transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="secundary darken-2" dark fab small>
          <v-icon>build</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <template v-for="opt in acciones">
        <v-btn
          :key="opt.value"
          v-if="
            opt.visible &&
            opt.grupos.includes(grupo) &&
            (!opt.visibleRow ? true : opt.visibleRow(item))
          "
          fab
          dark
          small
          :color="opt.color"
          @click.stop="callAction(opt, item)"
        >
          <v-icon>{{ opt.icon }}</v-icon>
        </v-btn>
      </template>
    </v-speed-dial>
    <v-layout v-else>
      <template v-for="opt in acciones">
        <v-flex
          :key="opt.value"
          v-if="opt.visible && opt.grupos.includes(grupo)"
        >
          <v-btn
            class="pa-0 ma-0"
            icon
            flat
            :color="opt.color"
            small
            @click.stop="callAction(opt, item)"
          >
            <v-icon>{{ opt.icon }}</v-icon>
          </v-btn>
        </v-flex>
      </template>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'mkTableActions',
  components: {},
  props: ['item', 'acciones', 'tipo'],
  data() {
    return {
      fab: false,
      type: this.tipo,
      transition: 'slide-x-reverse-transition',
    }
  },
  inject: ['Auth', 'can'],
  methods: {
    callAction(opt, item) {
      this.$emit('callAction', opt, item)
    },
    mostrar(opt, item) {
      return (
        opt.visible &&
        opt.grupos.includes(this.grupo) &&
        (!opt.visibleRow ? true : opt.visibleRow(item))
      )
    },
  },
  computed: {
    grupo() {
      return this.Auth.recycled ? 'recycled' : 'action'
    },
    direction() {
      return this.$store.state.config.tbl_opts_p ? 'left' : 'right'
    },
  },
  mounted() {
    if (!this.type) {
      this.type = this.$store.state.config.tbl_opts_type
    }

    //this.direction=this.$store.state.config.tbl_opts_p?'left':'right'
    //this.direction='left'
    //console.log('rowmounted')
  },
}
</script>

