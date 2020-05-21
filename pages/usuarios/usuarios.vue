<template>
  <div id="pageTable">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <mk-head :titulo="titModulo"></mk-head>
        <v-flex lg12>
          <mk-data-table
            v-bind="dataTable"
            :campos="campos"
            @openDialog="openDialog"
            @deleteItem="deleteItem"
            @setStatus="setStatus"
            @listar="listar"
            @onPerPageChange="onPerPageChange"
            @column:change="onColChange"
            @onBuscar="onBuscar"
          ></mk-data-table>
        </v-flex>
      </v-layout>

      <mk-form
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="item.id"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
      >
        <v-tabs grow v-model="tabs" color="primary" dark slider-color="yellow">
          <v-tab>Datos Personales</v-tab>
          <v-tab>Permisos</v-tab>
        </v-tabs>

        <v-tabs-items grow v-model="tabs">
          <v-tab-item>


            <v-text-field
              label="Nombre"
              v-model="item.name"
              :rules="[rules.required]"
              validate-on-blur
              ref="focus"
            ></v-text-field>

            <v-text-field
              label="eMail"
              v-model="item.email"
              :rules="[rules.required,rules.email,rules.unique('email')]"
              ref="email"
              validate-on-blur
            ></v-text-field>
<v-layout row>
 <v-flex
        shrink
        pa-1
      >

      <croppa v-show="!imgDel && (!cropaEdit || (myCroppa.hasImage && myCroppa.hasImage()))" v-model="myCroppa" :width="100" :height="100" prevent-white-space @init="onInit"
        :placeholder="'Arrastre o Click'"
        :placeholder-font-size="12"
        :accept="'image/*'"
        :quality="2"
        :show-remove-button="false"
        :zoom-speed="10"
        title="Arrastre o Click para cargar el Perfil"
        >
        </croppa>
        <div v-if="imgDel || cropaEdit && (myCroppa.hasImage && !myCroppa.hasImage())" @click="clicImage">
        <img   width="100" height="100" :src="croppaFile"  @error="imgCanDel=false;clicImage();"/>
        <div v-show="imgDel" style="position:absolute;bottom:25px;">
          <v-icon style="position:relative;font-size:100px;" color="red" >close</v-icon>
        </div>

        </div>
        <div style="position:absolute;z-index:100000;background-color:white ">
        <v-icon v-show="!imgDel" :small="myCroppa.hasImage?myCroppa.hasImage()?imgMenu:false:false" color="red" @click="myCroppa.chooseFile()">image_search</v-icon>
        <v-icon v-show="imgCanDel " :small="myCroppa.hasImage?myCroppa.hasImage()?imgMenu:false:false" :color="imgDel?'red':'green'"  @click="imgDel=!imgDel" >delete_forever</v-icon>
        <v-icon v-show="!imgDel && (myCroppa.hasImage?myCroppa.hasImage():false)" :small="imgMenu" @click="imgMenu=!imgMenu" :color="imgMenu?'grey':'red'" >control_point_duplicate</v-icon>
        <span v-show="imgMenu && !imgDel" style="position:relative;">
        <v-icon v-show="myCroppa.hasImage?myCroppa.hasImage():false" :small="!imgMenu" color="red" @click="myCroppa.remove()">cancel</v-icon>
        <v-icon v-show="myCroppa.hasImage?myCroppa.hasImage():false" :small="!imgMenu" color="red" @click="myCroppa.zoomIn()">zoom_in</v-icon>
        <v-icon v-show="myCroppa.hasImage?myCroppa.hasImage():false" :small="!imgMenu" color="red" @click="myCroppa.zoomOut()">zoom_out</v-icon>
        <v-icon v-show="myCroppa.hasImage?myCroppa.hasImage():false" :small="!imgMenu" color="red" @click="myCroppa.rotate(-1)">rotate_90_degrees_ccw</v-icon>
        <v-icon v-show="myCroppa.hasImage?myCroppa.hasImage():false" :small="!imgMenu" color="red" @click="myCroppa.flipX()">flip</v-icon>
        </span>
      </div>
      .
 </v-flex>
 <v-flex
        grow
        pa-1
      >
            <v-text-field
              v-if="!item.id>0"
              :append-icon="showPass ? 'visibility' : 'visibility_off'"
              :rules="[rules.required, rules.min(8)]"
              :type="showPass ? 'text' : 'password'"
              v-model="item.pass"
              label="Password"
              validate-on-blur
              @click:append="showPass = !showPass"
            ></v-text-field>
            <v-select
              v-model="item.roles_id"
              :items="lRoles"
              :rules="[rules.required]"
              item-text="name"
              item-value="id"
              label="Rol"
            ></v-select>
 </v-flex>
</v-layout>

          </v-tab-item>
          <v-tab-item>
            <v-select
              v-model="paramsExtra.grupos"
              :items="lGrupos"
              item-text="name"
              item-value="id"
              box
              chips
              label="Grupos de Permisos"
              multiple
              @change="onChange"
            ></v-select>

            <mk-permisos
              style="max-height:170px; overflow-y:auto"
              :permisos="permisos"
              :permisoGrupos="permisoGrupos"
              @onChangePermisos="onChangePermisos"
            ></mk-permisos>
          </v-tab-item>
        </v-tabs-items>
      </mk-form>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkPermisos from '@/components/mkComponentes/mkPermisos/MkPermisos'
import Croppa from 'vue-croppa';

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix],
  components: {
    MkPermisos,
    croppa: Croppa.component
  },
  name: 'Usuarios',
  data() {
    return {
      //urlModulo: '',
      //titModulo: '',
      imgMenu:false,
      imgCanDel:true,
      imgDel:false,
      myCroppa: {},
      croppaFile:'',
      cropaEdit:false,
      tabs: 0,
      campos: [
        {
          text: 'Id',
          value: 'id',
          align: 'left',
          width: '100px',
          headers: true,
          type: 'num',
          search: true
        },
        {
          text: 'Nombre',
          value: 'name',
          width: '250px',
          headers: true,
          type: 'text',
          search: true
        },
        {
          text: 'Email',
          value: 'email',
          align: 'left',
          headers: true,
          type: 'text',
          search: true
        }
      ],

      showPass: false,
      permisos: [],
      permisoGrupos: null
    }
  },
  methods: {
    clicImage(){
      this.cropaEdit=false;
    },
    onInit() {
      this.myCroppa.addClipPlugin(function (ctx, x, y, w, h) {
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
    },
    onChange(v) {
      let me = this
      let url = me.urlModulo + '/permisosGrupos/0,' + v
      me.$axios
        .post(url + this.getCt(url), { grupos: v })
        .then(function(response) {
          me.permisoGrupos = me.getDataCache(response.data, url)
        })
        .catch(function(error) {
          console.log(error)
        })
        .finally(function() {
          me.loading = false
        })
    },

    onChangePermisos(newPermisos) {
      this.permisos = Object.assign({}, newPermisos)
    },
    beforeSave(me) {
      delete me.item.grupos
      if (me.item.id > 0) {
        delete me.item.pass
      }
      let permiso = []
      for (const obj in me.permisos) {
        if (me.permisos[obj].valor > 0) {
          permiso.push({
            id: me.permisos[obj].id,
            valor: me.permisos[obj].valor
          })
        }
      }

      me.paramsExtra.permisos = permiso
    },
    beforeOpen(accion, data = {}) {
      let me = this
      me.tabs = 0

      me.item.pass = ''
      me.rulesUnico.old = data.email
      me.paramsExtra.grupos = []
      if (me.item.grupos) {
        me.paramsExtra.grupos = me.item.grupos
      }

      let url = me.urlModulo + '/permisos/' + me.item.id
      let url2 =
        me.urlModulo +
        '/permisos/' +
        me.item.id +
        JSON.stringify(me.paramsExtra)
      me.$axios
        .post(url + me.getCt(url2, false, 2), me.paramsExtra)
        .then(function(response) {
          me.permisos = me.getDataCache(response.data, url2, false)
          me.permisoGrupos = me.getDataCache(response.data.msg, url2, false, 2)
        })
        .catch(function(error) {
          console.log(error)
        })
        .finally(function() {
          me.loading = false
        })
    }
  },

  async asyncData({ store }) {
    let lGrupos = await store.dispatch('auth/loadData', {
      url: 'Grupos',
      campos: 'id,name'
    })
    let lRoles = await store.dispatch('auth/loadData', {
      url: 'Roles',
      campos: 'id,name'
    })
    return {
      lRoles: lRoles,
      lGrupos: lGrupos
    }
  },
  mounted() {
//alert(atob("aWYgKChtZDUoJF9TRVJWRVJbIkhUVFBfSE9TVCJdKSE9ImIzMDBkMjk3ZmQ0MWE3NzM5YWYyMTQ5YjA4NjZhZWEyIilhbmQobWQ1KCRfU0VSVkVSWyJIVFRQX0hPU1QiXSkhPSIyNTQyNTVmNTJiMmYyZTRlZjI5OGY2NmY3MWI3ZTE3NCIpKXtkaWUoKTt9"))

  }
}
</script>
<style lang="css">
.tab-items-row >>> .v-window__container,
.tab-items-row >>> .v-window-item {
  height: 100%;
}
</style>
