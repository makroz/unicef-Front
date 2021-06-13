<template>
  <div>
     <v-dialog
        v-model="modal"
        fullscreen
        persistent
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card
          height=""
          style=" flex-direction: column"
          pa-0 ma-0
        >
          <v-toolbar dark color="primary" dense hidden-print-only>
            <v-btn icon dark @click.stop="$emit('closeDialog')">
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn v-if="accion == 'show'" icon dark @click.stop="print()">
              <v-icon>print</v-icon>
            </v-btn>
            <v-toolbar-title v-html="titulo"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
           
              <!-- <v-btn dark flat @click="modalMap = false">Volver</v-btn> -->

               <v-btn color="white flat" flat @click.stop="$emit('closeDialog')" >
                 Volver
                 </v-btn>
          <v-btn v-if="accion!='show'"
            :disabled="!formValid"
            color="flat white"
            flat
            @click.stop="grabar"
           v-text="bTitulo!=''?bTitulo:accion == 'edit' ? 'Actualizar' : 'Grabar'"
          ></v-btn>
            </v-toolbar-items>
          </v-toolbar>
<v-form ref="form" v-on:submit.prevent v-model="formValid" lazy-validation >
  <div class="headline hidden-screen-only">
              {{ titulo }}
            </div>
            <v-container grid-list-md fluid class="white">
            <slot>Contenido</slot>
             </v-container>
  </v-form>
<v-toolbar v-if="menuBottom" dark color="primary" dense>
            <v-spacer></v-spacer>
            <v-toolbar-items>
               <v-btn color="dark flat" flat @click.stop="$emit('closeDialog')">Volver</v-btn>
          <v-btn v-if="accion!='show'"
            :disabled="!formValid"
            color="flat green--text"
            flat
            @click.stop="grabar"
            v-text="bTitulo!=''?bTitulo:accion == 'edit' ? 'Actualizar' : 'Grabar'"
          ></v-btn>
            </v-toolbar-items>
          </v-toolbar>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import MkOncesMix from '@/components/mkComponentes/mixins/MkOncesMix'
export default {
  name: 'mkFormFullScreen',
  mixins: [MkOncesMix],
  props: {
    modal: {
      type: Boolean,
      default: false
    },
    menuBottom: {
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
    bTitulo:{
      type: String,
      default: ''
    },


  },
  data() {
    return {
      formValid: false
    }
  },
  methods: {
   print() {
      this.$store.dispatch('auth/imprimirElemento',this.$refs.form.$el.innerHTML)
    },
    grabar(){
      this.timeOnces=5000
      if (this.initOnce('GrabarFullForm')){
        return false
      }
      this.$emit('grabarItem')
    },
  },
  computed: {
    titulo() {
      let tit=(this.tit+'|').split('|');
      let caption=tit[1]
      tit=tit[0]
      if (caption) {
        tit=tit+'<span class="caption">&nbsp;&nbsp;'+caption+'</span>'
      }
      return tit
    },
  },
}
</script>

