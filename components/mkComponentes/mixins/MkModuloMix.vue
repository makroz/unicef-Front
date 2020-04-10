<script>
import MkForm from "@/components/mkComponentes/MkFormulario";
import MkTableHead from "@/components/mkComponentes/MkTableHead";
import MkTableRow from "@/components/mkComponentes/MkTableRow";
import MkPaginator from "@/components/mkComponentes/MkPaginator";
//import MkStatus from "@/components/mkComponentes/MkStatus";
import swal from "sweetalert";
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
            (v || "").length > minNum || "Minimo " + minNum + " caracteres";
        },
        max(maxNum) {
          return v =>
            (v || "").length <= maxNum || "Maximo " + maxNum + " caracteres";
        },
        noSpaces: v => (v || "").indexOf(" ") < 0 || "No se admite espacios",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "e-mail no válido";
        }
      },
      errores: [],
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
        // if (!isNull(d)) {
        //   if (d.totalItems !== undefined) {
        //     //console.log("listar0", d.totalItems);
        //     return true;
        //   }
        // }
        //console.log("listar1", d);
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
        me.$axios
          .put(me.urlModulo + "/" + me.item.id, me.item)
          .then(function(response) {
            if (me.isOk(response.data)) {
              me.fillTable(response.data.data);
              me.closeDialog();
              me.paramsExtra = {};
            } else {
              //me.closeDialog("con Error Grabar");
              isError = 1;
            }
          })
          .catch(function(error) {
            console.log(error);
            isError = 2;
          });
      } else {
        me.$axios
          .post(me.urlModulo, me.item)
          .then(function(response) {
            if (me.isOk(response.data)) {
              me.paginator.page = 1;
              me.fillTable(response.data.data);
              me.closeDialog();
              me.paramsExtra = {};
            } else {
              //me.closeDialog("con Error Grabar");
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
      let me = this;
      if (me.lista.selected.length > 0) {
        id = "";
        me.lista.selected.forEach(item => {
          id = id + item.id + ",";
        });
        id = id + "0";
      }
      swal("Seguro de querer Eliminar?", {
        buttons: ["No", true]
      }).then(willDelete => {
        if (willDelete) {
          me.$axios
            .post(me.urlModulo + "/delete", {
              id: id
            })
            .then(function(response) {
              if (me.isOk(response.data)) {
                me.fillTable(response.data.data);
                swal("Elemento(s) eliminados!", {
                  icon: "success"
                });
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
    closeDialog(msg = "") {
      this.tituloModal = "";
      this.errores = [];
      this.modal = false;
      // if (msg != "") {
      //   alert(msg);
      // }
    },
    openDialog(accion, data = {}) {
      this.errores = [];
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
      //console.log('Graba Params',params);
    },

    getParams(){
      if (localStorage.getItem(this.$options.name+".Params")){
        let params=JSON.parse(localStorage.getItem(this.$options.name+".Params"));
        return params;
        //console.log('Recupera Params',params);
      }else{
        return false;
      }
    }
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
      h.push({
        text: "Acciones",
        value: "",
        align: "left",
        width: "175px",
        sortable: false
      });

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
    }
  },
  created: function() {
    console.log("Crear");
    this.paramsExtra.buscar = "";
    this.created = 2;
    //this.getParams();
  },
  mounted() {
    //console.log("mounted");
    //TODO: manejar roles para mostrar los registros borrados o papelera
    //TODO: ver el update que actualize en elf ront y no requiera pedir la lista, ver el manejo de cache de la lista con checlsum
    //crear el auth clase
    //TODO: encryptar el localstore
  }
};
</script>
