<template>
  <div>
    <v-dialog v-model="modal" scrollable persistent max-width="70%">
      <v-card >
        <v-card-title>
          <span class="headline">{{ tit }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text :class="classContent">
          <v-form ref="form" id="form" v-on:submit.prevent v-model="formValid" lazy-validation>
            <slot>Contenido</slot>
            <!-- <div style="position: absolute;background-color:red; width: 100%;height:100%;top:0;left:0;opacity: 0;"></div> -->
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.stop="$emit('closeDialog')">Close</v-btn>
          <v-btn v-if="accion>=0"
            :disabled="!formValid"
            color="green darken-1"
            flat
            @click.stop="$emit('grabarItem')"
            v-text="accion > 0 ? 'Actualizar' : 'Grabar'"
          >Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'mkFormulario',
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    tit:{
      type: String,
      default: ''
    },
    accion: {
      type: Number,
      default: 0
    },
    classContent:{
      type: String,
      default: ''
    },


  },
  data() {
    return {
      formValid: true
    }
  },
  mounted() {
    console.log(this.$ref);
  }
}
</script>

