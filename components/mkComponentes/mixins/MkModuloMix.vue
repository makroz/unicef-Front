<script>
import MkForm from "@/components/mkComponentes/MkFormulario";
import MkTableHead from "@/components/mkComponentes/MkTableHead";
import MkTableRow from "@/components/mkComponentes/MkTableRow";
import MkPaginator from "@/components/mkComponentes/MkPaginator";
//import MkStatus from "@/components/mkComponentes/MkStatus";
import Swal from "sweetalert2";
import { isNull, log } from "util";
export default {
  name: "MkModuloMix",
  components: {
    MkForm,
    MkTableHead,
    MkTableRow,
    MkPaginator
  },
  data() {
    return {
      created:true,
      urlModulo: this.$options.name,
      titModulo: this.$options.name,
      paginator: this.getParams() || {
        perPage: 5,
        perPageList: [2, 5, 10, 25, 50, { value: "-1", text: "Todos" }],
        n_page: 1,
        page: 1,
        offset: 5,
        total: 0,
        options: { rowsPerPage: -1, sortBy: "id", descending: true }
      },
      rules: {
        required: value => !!value || "Dato es Requerido",
        num: value => !isNaN(value) || "Debe ser un Numerico",
        min(minNum) {
          return v =>
            {
            //console.error('min',minNum);
             return (v || "").length > minNum || "Minimo " + minNum + " caracteres"
             };
        },
        max(maxNum) {
          return v =>{
            //console.error('max',maxNum);
            (v || "").length <= maxNum || "Maximo " + maxNum + " caracteres";
            }
        },
        noSpaces: v => (v || "").indexOf(" ") < 0 || "No se admite espacios",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "e-mail no válido";
        },
        unique: (campo) => {
          let me=this;
          return (v) =>
            {
              //console.error('unique',v,campo,':',me.rulesUnico.old);
            if (!v){
              return true;
            }
            if ((!me.rulesUnico.processing)&&(v!=me.rulesUnico.old)){
              //console.log('corriendo Unique:',v,'/',me.rulesUnico.old);
              me.rulesUnico.processing=true;
              try {
              me.$axios.get(me.urlModulo + '/' + me.item.id+'?existe=1&where='+campo+'&valor='+v, { where: campo, valor: v }).then(
                ({data}) => {
                    if (data.ok>0){
                      me.rulesUnico.valid= 'Ese dato ya existe';
                    }else{
                      me.rulesUnico.valid= true;
                    }
                    me.rulesUnico.old=v;
                    me.rulesUnico.processing=false;
                    me.$refs[campo].validate();
                }
              );

              } catch (error) {
                  me.rulesUnico.processing=false;
              }
            }
            return me.rulesUnico.valid;
            };
        },
      },
//      errores: [],
      //filtros y busqueda
      busquedas: [],
      //modal
      rulesUnico:{
        valid:true,
        old:'',
        processing:false
      },
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
      }

    };
  },
  methods: {
    onBuscar(datos, quitarbuscar = false) {
      //console.log("onBuscar");
      this.paginator.page = 1;
      this.busquedas = datos;
      this.listar(datos, quitarbuscar);
      //this.$nextTick(this.listar(data));
    },
    onPerPageChange(page) {
      //console.log("onPerPageChange");
      this.paginator.page = 1;
      this.listar();
    },
    fillTable(data) {
      //console.log("filltavble");
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

      const url =
        me.urlModulo +
        "?page=" +
        page +
        "&per_page=" +
        perPage +
        buscar +
        sortBy;

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
      if (data.ok < 0) {
        console.error(data.msg);
        alert(data.msg);
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
    deleteItem(id) {
      if (!this.can('del',true)){return false;}
      let me = this;
      if (me.lista.selected.length > 0) {
        id = "";
        me.lista.selected.forEach(item => {
          id = id + item.id + ",";
        });
        id = id + "0";
      }



      Swal.fire({
        title: 'Seguro de querer Eliminar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        //cancelButtonColor: '#d33',
        reverseButtons:true,
        confirmButtonText: 'Si, seguro!!!'
      }).then((willDelete) => {
        console.log('willdelete:',willDelete);
        if (willDelete.value===true) {
          console.log('entro');
          me.$axios
            .post(me.urlModulo + "/delete", {
              id: id
            }).then(({data}) => {
              if (me.isOk(data)) {
                me.fillTable(data.data);
                Swal.fire({
                  title: 'Elemento(s) eliminados!',
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
    setParams(){
      let params=this.paginator;
      params = JSON.stringify(params);
      localStorage.setItem(this.$options.name+".Params", params);
    },

    getParams(){
      if (localStorage.getItem(this.$options.name+".Params")){
        let params=JSON.parse(localStorage.getItem(this.$options.name+".Params"));
        return params;
      }else{
        return false;
      }
    },
    can(val,alertar=false) {
        //console.info('entro a can!!! :'+val);
        let guard=this.$options.middleware||this.proteger||'';
        if (typeof(guard)=='string'){
          if (guard!='authAccess'){
            return true;
          }
        }else{
          if (!guard.includes('authAccess')){
            return true;
          }
        }
      //console.error('Can mix:',val,':',this.authAccess||this.$options.authAccess||this.$options.name);
      let passed=this.$store.getters["auth/tienePermiso"](val,this.authAccess||this.$options.authAccess||this.$options.name,);

      if (!passed){
      if (alertar){
          if (alertar===true){
            alertar='no tiene permisos';
          }
          alert(alertar);
        }
      }

        return passed;
     },
    // can(act='view'){
    //   console.log('buscando permisos para:',act);
    //   return this.cacheCan[this.$store.state.auth.permisos[act]];
    // }
  },
  computed: {
    headers: function() {
      let h = [];
      this.campos.forEach(el => {
        if (el.headers) {
          h.push({
            text: el.text,
            value: el.value || null,
            align: el.align || "left",
            width: el.width || null,
            sortable: el.sortable && true
          });
        }
      });

      h.push({
        text: "Estado",
        value: "status",
        align: "center",
        width: "150px",
        sortable: false
      });
    if (this.can('edit')||this.can('del')){
      h.push({
        text: "Acciones",
        value: "",
        align: "left",
        width: "175px",
        sortable: false
      });
    }

      return h;
    },
    search_campos: function() {
      let h = [];
      this.campos.forEach(el => {
        if (el.search) {
          h.push({
            text: el.text,
            value: el.value || null,
            type: el.type || "text"
          });
        }
      });
      return h;
    },
  },
  provide: function() {
  	return {
    	authAccess: this.$options.authAccess||this.$options.name,
      can: this.can,
      proteger:this.$options.middleware||''
    }
  },
  created: function() {
    this.$store.dispatch('auth/getUser');
    //console.log("Crear");
    this.paramsExtra.buscar = "";
    this.created = 2;
  },
  mounted() {
    //console.log("mounted");
    //TODO: manejar roles para mostrar los registros borrados o papelera
    //TODO: ver el cache en las consultas del crud en back y en el front opcion de checksum
    //TODO: ver el porque el vtable row redibuja las filas ejecutando la funcioines de autenticacon acceso can tambien las rules de atenticacion se ejecutan cada vez
    //TODO: ver de como sacar en console con colores los mensajes
    //TODO: ver de configigurar parametros para el modulo auth, ademas de mejorar los mensajes con un snackber, ver de hacerlo un modulo

  }
};
</script>
