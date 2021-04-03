<script>
export default {
  name: 'MkOncesMix',
  data() {
    return {
        lOnces:[],
        timesOnces:2000,
    }
  },
  methods: {
    initOnce(id,c=0,first=true){
      if (first){
        if (!this.lOnces[id]){
          this.lOnces[id]=1
        }else{
          if (this.lOnces[id]>0){
          console.log('Bloqueo de funcion Duplicada'+id+' '+this.lOnces[id]);
          return true
          }
          this.lOnces[id]=this.lOnces[id]+1
        }
        setTimeout(() => {
          this.endOnce(id)
        }, this.timeOnces);
        return false
      }
      return true;
    },
    endOnce(id){
      this.lOnces[id]=0
      return false
    },
  },
}
</script>