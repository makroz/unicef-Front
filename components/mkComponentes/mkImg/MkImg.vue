<template>
  <div>
    <a v-if="onlyShow" :href="value.imgFile" target="_blank">
    <img  :width="w" :height="h" :src="value.imgFile" />
    </a>
    <div v-else>
    <croppa v-show="!value.imgDel && (!value.imgCanEdit || value.myImg.hasImage())"
        v-model="value.myImg"
        :width="w" :height="h"
        prevent-white-space
        :placeholder="'Arrastre o Click'"
        :placeholder-font-size="12"
        :accept="'image/*'"
        :quality="3"
        :show-remove-button="false"
        :zoom-speed="10"
        title="Arrastre o Click para cargar la imagen"
        >
        </croppa>
        <div v-if="value.imgDel || (value.imgCanEdit && !value.myImg.hasImage())" @click="value.imgCanEdit=false;">
        <img   :width="w" :height="h" :src="value.imgFile"  @error="value.imgCanDel=false;value.imgCanEdit=false;"/>
        <div v-show="value.imgDel" style="position:absolute;bottom:25px;">
          <v-icon style="position:relative;font-size:100px;" color="red" >close</v-icon>
        </div>

        </div>
        <div style="position:absolute;z-index:100000;background-color:white ">
        <v-icon v-show="!value.imgDel" :small="myImg.hasImage()?value.imgMenu:false" color="red" @click="value.myImg.chooseFile()">image_search</v-icon>
        <v-icon v-show="value.imgCanDel " :small="myImg.hasImage()?value.imgMenu:false" :color="value.imgDel?'red':'green'"  @click="value.imgDel=!value.imgDel" >delete_forever</v-icon>
        <v-icon v-show="!value.imgDel && myImg.hasImage()" :small="value.imgMenu" @click="value.imgMenu=!value.imgMenu" :color="value.imgMenu?'grey':'red'" >control_point_duplicate</v-icon>
        <span v-show="value.imgMenu && !value.imgDel" style="position:relative;">
        <v-icon v-show="value.myImg.hasImage()" :small="!value.imgMenu" color="red" @click="value.myImg.remove()">cancel</v-icon>
        <v-icon v-show="value.myImg.hasImage()" :small="!value.imgMenu" color="red" @click="value.myImg.zoomIn()">zoom_in</v-icon>
        <v-icon v-show="value.myImg.hasImage()" :small="!value.imgMenu" color="red" @click="value.myImg.zoomOut()">zoom_out</v-icon>
        <v-icon v-show="value.myImg.hasImage()" :small="!value.imgMenu" color="red" @click="value.myImg.rotate(-1)">rotate_90_degrees_ccw</v-icon>
        <v-icon v-show="value.myImg.hasImage()" :small="!value.imgMenu" color="red" @click="value.myImg.flipX()">flip</v-icon>
        </span>
      </div>
            </div>
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
    onlyShow:{
      type: Boolean,
      default: false
    },
  },

  data() {
    return {
      myImg:{hasImage:()=>false},
      //myImg:{},
      
      }
    },
  watch: {
      'value.remove':function(val){
         // this.value.myImg=this.myImg;
          if (val==true){
            this.value.myImg.remove()
            this.value.remove=false
            console.log('vlaue refresh',val);

          }
      },
      'value.refresh':function(val){
         // this.value.myImg=this.myImg;
          this.value.refresh=false;
          console.log('vlaue refresh',val);
      }
    },
    mounted() {
      //this.myImg=this.value.myImg
    },
  methods: {
    onImgInit() {
      if (this.circle){
      this.value.myImg.addClipPlugin(function (ctx, x, y, w, h) {
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
      }
    },
  }
};
</script>

