<template>
  <div>
    <v-dialog v-model="modal" scrollable persistent max-width="70%">
      <v-card>
        <v-card-title>
          <span class="headline">{{ titulo }} </span>
          <span v-if="caption!=''" class="caption">&nbsp;&nbsp;{{ caption }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text :class="classContent">
          <v-form
            ref="form"
            id="form"
            v-on:submit.prevent
            v-model="formValid"
            lazy-validation
          >
            <slot>Contenido</slot>
            <!-- <div style="position: absolute;background-color:red; width: 100%;height:100%;top:0;left:0;opacity: 0;"></div> -->
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.stop="$emit('closeDialog')"
            >Close</v-btn
          >
          <v-btn
            v-if="accion != 'show'"
            :disabled="!formValid"
            color="green darken-1"
            flat
            @click.stop="$emit('grabarItem')"
            v-text="accion == 'edit' ? 'Actualizar' : 'Grabar'"
            >Actualizar</v-btn
          >
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
      formValid: true
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
  mounted() {
    //console.log(this.$ref);
  }
}
</script>

