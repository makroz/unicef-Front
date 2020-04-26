<script>
import MkHead from "@/components/mkComponentes/MkHead";
import MkForm from "@/components/mkComponentes/MkFormulario";
import MkTableHead from "@/components/mkComponentes/MkTableHead";
import MkTableRow from "@/components/mkComponentes/MkTableRow";
import MkPaginator from "@/components/mkComponentes/MkPaginator";
import MkRulesMix from '@/components/mkComponentes/mixins/MkRulesMix'
import {c} from "@/components/mkComponentes/MkUtils.js";
import Swal from "sweetalert2";
import { isNull, log } from "util";
export default {
  name: "MkModuloMix",
  components: {
    MkHead,
    MkForm,
    MkTableHead,
    MkTableRow,
    MkPaginator
  },
 mixins: [MkRulesMix],
  data() {
    return {
      headers:this.getParams('headers')||this.headersC,
      created:true,
      urlModulo: this.$options.name,
      titModulo: this.$options.name,
      paginator: this.getParams('paginator') || {
        perPage: 5,
        perPageList: [2, 5, 10, 25, 50, { value: "-1", text: "Todos" }],
        n_page: 1,
        page: 1,
        offset: 5,
        total: 0,
        options: { rowsPerPage: -1, sortBy: "id", descending: true }
      },
      //filtros y busqueda
      busquedas: [],
      //modal
      modal: false,
      tituloModal: "",
      loading: false,
      paramsExtra: {},
      item: {
        id: 0,
        name: ""
      },
      lista: {
        items: [],
        selected: []
      },
      cacheCan:{
        '1':false,
        '2':false,
        '4':false,
        '8':false
      },
      Auth:{
        recycled:false,
        authAccess: this.$options.authAccess||this.$options.name,
        proteger:this.$options.middleware||'',
        _updateData:this._updateData,
      },
    };
  },
  methods: {
    toggleAll () {
        if (this.lista.selected.length) this.lista.selected = []
        else this.lista.selected = this.lista.items.slice()
      },
      changeSort (column,sortable=false) {
        if (!sortable){ return false;}
        if (this.paginator.options.sortBy === column) {
          this.paginator.options.descending = !this.paginator.options.descending
        } else {
          this.paginator.options.sortBy = column
          this.paginator.options.descending = false
        }
        this.listar();

      },
    onBuscar(datos, quitarbuscar = false) {
      this.paginator.page = 1;
      this.busquedas = datos;
      this.listar(datos, quitarbuscar);
    },
    onPerPageChange(page) {
      this.paginator.page = 1;
      this.listar();
    },
    fillTable(data) {
      this.lista.items = data.data;
      this.paginator.total = data.ok;
      this.oldBuscar = this.buscar;
      let n_page = Math.round(data.ok / this.paginator.perPage);
      if (this.paginator.perPage < this.paginator.total) {
        this.paginator.n_page = n_page;
      } else {
        this.paginator.n_page = 1;
      }
    },
    listar(d, quitarbuscar = false) {
      let me = this;
      if (me.created==false){
          me.created=true;
          return true;
      }

      if (me.created==2){
          me.created=false;
          setTimeout(() => this.created=true, 2000);
      }


      me.loading = true;
      let page = me.paginator.page || 1;
      let criterio = me.criterio || "";
      let perPage = me.paginator.perPage || 5;

      let buscar = "";
      let bus = [];

      if (typeof d !== "object" || isNull(d)) {
        d = { sortBy: null, descending: null };
      } else {
        this.busquedas.forEach(function(item) {
          if (item.criterio != "") {
            bus.push({
              campo: item.campo,
              cond: item.cond,
              criterio: item.criterio,
              union: item.union
            });
          }
        });
      }

      let sortBy = d.sortBy || me.paginator.options.sortBy || "";
      let order = d.descending || me.paginator.options.descending || false;

      if (bus.length > 0) {
        buscar = "&buscar=" + JSON.stringify(bus);
        me.buscar = JSON.stringify(bus);
      }
      if (quitarbuscar || this.paramsExtra.buscar == "") {
        buscar = "&buscar= ";
        this.paramsExtra.buscar = null;
      }

      if (!d.sortBy && d.rowsPerPage) {
        sortBy = me.paginator.options.sortBy;
        d.sortBy = sortBy;
        order = !me.paginator.options.descending;
        d.descending = order;
      }

      if (sortBy != "") {
        sortBy = "&sortBy=" + sortBy;
        if (order == true) {
          sortBy = sortBy + "&order=desc";
        } else {
          sortBy = sortBy + "&order=asc";
        }
      } else {
        sortBy = "";
      }
      me.paginator.page = page;

      let url =
        me.urlModulo +
        "?page=" +
        page +
        "&per_page=" +
        perPage +
        buscar +
        sortBy;
        if (this.Auth.recycled){
          url=url+'&recycled=1';
        }
      me.$axios
        .get(url)
        .then(function(response) {
          if (me.isOk(response.data)) {
          me.setParams();
          me.fillTable(response.data);
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          me.loading = false;
          me.created==true;
        });
    },
    isOk(data) {
      if (data._warning){
        data._warning.forEach(e => {
          c(e[0],e[2],e[1],e[3]);
        });

      }
      if (data.ok < 0) {
        console.error(data.msg);
          Swal.fire({
            position: 'top-end',
            title: data.msg,
            icon:'warning',
            showConfirmButton: false,
            timer: 1500
          })
        if (data.ok==-1001){
          this.$store.dispatch('auth/logout');
        }
        return false;
      }
      return true;
    },
    setStatus(id, newStatus) {
      if (!this.can('edit',true)){return false;}
      let me = this;
      me.$axios
        .post(me.urlModulo + "/setStatus", {
          status: newStatus,
          id: id
        })
        .then(function(response) {
          if (me.isOk(response.data)) {
            me.fillTable(response.data.data);
            me.paramsExtra = {};
          } else {
            //con error
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    beforeSave(me) {},
    afterSave(me, isError = 0) {},
    grabarItem() {
      let me = this;
      if (!me.$refs.mkForm.$refs.form.validate()) {
        return false;
      }
      let isError = 0;
      this.beforeSave(me);
      if (Object.keys(me.paramsExtra).length !== 0) {
        me.item.paramsExtra = me.paramsExtra;
      }
      if (me.item.id !== null) {
        if (!this.can('edit',true)){return false;}
        me.$axios
          .put(me.urlModulo + "/" + me.item.id, me.item)
          .then(function(response) {
            if (me.isOk(response.data)) {
              me.fillTable(response.data.data);
              me.closeDialog();
              me.paramsExtra = {};
            } else {
              isError = 1;
            }
          })
          .catch(function(error) {
            console.log(error);
            isError = 2;
          });
      } else {
        if (!this.can('add',true)){return false;}
        me.$axios
          .post(me.urlModulo, me.item)
          .then(function(response) {
            if (me.isOk(response.data)) {
              me.paginator.page = 1;
              me.fillTable(response.data.data);
              me.closeDialog();
              me.paramsExtra = {};
            } else {
              isError = 1;
            }
          })
          .catch(function(error) {
            console.log(error);
            isError = 2;
          });
        this.afterSave(me, isError);
      }
    },
    deleteItem(id,restore=false) {
      if (!this.can('del',true)){return false;}
      let me = this;
      if (me.lista.selected.length > 0) {
        id = "";
        me.lista.selected.forEach(item => {
          id = id + item.id + ",";
        });
        id = id + "0";
      }

      let title='Seguro de querer Eliminar?';
      let titleOk='Elemento(s) eliminado(s)!';
      let icon ='warning';
      let color ='red';
      let boton=  'Si, BORROR!!!';
      let url=me.urlModulo + "/delete";
      if (restore){
        title= 'Seguro de querer Restaurar este Item?';
        titleOk='Elemento(s) restaurado(s)!';
        icon ='info';
        color ='green';
        boton=  'Si, Restaurar';
        url=me.urlModulo + "/restore";
      }
      Swal.fire({
        title: title,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: color,
        reverseButtons:true,
        confirmButtonText: boton
      }).then((willDelete) => {
        //console.log('willdelete:',willDelete);
        if (willDelete.value===true) {
          //let url=me.urlModulo + "/delete";
          if (this.Auth.recycled){
          url=url+'?recycled=1';
          }
          me.$axios
            .post(url, {
              id: id
            }).then(({data}) => {
              if (me.isOk(data)) {
                me.fillTable(data.data);
                Swal.fire({
                  title: titleOk,
                  icon: "success"
                  }
                )
                me.paramsExtra = {};
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      });
    },
    beforeOpen(accion, data = {}) {},
    afterOpen(accion, data = {}) {},
    closeDialog() {
      this.tituloModal = "";
      this.modal = false;
    },
    openDialog(accion, data = {}) {
      if (!this.can(accion,true)){return false;}
      this.modal = true;
      this.item = Object.assign({}, data);
      this.$refs.mkForm.$refs.form.resetValidation();
      this.beforeOpen(accion, data);
      if (accion == "add") {
        this.item.id = null;
        this.tituloModal = "Registrar " + this.titModulo;
      } else {
        this.tituloModal = "Editar " + this.titModulo;
      }
      this.afterOpen(accion, data);
      this.$nextTick(this.$refs.focus.focus);
    },
    setParams(name='',value=''){
      if (name==''){
          name='paginator';
          value=this.paginator;
      }
      //console.log('Guardando:',this.$options.name+".Params."+name, value);
      try {
        value = JSON.stringify(value);
        localStorage.setItem(this.$options.name+".Params."+name, value);
      } catch (error) {
        console.error(error);
      }
    },

    getParams(name='',def=false){
      let params=def;
      try {
        params=JSON.parse(localStorage.getItem(this.$options.name+".Params."+name));
        if (!params){
          params=def;
        }
      } catch (error) {
        params=def;
      }
      //console.error('Params ',name,':',params);
      return params;
    },
    can(val,alertar=false) {
        //console.info('entro a can!!! :'+val);
      let acceso='';
      let guard='';
      if (this.Auth){
        acceso=this.Auth.authAccess||this.$options.name;
        guard=this.$options.middleware||this.Auth.proteger||'';
      }else{
         acceso=this.authAccess||this.$options.authAccess||this.$options.name;
         guard=this.$options.middleware||'';
      }
      val=val.toLowerCase().trim();
      const permisos=this.$store.state.auth.permisos;
      if (([permisos['edit'],permisos["add"]].includes(permisos[val]))&&(this.Auth.recycled)){
        return false;
      }

      if (typeof(guard)=='string'){
        if (guard!='authAccess'){
          return true;
        }
      }else{
        if (!guard.includes('authAccess')){
          return true;
        }
      }


      let passed=this.$store.getters["auth/tienePermiso"](val,acceso);
      //console.error('Can mix:',val,':',acceso,'=',passed);
      if (!passed){
      if (alertar){
          if (alertar===true){
            alertar='no tiene permisos';
          }
          //alert(alertar);
          Swal.fire({
            position: 'top-end',
            title: alertar,
            icon:'warning',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }

        return passed;
     },
     _updateData(data,val){
       this.Auth[data]=val;
     },
     onChangeColumns(value){
       this.headers.forEach(e => {
         if (e.value == value){
           e.visible=!e.visible
        }
       });
      this.setParams('headers',this.headers);
     },
     getHeaders: function() {
      let h=this.getParams('headers');
      if (h!==false){
        return h;
      }
      h=[];
      this.campos.forEach(el => {
        if (el.headers) {
          h.push({
            text: el.text,
            value: el.value || null,
            align: el.align || "left",
            width: el.width || null,
            sortable: el.sortable || true,
            visible: el.visible || true
          });
        }
      });

      h.push({
        text: "Estado",
        value: "status",
        align: "center",
        width: "150px",
        sortable: false,
        visible: true,
        fixed:true
      });
    if (this.can('edit')||this.can('del')){
      h.push({
        text: "Acciones",
        value: "actions",
        align: "left",
        width: "175px",
        sortable: false,
        visible: true,
        fixed:true

      });
    }
      this.setParams('headers',h);
      return h;
    },
  },
  watch: {
    Auth: {
		  deep: true,
		  handler: function (v, old)  {
      this.listar();
		}
	  }
  },
  computed: {
    headersC:function(){
      return this.getHeaders();
    },
    search_campos: function() {
      let h = [];
      this.campos.forEach(el => {
        if (el.search) {
          h.push({
            text: el.text,
            value: el.value || null,
            type: el.type || "text",
            visible:el.visible||true,
          });
        }
      });
      return h;
    },
  },
  provide: function() {
  	return {
      can: this.can,
      Auth:this.Auth,
      setParams:this.setParams,
      getParams:this.getParams
    }
  },
  created: function() {
    this.$store.dispatch('auth/getUser');
    //c("crear");
    this.paramsExtra.buscar = "";
    this.created = 2;
  },
  mounted() {
//   c("Ejecuto",this.$options.name,'mounted');
    this.headers=this.getHeaders();
    //TODO: ver el cache en las consultas del crud en el front opcion de checksum
    //TODO: ver el porque el vtable row redibuja las filas ejecutando la funcioines de autenticacon acceso can tambien las rules de atenticacion se ejecutan cada vez
    //TODO: ver de configigurar parametros para el modulo auth, ver de hacerlo un modulo como ser endpoint etc
    //TODO: crear un data table propio {choser de columnas que se pueden ver o no,} colum resizer, colkumna span o juntar columanas, frozen columnas


  }
};
</script>
