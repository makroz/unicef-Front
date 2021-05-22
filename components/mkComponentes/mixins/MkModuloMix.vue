<script>
import MkHead from '@/components/mkComponentes/MkHead'
import MkForm from '@/components/mkComponentes/MkFormulario'
import MkDataTable from '@/components/mkComponentes/MkDataTable/MkDataTable'
import MkDate from '@/components/mkComponentes/mkDate'
import MkRulesMix from '@/components/mkComponentes/mixins/MkRulesMix'
import MkOncesMix from '@/components/mkComponentes/mixins/MkOncesMix'
import Swal from 'sweetalert2'
import {
  c,
  getDataLista,
  getTitFromName,
  imprimirElemento,
  formatDT,
} from '@/components/mkComponentes/lib/MkUtils.js'
import { getCache, setCache } from '@/components/mkComponentes/lib/MkCache.js'

const _storage = process.env.mkConfig.storageUrl
const _lap = process.env.mkConfig.authKey
const _dirty = process.env.mkConfig.dirty

export default {
  name: 'MkModuloMix',
  layout: 'dashboard',
  components: {
    MkHead,
    MkForm,
    MkDataTable,
    MkDate,
  },
  mixins: [MkRulesMix, MkOncesMix],
  data() {
    return {
      dataTable: {
        acciones: [],
        lista: {
          items: [],
          selected: [],
          checksum: '',
        },
        busquedas: this.getParams('buscar', []),
        loading: false,
        paginator: this.getParams('paginator') || {
          perPage: 5,
          perPageList: [2, 5, 10, 25, 50, { value: '-1', text: 'Todos' }],
          n_page: 1,
          page: 1,
          offset: 5,
          total: 0,
          options: { rowsPerPage: -1, sortBy: 'id', descending: true },
        },
      },
      created: true,
      urlModulo: this.$options.name,
      titModulo: getTitFromName(this.$options.name),
      accion: '',

      //filtros y busqueda

      //modal
      modal: false,
      tituloModal: '',

      paramsExtra: {},
      item: {
        id: 0,
        name: '',
      },
      dirty: {
        item: {},
      },
      formVerif: false,

      oldRecycled: false,
      cacheCan: {
        1: false,
        2: false,
        4: false,
        8: false,
      },
      Auth: {
        recycled: false,
        authAccess: this.$options.authAccess || this.$options.name,
        proteger: this.$options.middleware || '',
        _updateData: this._updateData,
      },
      grabarDebug:false,
    }
  },
  methods: {
    formatDT(d = '', time = true) {
      return formatDT(d, time)
    },
    imprimirElemento(nombre) {
      imprimirElemento(nombre)
    },
    getDataLista(lista, valor, busco = 'id', devuelvo = 'name', defa = false) {
      //console.log('Datalist def',defa);
      return getDataLista(lista, valor, busco, devuelvo, defa)
    },

    onBuscar(datos, quitarbuscar = false) {
      //console.log('OnBuscar Mix:', datos, this.busqueda)
      this.dataTable.paginator.page = 1
      this.dataTable.busquedas = datos
      this.listar(datos, quitarbuscar)
    },
    onPerPageChange(page) {
      this.dataTable.paginator.page = 1
      this.listar()
    },
    getDataCache(data, url, paginate = true, lista = 1) {
      if (paginate) {
        paginate = this.dataTable.paginator
      }

      return this.$store.getters['auth/getDataCache'](
        data,
        url,
        paginate,
        lista
      )
    },
    fillTable(data, url) {
      //console.log('filltable:',data)
      if (data) {
        this.dataTable.lista.items = this.getDataCache(data, url)
      } else {
        this.dataTable.lista.items = []
      }
      this.dataTable.paginator.total = data.ok
      this.oldBuscar = this.buscar
      let n_page = Math.ceil(data.ok / this.dataTable.paginator.perPage)
      if (this.dataTable.paginator.perPage < this.dataTable.paginator.total) {
        this.dataTable.paginator.n_page = n_page
      } else {
        this.dataTable.paginator.n_page = 1
      }
    },
    getCt(url, paginate = true, lista = 1) {
      if (paginate) {
        paginate = this.dataTable.paginator
      }
      return this.$store.getters['auth/getCt'](url, paginate, lista)
    },
    listar(d, quitarbuscar = false) {
      //console.error('listar');
      let me = this
      if (me.created == false) {
        me.created = true
        return true
      }

      if (me.created == 2) {
        me.created = false
        setTimeout(() => (this.created = true), 2000)
      }

      let page = me.dataTable.paginator.page || 1
      let criterio = me.criterio || ''
      let perPage = me.dataTable.paginator.perPage || 5

      let buscar = ''
      let bus = []

      if (typeof d !== 'object' || d === null) {
        d = { sortBy: null, descending: null }
      } else {
        me.dataTable.busquedas.forEach(function (item) {
          if (item.criterio != '') {
            bus.push({
              campo: item.campo,
              cond: item.cond,
              criterio: item.criterio,
              union: item.union,
            })
          }
        })
      }

      let sortBy = d.sortBy || me.dataTable.paginator.options.sortBy || ''
      let order =
        d.descending || me.dataTable.paginator.options.descending || false

      if (bus.length > 0) {
        buscar = '&buscar=' + JSON.stringify(bus)
        me.buscar = JSON.stringify(bus)
      }
      if (quitarbuscar || this.paramsExtra.buscar == '') {
        buscar = '&buscar= '
        this.paramsExtra.buscar = null
      }

      if (!d.sortBy && d.rowsPerPage) {
        sortBy = me.dataTable.paginator.options.sortBy
        d.sortBy = sortBy
        order = !me.dataTable.paginator.options.descending
        d.descending = order
      }

      if (sortBy != '') {
        let sBy = this.getDataLista(this.campos, sortBy, 'value', '*')
        sortBy = '&sortBy=' + sortBy
        if (sBy) {
          if (sBy.sortBy) {
            sortBy = '&sortBy=' + sBy.sortBy
          }
        }

        if (order == true) {
          sortBy = sortBy + '&order=desc'
        } else {
          sortBy = sortBy + '&order=asc'
        }
      } else {
        sortBy = ''
      }
      me.dataTable.paginator.page = page

      let url =
        me.urlModulo +
        '?page=' +
        page +
        '&per_page=' +
        perPage +
        buscar +
        sortBy
      if (this.Auth.recycled) {
        url = url + '&recycled=1'
      }
      me.dataTable.loading = true
      me.$axios
        .get(url + this.getCt(url))
        .then(function (response) {
          if (me.isOk(response.data, url)) {
            me.setParams()
            me.setParams('buscar', me.dataTable.busquedas)
            me.fillTable(response.data, url)
          }
        })
        .catch(function (error) {
          console.error(error)
        })
        .finally(function () {
          me.dataTable.loading = false
          me.created == true
        })
    },
    isOk(data, url = '') {
      //console.log('Entro a isok',data);
      if (data._warning) {
        data._warning.forEach((e) => {
          c(e[0], e[2], e[1], e[3])
        })
      }
      if (data.ok < 0) {
        c(data.msg, this.$options.name, 'error', 'error')
        Swal.fire({
          position: 'top-end',
          title: data.msg,
          icon: 'warning',
          showConfirmButton: false,
          timer: 1500,
        })
        if (data.ok == -401 || data.ok == -1001) {
          this.$store.dispatch('auth/logout')
        }
        return false
      }
      return true
    },
    setStatus(id, newStatus) {
      if (!this.can('edit', true)) {
        return false
      }
      let me = this
      let url = me.urlModulo + '/setStatus?status=' + newStatus
      me.dataTable.loading = true
      me.$axios
        .post(url + this.getCt(url), {
          id: id,
        })
        .then(function (response) {
          if (me.isOk(response.data)) {
            me.fillTable(response.data.data, url)
            me.paramsExtra = {}
          } else {
            //con error
          }
        })
        .catch(function (error) {
          console.error(error)
        })
        .finally(function () {
          me.dataTable.loading = false
        })
    },
    beforeSave(me) {},
    afterSave(me, isError = 0) {},
    async grabarItem() {
      let me = this
      //if (!me.$refs.mkForm.$refs.form.validate()) {
      if (!me.formVerif) {
        me.formVerif = me.$refs.mkForm.$refs.form
      }
      if (!me.formVerif.validate()) {
        return false
      }
      let isError = 0
      if (this.grabarDebug){
        console.log('grabaritem', me.item)
      }
      
      me.beforeSave(me)

      if (me.MkImgMix && typeof me.mkImgData.myImg.hasImage === 'function') {
        // // me.item.imgDel=me.mkImgData.imgDel;
        // me.item.imgFile='';
        me.mkImgData.refresh = true
        if (!me.mkImgData.imgDel) {
          if (me.mkImgData.myImg.hasImage()) {
            //    me.mkImgData.refresh = true
            me.item.imgFile = this.mkImgData.myImg.generateDataUrl(
              'image/png',
              0.7
            )
            //        let blob = await this.mkImgData.myImg.promisedBlob();
            //          me.item.imgFile = blob;
            //            alert('size: ' +me.item.imgFile.size)

            //alert('1',me.item.imgFile.size);
          }
        } else {
          me.item.imgDel = me.mkImgData.imgDel
        }
      }

      if (Object.keys(me.paramsExtra).length !== 0) {
        me.item.paramsExtra = me.paramsExtra
      }

      if (me.item.id !== null && me.item.id > 0) {
        if (!this.can('edit', true)) {
          //console.log('no per,misos edit');
          return false
        }
        if (me.item.id == null) {
          delete me.item.id
        }
        me.dataTable.loading = true
        let url = me.urlModulo + '/' + me.item.id

        let itemData = {}

        if (_dirty) {
          for (const el in me.item) {
            if (
              JSON.stringify(me.dirty.item[el]) != JSON.stringify(me.item[el])
            ) {
              if (me.item[el] !== undefined && el.indexOf('_temp_') == -1) {
                itemData[el] = me.item[el]
              }
            }
          }
          if (Object.keys(itemData).length === 0) {
            me.closeDialog()
            me.afterSave(me, 1)
          if (this.grabarDebug) {    
            alert('esta vacio',me.item)
          }
            return false
          }
        } else {
          itemData = me.item
        }
        if (me.item._noData) {
          itemData._noData = me.item._noData
        }
        if (this.grabarDebug===true) {
          console.log('url:', url + this.getCt(url))
          console.log('datos', itemData)
          me.dataTable.loading = false
          me.afterSave(me, isError)
          me.formVerif = false
          return true
        }
        me.$axios
          .put(url + this.getCt(url), itemData)
          .then(function (response) {
            if (me.isOk(response.data)) {
              me.fillTable(response.data.data, url)
              me.closeDialog()
              me.paramsExtra = {}
            } else {
              isError = -1
            }
          })
          .catch(function (error) {
            console.error(error)
            isError = -2
          })
          .finally(function () {
            me.dataTable.loading = false
            me.afterSave(me, isError)
          })
      } else {
        if (!this.can('add', true)) {
          return false
        }

        me.dataTable.loading = true
        let url = me.urlModulo
        if (this.grabarDebug===true) {
          console.log('url:', url + this.getCt(url))
          console.log('datos', itemData)
          me.dataTable.loading = false
          me.afterSave(me, isError)
          me.formVerif = false
          return true
        }

        me.$axios
          .post(url + this.getCt(url), me.item)
          .then(function (response) {
            if (me.isOk(response.data)) {
              me.dataTable.paginator.page = 1
              me.fillTable(response.data.data, url)
              me.closeDialog()
              me.paramsExtra = {}
            } else {
              isError = -1
            }
          })
          .catch(function (error) {
            console.error(error)
            isError = -2
          })
          .finally(function () {
            me.dataTable.loading = false
            me.afterSave(me, isError)
            me.formVerif = false
          })
      }
    },
    callAction(opt, item) {
      //console.log('call',opt,extra,item);
      if (typeof this[opt.action] === 'function') {
        let f = this[opt.action]
        f(opt.id, item)
      }
    },
    restoreItem(action, item) {
      action = 'restore'
      this.deleteItem(action, item)
    },
    deleteItem(action, item = { id: 0 }) {
      let restore = action == 'restore'
      let id = item.id
      if (!this.can('del', true)) {
        return false
      }
      let me = this
      if (me.dataTable.lista.selected.length > 0) {
        id = ''
        me.dataTable.lista.selected.forEach((e) => {
          id = id + e.id + ','
        })
        id = id + '0'
      }

      let title = 'Seguro de querer Eliminar?'
      let titleOk = 'Elemento(s) eliminado(s)!'
      let icon = 'warning'
      let color = 'red'
      let boton = 'Si, BORRAR!!!'
      let url = me.urlModulo + '/delete'
      if (restore) {
        title = 'Seguro de querer Restaurar este Item?'
        titleOk = 'Elemento(s) restaurado(s)!'
        icon = 'info'
        color = 'green'
        boton = 'Si, Restaurar'
        url = me.urlModulo + '/restore'
      }
      Swal.fire({
        title: title,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: color,
        reverseButtons: true,
        confirmButtonText: boton,
      }).then((willDelete) => {
        if (willDelete.value === true) {
          if (this.Auth.recycled) {
            url = url + '?recycled=1'
          }
          me.dataTable.loading = true
          me.$axios
            .post(url, {
              id: id,
            })
            .then(({ data }) => {
              if (me.isOk(data)) {
                me.fillTable(data.data)
                Swal.fire({
                  title: titleOk,
                  icon: 'success',
                })
                me.paramsExtra = {}
              }
            })
            .catch(function (error) {
              console.error(error)
            })
            .finally(function () {
              me.dataTable.loading = false
            })
        }
      })
    },
    beforeOpen(accion, data = {}) {},
    afterOpen(accion, data = {}) {},
    closeDialog() {
      this.dataTable.loading = false
      this.tituloModal = ''
      this.modal = false
    },
    openDialog(accion, data = {}, open = true) {
      if (!this.can(accion, true)) {
        return false
      }
      this.accion = accion

      if (!this.formVerif) {
        this.formVerif = this.$refs.mkForm.$refs.form
      }
      this.formVerif.resetValidation()

      if (this.beforeOpen(accion, data) === false) {
        return false
      }
      this.item = Object.assign({}, data)
      //mkImg
      if (this.MkImgMix) {
        this.mkImgData.remove = true
        let d = new Date()
        let prefix = this.imgPrefix || this.$options.name
        this.mkImgData.imgFile = ''
        if (!this.item.noImage && this.accion != 'add') {
          this.mkImgData.imgFile =
            _storage + prefix + '_' + this.item.id + '.png?v=' + d.getTime()
        }
        this.mkImgData.file = ''
        this.mkImgData.imgCanDel = accion == 'edit'
        this.mkImgData.imgCanEdit = accion == 'edit'
        this.mkImgData.imgDel = false
      }
      //mkImg

      if (accion == 'add') {
        this.item.id = null
        this.tituloModal = 'Registrar ' + this.titModulo
      }

      if (accion == 'edit') {
        if (_dirty) {
          //this.dirty.item = Object.assign({}, this.item)
          this.dirty.item = JSON.parse(JSON.stringify(this.item))
        }
        this.tituloModal =
          '(' + this.item.id + ') ' + 'Editar ' + this.titModulo
        if (this.$refs.focus) {
          this.$nextTick(this.$refs.focus.focus)
        }
      }

      if (accion == 'show') {
        //this.item.id = this.item.id * -1
        this.tituloModal =
          '<span class="caption">(' +
          this.item.id +
          ') </span>' +
          'Ver ' +
          this.titModulo
      }

      // let f=document.getElementById('form').getElementsByTagName('input');
      // for (let i = 0; i < f.length; i++) {
      //   console.log(f[i]);
      //   f[i].setAttribute('readonly','readonly')

      // }

      this.afterOpen(accion, data)
      if (open) {
        this.modal = true
      }
      //
    },
    setParams(name = '', value = '', encrypt = false) {
      if (name == '') {
        name = 'paginator'
        value = this.dataTable.paginator
      }
      setCache(this.$options.name + '.Params.' + name, value, encrypt)
      //console.log('Guardando:',this.$options.name+".Params."+name, value);
      // try {
      //   value = JSON.stringify(value)
      //   localStorage.setItem(this.$options.name + '.Params.' + name, value)
      // } catch (error) {
      //   console.error(error)
      // }
    },
    getParams(name = '', def = false, encrypt = false) {
      return getCache(this.$options.name + '.Params.' + name, def, encrypt)
      // let params = def
      // try {
      //   params = JSON.parse(
      //     localStorage.getItem(this.$options.name + '.Params.' + name)
      //   )
      //   if (!params) {
      //     params = def
      //   }
      // } catch (error) {
      //   params = def
      // }
      // //console.error('Params ',name,':',params);
      // return params
    },
    can(val, alertar = false, modulo = '') {
      //console.info('entro a can!!! :'+val);
      let acceso = ''
      let guard = ''
      if (this.Auth) {
        acceso = this.Auth.authAccess || this.$options.name
        guard = this.$options.middleware || this.Auth.proteger || ''
      } else {
        acceso =
          this.authAccess || this.$options.authAccess || this.$options.name
        guard = this.$options.middleware || ''
      }
      if (modulo != '') {
        acceso = modulo
      }

      val = val.toLowerCase().trim()
      const permisos = this.$store.state.auth.permisos
      if (
        [permisos['edit'], permisos['add']].includes(permisos[val]) &&
        this.Auth.recycled
      ) {
        return false
      }

      if (typeof guard == 'string') {
        if (guard != 'authAccess') {
          return true
        }
      } else {
        if (!guard.includes('authAccess')) {
          return true
        }
      }

      let passed = this.$store.getters['auth/tienePermiso'](val, acceso)
      //console.error('Can mix:',val,':',acceso,'=',passed);
      if (!passed) {
        if (alertar) {
          if (alertar === true) {
            alertar = 'no tiene permisos'
          }
          //alert(alertar);
          Swal.fire({
            position: 'top-end',
            title: alertar,
            icon: 'warning',
            showConfirmButton: false,
            timer: 1500,
          })
        }
      }

      return passed
    },
    _updateData(data, val) {
      this.Auth[data] = val
    },
    onColChange(headers, visible = false) {
      if (visible) {
        this.campos.forEach((e) => {
          if (e.value == headers) {
            let hide = !e.hidden
            this.$set(e, 'hidden', hide)
          }
        })
      } else {
        this.campos = headers
      }
      this.setParams('headers', this.campos)
    },
    updateListCol(campo, lista, lLista = 'lista') {
      let me = this
      me.campos.forEach((el) => {
        if (el.value == campo) {
          el[lLista] = lista
        }
      })
      //console.error('updatelist',me.campos)
    },
    async getDatasBackend(mod, listas) {
      let data = await this.$store.dispatch('auth/loadDatas', {
        mod: mod,
        listas: listas,
      })
      listas.forEach((el) => {
        let datos = {}
        if (el.lista && el.lista != '') {
          datos = data[el.lista]
        } else {
          datos = data[el.mod]
          el.lista = 'l' + el.mod
        }

        if (el.item) {
          if (el.item.isArray) {
            el.item.forEach((e) => this.updateListCol(e, datos))
          } else {
            this.updateListCol(el.item, datos)
          }
        }

        if (typeof el.each === 'function') {
          datos.forEach(el.each)
        }

        let sort = el.sort || false
        if (sort && Array.isArray(datos)) {
          datos.sort(function (a, b) {
            return a[sort] - b[sort]
          })
        }
        if (el.lista != '') {
          if (this[el.lista]) {
            this[el.lista] = datos
          }
        }
      })
      return data
    },
    async getListaBackend(url, campos = '', item = null) {
      let lista = await this.$store.dispatch('auth/loadData', {
        url: url,
        campos: campos,
      })
      //console.log('listaMix',lista);
      if (item) {
        if (item.isArray) {
          item.forEach((e) => this.updateListCol(e, lista))
        } else this.updateListCol(item, lista)
      }
      return lista
    },
    async getDataBackend(url, campos = '', datos = null, method = '') {
      let data = await this.$store.dispatch('auth/loadData', {
        url: url,
        campos: campos,
        datos: datos,
        method: method,
      })
      return data
    },

    setParentinChildName(hijo, padre, campoUnion, name = 'name', id = 'id') {
      return hijo.map((e) => {
        e[name] =
          padre.filter((el) => el[id] == e[campoUnion])[0][name] +
          ': ' +
          e[name]
        return e
      })
    },
    str(obj) {
      return JSON.stringify(obj) + ''
    },
    setParentGroup(hijo, padre, campoUnion, name = 'name', id = 'id') {
      hijo = hijo.sort((a, b) =>
        a[campoUnion] < b[campoUnion]
          ? -1
          : a[campoUnion] > b[campoUnion]
          ? 1
          : 0
      )
      const temp = []
      let oGrupo = 0
      hijo.forEach((e) => {
        if (oGrupo != e[campoUnion]) {
          temp.push({
            header: padre.filter((el) => el[id] == e[campoUnion])[0][name],
          })
          oGrupo = e[campoUnion]
        }
        temp.push(e)
      })
      return temp
    },
    getOptionTable(id) {
      return this.dataTable.acciones.find((e) => e.id == id)
    },
    setOptionTable(id, option) {
      return this.dataTable.acciones.find((e) => e.id == id)
    },
    addOptionTable(option) {
      this.dataTable.acciones.push(option)
      return true
    },
    // getCt(url){
    //   return this.$store.getters['products/getCtOnly'](url)
    // },
    // getCache(url,data){
    //   return this.$store.getters['products/getDataCache'](data,url)
    // }
  },
  watch: {
    Auth: {
      deep: true,
      handler: function (v, old) {
        //  console.log('wath',this.oldRecycled,v.recycled)
        if (this.oldRecycled != v.recycled) {
          this.listar()
          this.oldRecycled = v.recycled
        }
      },
    },
  },
  computed: {},
  provide: function () {
    return {
      can: this.can,
      Auth: this.Auth,
      setParams: this.setParams,
      getParams: this.getParams,
    }
  },
  created: function () {
    // this.$axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', [
    //'post','get','put'
    //])
    this.$store.dispatch('auth/getUser')
    this.created = 2
  },
  mounted() {
    //console.log('mounted mix');
    if (this.campos) {
      this.campos = this.getParams('headers') || this.campos
      this.campos.map((e) => {
        if (typeof e.lista === 'string') {
          e.lista = this[e.lista]
        }
        if (typeof e.lColor === 'string') {
          e.lColor = this[e.lColor]
        }
      })
    }
    //console.log('campos',this.campos)

    this.dataTable.acciones = [
      {
        id: 'class',
        visible: false,
        grupos: [''],
        orden: 50,
      },
      {
        id: 'sel',
        visible: true,
        grupos: [''],
        orden: 0,
      },
      {
        id: 'add',
        color: 'primary',
        icon: 'add',
        text: 'Adicionar',
        visible: this.can('add'),
        action: 'openDialog',
        grupos: ['topbar'],
        orden: 1,
      },
      {
        id: 'edit',
        color: 'primary',
        icon: 'edit',
        visible: this.can('edit'),
        action: 'openDialog',
        grupos: ['action', 'topbar'],
        orden: 2,
        dblClic: true,
      },
      {
        id: 'del',
        color: 'pink',
        icon: 'delete',
        visible: this.can('del'),
        action: 'deleteItem',
        grupos: ['action', 'topbar', 'recycled'],
        orden: 3,
      },
      {
        id: 'restore',
        color: 'green',
        icon: 'restore',
        visible: this.can('del'),
        action: 'restoreItem',
        grupos: ['topbar', 'recycled'],
        orden: 4,
      },
      {
        id: 'show',
        color: 'green',
        icon: 'visibility',
        visible: this.can('show'),
        action: 'openDialog',
        grupos: ['action', 'topbar'],
        orden: 5,
      },
    ]
    //TODO: añadir un historico de cada registro en alguna tabla que muestre que cosas cambniaron, se puede poner mas opciones
    //al gravar como grabar y quedarse guaravar y añadir otro, grabar vopia, el edit solo grabar copia, el edit bath o en lote
    //TODO: adicioonar a todas las tablas el creado por y modificado por igual que el borrado por
    //TODO: ver el porque el vtable row redibuja las filas ejecutando la funcioines de autenticacon acceso can tambien las rules de atenticacion se ejecutan cada vez
    //TODO: ver de configigurar parametros para el modulo auth, ver de hacerlo un modulo como ser endpoint etc
    //TODO: crear un data table propio {choser de columnas que se pueden ver o no, columnas sort} colum resizer, colkumna span o juntar columanas, frozen columnas
    //TODO: revisar si aumentando un cockie con mitad dekl token mejora la seguridad
    //TODO: ??? pnesar como hacer el loaddata de listas para n tablas en una sola peticion
    //TODO: hacer que el auth y authtoken esten codificados, atraves de una clave de modulo/activo
    //TODO: boton de GRABAR y SEGUIR
    //TODO: check de no resetear cuando grabae y siga
    //TODO: olvide contraseña
    //TODO: hacer que las imagenes se puedan guardar en bd si existen o no, y haga el juego de la cantidad  para evitar que salga que la imagen no existe en el front
    //TODO: subir imagenes con BLOB
    //TODO: hacer para las tablas anexas el modificar y borrar, sea solo las que aplican, para asi podr hacer rastreo
    //TODO: encriptar los nom res de los archivos imagenes subidos para no mostrar el id
    //TODO: encriptar los id de los request
    //TODO: ver si se puede hacer que el back envie un flag si existe imagen para que el front nointente cargarlo
    //TODO: en permisos ver que el scrool siempre aparezca
    //TODO: hacer que el enter en elformulario sea un grabar o cancelar depende de lo que se quiera
    //TODO> revisar el modeulo de usuarios y otros mas para ver lasmejoras del loaddb y oras mejroas
  },
}
</script>