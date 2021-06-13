<template >
  <div>
    <v-dialog v-model="modal" :fullscreen="printing" :scrollable="!printing" persistent :max-width="printing?'100%':width" style="border:0" >
      <v-card :class="[printing?'hidden-screen-only':'']" >
        <v-card-title class="headline py-1 hidden-print-only" >
          <span v-html="titulo">
          </span>
          <v-spacer></v-spacer>
          <v-btn
            v-if="accion == 'show'"
            small
            color="blue darken-1"
            flat
            @click.stop="print()"
            >Imprimir</v-btn
          >
        </v-card-title>
        <v-divider class="hidden-print-only"></v-divider>
        <v-card-text :class="classContent">
          <v-form
            ref="form"
            v-on:submit.prevent
            v-model="formValid"
            lazy-validation
          >
            <div class="headline hidden-screen-only" v-html="titulo">
            </div>
            <v-divider class="hidden-screen-only"></v-divider>
            <v-container grid-list-md fluid pa-0 class="white">
            <slot>Contenido</slot>
             </v-container>
            <!-- <div style="position: absolute;background-color:red; width: 100%;height:100%;top:0;left:0;opacity: 0;"></div> -->
          </v-form>
        </v-card-text>
        <v-divider class="hidden-print-only"></v-divider>
        <v-card-actions class="hidden-print-only py-1">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.stop="$emit('closeDialog')"
            >Close</v-btn
          >
          <v-btn
            v-if="accion != 'show'"
            :disabled="!formValid"
            color="green darken-1"
            flat
            @click.stop="grabar"
            v-text="
              bTitulo != ''
                ? bTitulo
                : accion == 'edit'
                ? 'Actualizar'
                : 'Grabar'
            "
            >Actualizar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import MkOncesMix from '@/components/mkComponentes/mixins/MkOncesMix'
export default {
  name: 'mkFormulario',
  mixins: [MkOncesMix],
  props: {
    modal: {
      type: Boolean,
      default: false,
    },
    tit: {
      type: String,
      default: '',
    },
    accion: {
      type: String,
      default: 'show',
    },
    classContent: {
      type: String,
      default: '',
    },
    bTitulo: {
      type: String,
      default: '',
    },
     width: {
      type: String,
      default: '80%',
    },
  },
  data() {
    return {
      formValid: true,
      printing: false,
    }
  },
  methods: {
    print() {
      this.printing=true;
       setTimeout(() => {
          this.printing=false;
        }, 600)

      setTimeout(() => {
          window.print()
        }, 500)
      // window.print()
      // this.printing=false;
//      this.$store.dispatch('auth/imprimirElemento',this.$refs.form.$el.innerHTML)
    },
    grabar() {
      this.timeOnces = 5000
      if (this.initOnce('GrabarForm')) {
        return false
      }
      this.$emit('grabarItem')
    },
  },
  computed: {
    titulo() {
      let tit = (this.tit + '|').split('|')
      let caption = tit[1]
      tit = tit[0]
      if (caption) {
        tit = tit + '<span class="caption">&nbsp;&nbsp;' + caption + '</span>'
      }
      return tit
    },
  },
  mounted() {
    //console.log(this.$ref);
  },
}
</script>
<style >

@media print {
.v-sheet{
  border:0;
  border-radius:0;
}
.v-input__icon.v-input__icon--append{
  display:none !important;
}
}
</style>

