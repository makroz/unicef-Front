<template>
  <div>
    <v-dialog v-model="modal" scrollable persistent max-width="70%">
      <v-card>
        <v-card-title>
          <span class="headline">{{ tit }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="form" v-model="formValid" lazy-validation>
            <slot>Contenido</slot>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.stop="$emit('closeDialog')">Close</v-btn>
          <v-btn
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
    }
  },
  data() {
    return {
      formValid: true
    }
  }
}
</script>

