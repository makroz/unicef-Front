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
            <v-toolbar-title>
              {{ titulo }} 
              <span v-if="caption!=''" class="caption">&nbsp;&nbsp;{{ caption }}</span>
              </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <!-- <v-btn dark flat @click="modalMap = false">Volver</v-btn> -->
               <v-btn color="dark flat" flat @click.stop="$emit('closeDialog')">Volver</v-btn>
          <v-btn v-if="accion!='show'"
            :disabled="!formValid"
            color="flat green--text"
            flat
            @click.stop="$emit('grabarItem')"
            v-text="accion == 'edit' ? 'Actualizar' : 'Grabar'"
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
      type: String,
      default: 'show'
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
  },
  computed: {
    titulo() {
    return (this.tit+'|').split('|')[0]
    },
    caption() {
    return (this.tit+'|').split('|')[1];
    },
  },
}
</script>

