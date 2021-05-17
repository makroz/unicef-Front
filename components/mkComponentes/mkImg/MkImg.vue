<template>
  <div>
    <croppa v-show="!value.imgDel && (!value.imgCanEdit || myImg.hasImage())"
        v-model="myImg"
        :width="w" :height="h"
        prevent-white-space
        @init="onImgInit"
        :placeholder="'Arrastre o Click'"
        :placeholder-font-size="12"
        :accept="'image/*'"
        :quality="3"
        :show-remove-button="false"
        :zoom-speed="10"
        title="Arrastre o Click para cargar el Perfil"
        >
        </croppa>
        <div v-if="value.imgDel || (value.imgCanEdit && !myImg.hasImage())" @click="value.imgCanEdit=false;">
        <img   :width="w" :height="h" :src="value.imgFile"  @error="value.imgCanDel=false;value.imgCanEdit=false;"/>
        <div v-show="value.imgDel" style="position:absolute;bottom:25px;">
          <v-icon style="position:relative;font-size:100px;" color="red" >close</v-icon>
        </div>

        </div>
        <div style="position:absolute;z-index:100000;background-color:white ">
        <v-icon v-show="!value.imgDel" :small="myImg.hasImage()?value.imgMenu:false" color="red" @click="myImg.chooseFile()">image_search</v-icon>
        <v-icon v-show="value.imgCanDel " :small="myImg.hasImage()?value.imgMenu:false" :color="value.imgDel?'red':'green'"  @click="value.imgDel=!value.imgDel" >delete_forever</v-icon>
        <v-icon v-show="!value.imgDel && myImg.hasImage()" :small="value.imgMenu" @click="value.imgMenu=!value.imgMenu" :color="value.imgMenu?'grey':'red'" >control_point_duplicate</v-icon>
        <span v-show="value.imgMenu && !value.imgDel" style="position:relative;">
        <v-icon v-show="myImg.hasImage()" :small="!value.imgMenu" color="red" @click="myImg.remove()">cancel</v-icon>
        <v-icon v-show="myImg.hasImage()" :small="!value.imgMenu" color="red" @click="myImg.zoomIn()">zoom_in</v-icon>
        <v-icon v-show="myImg.hasImage()" :small="!value.imgMenu" color="red" @click="myImg.zoomOut()">zoom_out</v-icon>
        <v-icon v-show="myImg.hasImage()" :small="!value.imgMenu" color="red" @click="myImg.rotate(-1)">rotate_90_degrees_ccw</v-icon>
        <v-icon v-show="myImg.hasImage()" :small="!value.imgMenu" color="red" @click="myImg.flipX()">flip</v-icon>
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
    circle:{
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      myImg:{hasImage:()=>false},
      }
    },
  watch: {
      'value.remove':function(val){
          this.value.myImg=this.myImg;
          if (val==true){
            this.myImg.remove()
            this.value.remove=false

          }
      },
      // 'value.refresh':function(val){

      //     this.value.myImg=this.myImg;
      //     this.value.refresh=false;
      // }
    },
    mounted() {
    },
  methods: {
    onImgInit() {
      if (this.circle){
      this.myImg.addClipPlugin(function (ctx, x, y, w, h) {
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
      }
    },
  }
};
</script>

