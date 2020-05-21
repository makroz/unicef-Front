<script>
import Croppa from 'vue-croppa';
export default {
  name: 'MkImgMix',
  components:{'mk-img': Croppa.component},
  data() {
    return {
      imgMenu:false,
      imgCanDel:true,
      imgDel:false,
      myImg: {},
      imgFile:'',
      imgCanEdit:false,
    }
  },
  methods: {
    onImgInit() {
      this.myImg.addClipPlugin(function (ctx, x, y, w, h) {
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
    },
  },
}
</script>
