import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
const _lap=process.env.mkAuth.key;

export const state = () => ({
  authToken: null,
  authUser: null,
  acceso:false,
  rutaBack: null,
  cacheActive:false,
  encryptActive:true,
  permisos: { view: 1, ver:1, show:1,leer:1,read:1
             , add: 4, crear: 4, alta:4, create:4, store:4
             , edit: 2, editar:2, mod:2, modificar:2, update:2
             , del: 8, delete: 8, borrar:8, suprimir: 8, baja:8, destroy:8,restore:8,recycled:8, restaurar:8,recyclar:8,
            }


});

export const getters = {
  getUser: state => {
    return state.authUser;
  },
  getToken: state => {
    return state.authToken;
  },
  rolIs: (state,getters) => rol => {
      if ((!rol)||(!state.authUser)||!state.authUser.rol){
        return false;
      }
      rol=rol.toUpperCase().trim();
      const rolUser=state.authUser.rol.toLowerCase().trim();
      return rolUser==rol;
    },
  getPermiso: state => permiso => {
    permiso = permiso.toLowerCase().trim();
    return state.permisos[permiso];
  },
  tienePermiso: (state, getters) => {
    var cacheMkAuth =[];
    return   (tipo,permiso,clear) => {
      const key = tipo + permiso;
      if (clear){cacheMkAuth =[];}
      if ((!cacheMkAuth[key])&&(cacheMkAuth[key]!==false)){
        cacheMkAuth[key]= getters._tienePermiso(tipo, permiso);
      }
      return cacheMkAuth[key];
    }
  },

  _tienePermiso: (state, getters) => (tipo,permiso) => {
    const tipos = state.permisos;
    if (!getters.getUser){
      return false;
    }
    if (permiso){
      permiso = permiso.toLowerCase().trim();
    }
        //console.log("antes tienePermisos No:",getters.getUser);
    let acceso=0;
    if (getters.getUser.permisos){
      acceso = getters.getUser.permisos[permiso];
    }
    //const permitido=(acceso && (acceso & tipos[tipo]))==tipos[tipo];
    const permitido=(acceso && (acceso & tipos[tipo]))==tipos[tipo];
    //console.log("_permisos:",'('+permiso+')',' Tipo:', tipo, " :", tipos[tipo], "/", acceso,'***',permitido,getters.getUser.permisos);
    return permitido;
  }
};
export const mutations = {
  setAcceso(state,valor){
    state.acceso=valor;
  },
  setCacheActive(state,valor){
    state.cacheActive=valor;
  },

  setEncriptActive(state,valor){
    state.encrypActive=valor;
  },
  SET_USER(state, user,persist=true) {
    if ((user != null)&&(persist)) {
      localStorage.setItem("Auth", AES.encrypt( JSON.stringify(user), _lap).toString());
    } else {
      localStorage.removeItem("Auth");
      localStorage.removeItem("AuthToken");
    }
    state.authUser = user;
  },
  setRutaBack(state, val) {
    state.rutaBack = val;
  },
  setAuthToken(state, val) {
    if (val != null) {
      localStorage.setItem("AuthToken", AES.encrypt(JSON.stringify(val), _lap).toString());
    } else {
      localStorage.removeItem("AuthToken");
    }
    state.authToken = val;
  }
};

export const actions = {

  can({getters,commit},act){
    let modulo = this.$router.currentRoute.matched.find(
      v => v.path == this.$router.currentRoute.path
    );
    modulo=modulo.components.default.options.authAccess||modulo.components.default.options.name;
    let per=getters.tienePermiso(act,modulo);
    console.log('can:',modulo,':',act,'//',per) ;
    commit("setAcceso", per);
    return per;
  },
  async login({ commit, getters }, auth) {
    console.log("this:", this.state.auth.rutaBack);
    try {
      getters.tienePermiso('view','usuarios',true);

      const { data } = await this.$axios.post("login", auth);
      if (data.ok > 0) {
        commit("SET_USER", data.data);
        commit("setAuthToken", data._sid_);
        this.$axios.defaults.headers.common["Authorization"] = data._sid_;
        if (this.state.auth.rutaBack == null) {
          commit("setRutaBack", "/");
        }
        this.$router.push(this.state.auth.rutaBack);
        return true;
      } else {
        commit("setAuthToken", null);
        this.$axios.defaults.headers.common["Authorization"] = "";
        throw new Error(data.msg);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        commit("setAuthToken", null);
        this.$axios.defaults.headers.common["Authorization"] = "";
        throw new Error("Bad credentials");
      }
      throw error;
    }
    return false;
  },
  async getUser({getters,commit,dispatch}){
    if (!getters.getUser){
      return await dispatch('reloadUser',false);
    }
    return getters.getUser;
  },
  logout({ commit }) {
    //await this.$axios.post("logout");
    this.$axios.defaults.headers.common["Authorization"] = "";
    commit("SET_USER", null);
    commit("setAcceso", false);
    this.$router.push("/login");
    return true;
  },
  reloadUser({ commit },persist=true) {
    let user={};
    if (localStorage.getItem("Auth")) {
      try {
         user =JSON.parse(AES.decrypt(localStorage.getItem("Auth"), _lap).toString(Utf8));
        let token =JSON.parse(AES.decrypt(localStorage.getItem("AuthToken"), _lap).toString(Utf8));
        commit("SET_USER", user,persist);
        commit("setAuthToken", token,persist);
        //return user;
      } catch (e) {
        console.log("error", e);
        commit("SET_USER", null);
      }
    }
    return user;
  }
};
