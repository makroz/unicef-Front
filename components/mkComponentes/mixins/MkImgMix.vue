<script>
import MkImg from '@/components/mkComponentes//mkImg/MkImg';
export default {
  name: 'MkImgMix',
  components:{MkImg},
  data() {
    return {
      mkImgData:{
      imgMenu:false,
      imgCanDel:true,
      imgDel:false,
      myImg: {},
      imgFile:'',
      imgCanEdit:false,
      }
    }
  },
  methods: {

  },
}
</script>
