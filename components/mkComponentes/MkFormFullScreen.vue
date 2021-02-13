<template>
  <div>
    <v-form ref="form" v-on:submit.prevent v-model="formValid" lazy-validation>

     <v-dialog
        v-model="modal"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        
      >
                
        <v-card
          height="100%"
          style="display: flex; flex-direction: column"
          pa-0 ma-0
        >
          <v-toolbar dark color="primary" dense>
            <v-btn icon dark @click.stop="$emit('closeDialog')">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ tit }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <!-- <v-btn dark flat @click="modalMap = false">Volver</v-btn> -->
               <v-btn color="dark flat" flat @click.stop="$emit('closeDialog')">Volver</v-btn>
          <v-btn v-if="accion>=0"
            :disabled="!formValid"
            color="flat green--text"
            flat
            @click.stop="$emit('grabarItem')"
            v-text="accion > 0 ? 'Actualizar' : 'Grabar'"
          ></v-btn>
            </v-toolbar-items>
          </v-toolbar>

            <slot>Contenido</slot>
      </v-card>
                

    </v-dialog>
    </v-form>
  </div>
</template>
<script>
export default {
  name: 'mkFormFullScreen',
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
      formValid: false
    }
  }
}
</script>

