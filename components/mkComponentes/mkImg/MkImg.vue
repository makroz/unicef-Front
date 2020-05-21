<template>
  <div>
    <croppa v-show="!datos.imgDel && (!datos.imgCanEdit || (datos.myImg.hasImage && datos.myImg.hasImage()))"
        v-model="datos.myImg"
        :width="w" :height="h"
        prevent-white-space
        @init="onImgInit"
        :placeholder="'Arrastre o Click'"
        :placeholder-font-size="12"
        :accept="'image/*'"
        :quality="2"
        :show-remove-button="false"
        :zoom-speed="10"
        title="Arrastre o Click para cargar el Perfil"
        >
        </croppa>
        <div v-if="datos.imgDel || datos.imgCanEdit && (datos.myImg.hasImage && !datos.myImg.hasImage())" @click="datos.imgCanEdit=false;">
        <img   :width="w" :height="h" :src="datos.imgFile"  @error="datos.imgCanDel=false;datos.imgCanEdit=false;"/>
        <div v-show="datos.imgDel" style="position:absolute;bottom:25px;">
          <v-icon style="position:relative;font-size:100px;" color="red" >close</v-icon>
        </div>

        </div>
        <div style="position:absolute;z-index:100000;background-color:white ">
        <v-icon v-show="!datos.imgDel" :small="datos.myImg.hasImage?datos.myImg.hasImage()?datos.imgMenu:false:false" color="red" @click="datos.myImg.chooseFile()">image_search</v-icon>
        <v-icon v-show="datos.imgCanDel " :small="datos.myImg.hasImage?datos.myImg.hasImage()?datos.imgMenu:false:false" :color="datos.imgDel?'red':'green'"  @click="datos.imgDel=!datos.imgDel" >delete_forever</v-icon>
        <v-icon v-show="!datos.imgDel && (datos.myImg.hasImage?datos.myImg.hasImage():false)" :small="datos.imgMenu" @click="datos.imgMenu=!datos.imgMenu" :color="datos.imgMenu?'grey':'red'" >control_point_duplicate</v-icon>
        <span v-show="datos.imgMenu && !datos.imgDel" style="position:relative;">
        <v-icon v-show="datos.myImg.hasImage?datos.myImg.hasImage():false" :small="!datos.imgMenu" color="red" @click="datos.myImg.remove()">cancel</v-icon>
        <v-icon v-show="datos.myImg.hasImage?datos.myImg.hasImage():false" :small="!datos.imgMenu" color="red" @click="datos.myImg.zoomIn()">zoom_in</v-icon>
        <v-icon v-show="datos.myImg.hasImage?datos.myImg.hasImage():false" :small="!datos.imgMenu" color="red" @click="datos.myImg.zoomOut()">zoom_out</v-icon>
        <v-icon v-show="datos.myImg.hasImage?datos.myImg.hasImage():false" :small="!datos.imgMenu" color="red" @click="datos.myImg.rotate(-1)">rotate_90_degrees_ccw</v-icon>
        <v-icon v-show="datos.myImg.hasImage?datos.myImg.hasImage():false" :small="!datos.imgMenu" color="red" @click="datos.myImg.flipX()">flip</v-icon>
        </span>
      </div>
                 .
      </div>
</template>
<script>
import Croppa from 'vue-croppa';
export default {
  name: "mkImg",
  components:{'croppa': Croppa.component},
  props:
  //['w','h','value'],
  {
    w:{
      type:[Number],
      default:100
    },
    h:{
      type:[Number],
      default:100
    },
    value:{
      type: [Array,Object],
      default: {}
    },
  },

  data() {
    return {
      datos:this.value
      }
    },
  watch: {
    datos:()=>{
      this.emit('input',datos);
    },
    value:()=>{
      this.datos=this.value;
    },

    },
  methods: {
    onImgInit() {
      this.datos.myImg.addClipPlugin(function (ctx, x, y, w, h) {
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
    },
  }
};
</script>

