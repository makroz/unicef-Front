<script>
import MkHead from '@/components/mkComponentes/MkHead'
import MkForm from '@/components/mkComponentes/MkFormulario'
import MkDataTable from '@/components/mkComponentes/MkDataTable/MkDataTable'
import MkRulesMix from '@/components/mkComponentes/mixins/MkRulesMix'
import Swal from 'sweetalert2'
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import MD5 from 'crypto-js/md5'
import { c } from '@/components/mkComponentes/lib/MkUtils.js'


const _lap = process.env.mkAuth.key

export default {
  name: 'MkModuloMix',
  components: {
    MkHead,
    MkForm,
    MkDataTable
  },
  mixins: [MkRulesMix],
  data() {
    return {
      headers: this.getParams('headers') || this.headersC,
      created: true,
      urlModulo: this.$options.name,
      titModulo: this.$options.name,
      paginator: this.getParams('paginator') || {
        perPage: 5,
        perPageList: [2, 5, 10, 25, 50, { value: '-1', text: 'Todos' }],
        n_page: 1,
        page: 1,
        offset: 5,
        total: 0,
        options: { rowsPerPage: -1, sortBy: 'id', descending: true }
      },
      //filtros y busqueda
      busquedas: [],
      //modal
      modal: false,
      tituloModal: '',
      loading: false,
      paramsExtra: {},
      item: {
        id: 0,
        name: ''
      },
      lista: {
        items: [],
        selected: [],
        checksum: '',
        oldRecycled:false
      },
      cacheCan: {
        '1': false,
        '2': false,
        '4': false,
        '8': false
      },
      Auth: {
        recycled: false,
        authAccess: this.$options.authAccess || this.$options.name,
        proteger: this.$options.middleware || '',
        _updateData: this._updateData
      }
    }
  },
  methods: {
    onBuscar(datos, quitarbuscar = false) {
      console.log('OnBuscar Mix:', datos, this.busqueda)
      this.paginator.page = 1
      this.busquedas = datos
      this.listar(datos, quitarbuscar)
    },
    onPerPageChange(page) {
      this.paginator.page = 1
      this.listar()
    },
    getDataCache(data, url, paginate = true, lista = 1) {
      if (paginate) {
        paginate=this.paginator
      }

      return this.$store.getters['auth/getDataCache'](data,url,paginate,lista)

      // if (paginate) {
      //   url = url + JSON.stringify(this.paginator)
      // }

      // if (lista != 1) {
      //   url = url + '_' + lista
      // }
      // if (data.data == '_ct_') {
      //   c('Estos datos ya estan cacheados', this.$options.name, 'Cache')
      //   if (this.$store.state.auth.encryptActive) {
      //     data.data = JSON.parse(
      //       localStorage.getItem('cache_' + MD5(url).toString())
      //     ) //encriptado1.0
      //     //console.log(url,data.data);
      //     data.data = JSON.parse(
      //       AES.decrypt(data.data.response, _lap).toString(Utf8)
      //     ) //encriptado1.1
      //   } else {
      //     data.data = JSON.parse(localStorage.getItem('cache_' + url)).response
      //     //console.log(url,data.data);
      //   }
      // } else {
      //   let response = data.data
      //   if (this.$store.state.auth.encryptActive) {
      //     url = MD5(url).toString()
      //     response = AES.encrypt(
      //       JSON.stringify(Object.values(data.data)),
      //       _lap
      //     ).toString()
      //   }
      //   const ct = {
      //     ct: MD5(JSON.stringify(data.data)).toString(),
      //     response: response
      //   }
      //   localStorage.setItem('cache_' + url, JSON.stringify(ct))
      // }
      // return data.data
    },
    fillTable(data, url) {
      //console.log('filltable:',data)
      this.lista.items = this.getDataCache(data, url)

this.paginator.total = data.ok
      this.oldBuscar = this.buscar
      let n_page = Math.ceil(data.ok / this.paginator.perPage)
      if (this.paginator.perPage < this.paginator.total) {
        this.paginator.n_page = n_page
      } else {
        this.paginator.n_page = 1
      }
    },
    getCt(url, paginate = true, lista = 1) {
      if (paginate){
        paginate=this.paginator
      }
      return this.$store.getters['auth/getCt'](url,paginate,lista)
      // if (!this.$store.state.auth.cacheActive) {
      //   return ''
      // }
      // let ct = '_ct_='
      // let ct2 = ''
      // if (url.includes('?')) {
      //   ct = '&' + ct
      // } else {
      //   ct = '?' + ct
      // }
      // if (paginate) {
      //   url = url + JSON.stringify(this.paginator)
      // }
      // if (lista == 1) {
      //   ct2 = ''
      // }

      // try {
      //   if (this.$store.state.auth.encryptActive) {
      //     ct =
      //       ct +
      //       JSON.parse(localStorage.getItem('cache_' + MD5(url).toString())).ct
      //   } else {
      //     ct = ct + JSON.parse(localStorage.getItem('cache_' + url)).ct
      //   }
      //   if (lista != 1) {
      //     ct2 = '&_ct2_='
      //     if (this.$store.state.auth.encryptActive) {
      //       ct2 =
      //         ct2 +
      //         JSON.parse(
      //           localStorage.getItem(
      //             'cache_' + MD5(url + '_' + lista).toString()
      //           )
      //         ).ct
      //     } else {
      //       ct2 =
      //         ct2 +
      //         JSON.parse(localStorage.getItem('cache_' + url + '_' + lista)).ct
      //     }
      //   }
      // } catch (error) {
      //   ct = ''
      //   ct2 = ''
      // }
      // return ct + ct2
    },
    listar(d, quitarbuscar = false) {
      let me = this
      if (me.created == false) {
        me.created = true
        return true
      }

      if (me.created == 2) {
        me.created = false
        setTimeout(() => (this.created = true), 2000)
      }

      let page = me.paginator.page || 1
      let criterio = me.criterio || ''
      let perPage = me.paginator.perPage || 5

      let buscar = ''
      let bus = []

      if (typeof d !== 'object' || (d===null)) {
        d = { sortBy: null, descending: null }
      } else {
        this.busquedas.forEach(function(item) {
          if (item.criterio != '') {
            bus.push({
              campo: item.campo,
              cond: item.cond,
              criterio: item.criterio,
              union: item.union
            })
          }
        })
      }

      let sortBy = d.sortBy || me.paginator.options.sortBy || ''
      let order = d.descending || me.paginator.options.descending || false

      if (bus.length > 0) {
        buscar = '&buscar=' + JSON.stringify(bus)
        me.buscar = JSON.stringify(bus)
      }
      if (quitarbuscar || this.paramsExtra.buscar == '') {
        buscar = '&buscar= '
        this.paramsExtra.buscar = null
      }

      if (!d.sortBy && d.rowsPerPage) {
        sortBy = me.paginator.options.sortBy
        d.sortBy = sortBy
        order = !me.paginator.options.descending
        d.descending = order
      }

      if (sortBy != '') {
        sortBy = '&sortBy=' + sortBy
        if (order == true) {
          sortBy = sortBy + '&order=desc'
        } else {
          sortBy = sortBy + '&order=asc'
        }
      } else {
        sortBy = ''
      }
      me.paginator.page = page

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
      me.loading = true
      me.$axios
        .get(url + this.getCt(url))
        .then(function(response) {
          if (me.isOk(response.data, url)) {
            me.setParams()
            me.fillTable(response.data, url)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
        .finally(function() {
          me.loading = false
          me.created == true
        })
    },
    isOk(data, url) {
      if (data._warning) {
        data._warning.forEach((e) => {
          c(e[0], e[2], e[1], e[3])
        })
      }
      if (data.ok < 0) {
        console.error(data.msg)
        Swal.fire({
          position: 'top-end',
          title: data.msg,
          icon: 'warning',
          showConfirmButton: false,
          timer: 1500
        })
        if (data.ok == -1001) {
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
      me.loading = true
      me.$axios
        .post(url + this.getCt(url), {
          //          status: newStatus,
          id: id
        })
        .then(function(response) {
          if (me.isOk(response.data)) {
            me.fillTable(response.data.data, url)
            me.paramsExtra = {}
          } else {
            //con error
          }
        })
        .catch(function(error) {
          console.log(error)
        })
        .finally(function() {
          me.loading = false
        })
    },
    beforeSave(me) {},
    afterSave(me, isError = 0) {},
    grabarItem() {
      let me = this
      if (!me.$refs.mkForm.$refs.form.validate()) {
        return false
      }
      let isError = 0
      this.beforeSave(me)
      if (Object.keys(me.paramsExtra).length !== 0) {
        me.item.paramsExtra = me.paramsExtra
      }
      if (me.item.id !== null) {
        if (!this.can('edit', true)) {
          return false
        }
        me.loading = true
        let url = me.urlModulo + '/' + me.item.id
        me.$axios
          .put(url + this.getCt(url), me.item)
          .then(function(response) {
            if (me.isOk(response.data)) {
              me.fillTable(response.data.data, url)
              me.closeDialog()
              me.paramsExtra = {}
            } else {
              isError = 1
            }
          })
          .catch(function(error) {
            console.log(error)
            isError = 2
          })
          .finally(function() {
            me.loading = false
          })
      } else {
        if (!this.can('add', true)) {
          return false
        }

        me.loading = true
        let url = me.urlModulo

        me.$axios
          .post(url + this.getCt(url), me.item)
          .then(function(response) {
            if (me.isOk(response.data)) {
              me.paginator.page = 1
              me.fillTable(response.data.data, url)
              me.closeDialog()
              me.paramsExtra = {}
            } else {
              isError = 1
            }
          })
          .catch(function(error) {
            console.log(error)
            isError = 2
          })
          .finally(function() {
            me.loading = false
          })
        this.afterSave(me, isError)
      }
    },
    deleteItem(id, restore = false) {
      if (!this.can('del', true)) {
        return false
      }
      let me = this
      if (me.lista.selected.length > 0) {
        id = ''
        me.lista.selected.forEach((item) => {
          id = id + item.id + ','
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
        confirmButtonText: boton
      }).then((willDelete) => {
        //console.log('willdelete:',willDelete);
        if (willDelete.value === true) {
          //let url=me.urlModulo + "/delete";
          if (this.Auth.recycled) {
            url = url + '?recycled=1'
          }
          me.loading = true
          me.$axios
            .post(url, {
              id: id
            })
            .then(({ data }) => {
              if (me.isOk(data)) {
                me.fillTable(data.data)
                Swal.fire({
                  title: titleOk,
                  icon: 'success'
                })
                me.paramsExtra = {}
              }
            })
            .catch(function(error) {
              console.log(error)
            })
            .finally(function() {
              me.loading = false
            })
        }
      })
    },
    beforeOpen(accion, data = {}) {},
    afterOpen(accion, data = {}) {},
    closeDialog() {
      this.tituloModal = ''
      this.modal = false
    },
    openDialog(accion, data = {}) {
      if (!this.can(accion, true)) {
        return false
      }
      this.modal = true
      this.item = Object.assign({}, data)
      this.$refs.mkForm.$refs.form.resetValidation()
      this.beforeOpen(accion, data)
      if (accion == 'add') {
        this.item.id = null
        this.tituloModal = 'Registrar ' + this.titModulo
      } else {
        this.tituloModal = 'Editar ' + this.titModulo
      }
      this.afterOpen(accion, data)
      this.$nextTick(this.$refs.focus.focus)
    },
    setParams(name = '', value = '') {
      if (name == '') {
        name = 'paginator'
        value = this.paginator
      }
      //console.log('Guardando:',this.$options.name+".Params."+name, value);
      try {
        value = JSON.stringify(value)
        localStorage.setItem(this.$options.name + '.Params.' + name, value)
      } catch (error) {
        console.error(error)
      }
    },

    getParams(name = '', def = false) {
      let params = def
      try {
        params = JSON.parse(
          localStorage.getItem(this.$options.name + '.Params.' + name)
        )
        if (!params) {
          params = def
        }
      } catch (error) {
        params = def
      }
      //console.error('Params ',name,':',params);
      return params
    },
    can(val, alertar = false) {
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
            timer: 1500
          })
        }
      }

      return passed
    },
    _updateData(data, val) {
      this.Auth[data] = val
    },
    getHeaders:  function() {
      let me=this;
      let h = me.getParams('headers')
      if (h !== false) {
        // this.campos.forEach((el, index) => {
        //   if (el.headers) {
        //     h[index].lista = el.lista || false
        //     console.log('headers:',index,el.value,el.lista,h[index].lista)
        //   }
        // })
        return h
      }
      h = []
      me.campos.forEach((el) => {
        if (el.headers) {
          h.push({
            text: el.text,
            value: el.value || null,
            align: el.align || 'left',
            width: el.width || null,
            sortable: el.sortable || true,
            visible: el.visible || true,
            lista: el.lista || false
          })
        }
      })

      h.push({
        text: 'Status',
        value: '__st__',
        align: 'center',
        width: '50px',
        sortable: false,
        visible: true,
        fixed: true,
        noRow: true,
        lista: false
      })
      if (this.can('edit') || this.can('del')) {
        h.push({
          text: 'Acciones',
          value: '__act__',
          align: 'center',
          width: '165px',
          sortable: false,
          visible: true,
          fixed: true,
          noRow: true,
          lista: false
        })
      }
      this.setParams('headers', h)
      return h
    },
    onColChange(headers) {
      this.headers = headers
      this.setParams('headers', this.headers)
    }
  },
  watch: {
    Auth: {
      deep: true,
      handler: function(v, old) {
        if (this.listar.oldRecycled!=v.recycled){
          this.listar()
        }
      }
    }
  },
  computed: {
    headersC: function() {
      return this.getHeaders()
    },
    search_campos: function() {
      let h = []
      this.campos.forEach((el) => {
        if (el.search) {
          h.push({
            text: el.text,
            value: el.value || null,
            type: el.type || 'text',
            visible: el.visible || true
          })
        }
      })
      return h
    }
  },
  provide: function() {
    return {
      can: this.can,
      Auth: this.Auth,
      setParams: this.setParams,
      getParams: this.getParams
    }
  },
  created: function() {
    this.$store.dispatch('auth/getUser')
    //c("crear");
    //this.paramsExtra.buscar = ''
    this.created = 2
  },
  mounted() {
    //   c("Ejecuto",this.$options.name,'mounted');
    this.headers = this.getHeaders()

    // for (var key in localStorage) { //Borrar caache
    //console.log('funciones',log,isNull)
    // }
    //TODO: añadir un historico de cada registro en alguna tabla que muestre que cosas cambniaron, se puede poner mas opciones
    //al gravar como grabar y quedarse guaravar y añadir otro, grabar vopia, el edit solo grabar copia, el edit bath o en lote
    //TODO: adicioonar a todas las tablas el creado por y modificado por igual que el borrado por
    //TODO: ver el porque el vtable row redibuja las filas ejecutando la funcioines de autenticacon acceso can tambien las rules de atenticacion se ejecutan cada vez
    //TODO: ver de configigurar parametros para el modulo auth, ver de hacerlo un modulo como ser endpoint etc
    //TODO: crear un data table propio {choser de columnas que se pueden ver o no, columnas sort} colum resizer, colkumna span o juntar columanas, frozen columnas
    //TODO: revisar si aumentando un cockie con mitad dekl token mejora la seguridad
    //TODO: pnesar como hacer el loaddata de listas para n tablas en una sola peticion
    //TODO: hacer que la config de cache encrypt etc se maneje en el menu laterual derecho
    //TODO: hacer em empleados el metodo de un select que actualiza a otro select
  }
}
</script>
