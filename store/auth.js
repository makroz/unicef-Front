import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
const _lap=process.env.mkAuth.key;

export const state = () => ({
  authToken: null,
  authUser: null,
  //authAccess: null,
  acceso:false,
  rutaBack: null,
  permisos: { view: 1, ver:1, show:1,leer:1,read:1
             , add: 4, crear: 4, alta:4, create:4, store:4
             , edit: 2, editar:2, mod:2, modificar:2, update:2
             , del: 8, delete: 8, borrar:8, suprimir: 8, baja:8, destroy:8
            }


});

export const getters = {
  getUser: state => {
    return state.authUser;
  },
  getToken: state => {
    return state.authToken;
  },

  getPermiso: state => permiso => {
    permiso = permiso.toLowerCase().trim();
    return state.permisos[permiso];
  },
  tienePermiso: (state, getters) => {
    const cache ={};
    return   (tipo,permiso) => {
      const key = tipo + permiso;
      if (!cache[key]){
        cache[key]= getters._tienePermiso(tipo, permiso);
      }
      return cache[key];
    }
  },

  _tienePermiso: (state, getters) => (tipo,permiso) => {
    const tipos = state.permisos;
    if (permiso){
      permiso = permiso.toLowerCase().trim();
    }
    //console.log("antes tienePermisos:",getters.getUser);
    let acceso=0;
    if (getters.getUser.permisos){
      acceso = getters.getUser.permisos[permiso];
    }
    //console.log("_permisos:",'('+permiso+')',' Tipo:', tipo, " :", tipos[tipo], "/", acceso,'***',acceso && acceso & tipos[tipo],getters.getUser.permisos);
    return acceso && acceso & tipos[tipo]==tipos[tipo];
  }
};
export const mutations = {
  setAcceso(state,valor){
    state.acceso=valor;
  },
  SET_USER(state, user,persist=true) {
    if ((user != null)&&(persist)) {
      localStorage.setItem("Auth", AES.encrypt( JSON.stringify(user), _lap).toString());
    } else {
      localStorage.removeItem("Auth");
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
  async login({ commit }, auth) {
    console.log("this:", this.state.auth.rutaBack);
    try {
      const { data } = await this.$axios.post("login", auth);
      if (data.ok > 0) {
        commit("SET_USER", data.data);
        commit("setAuthToken", data._sid_);
        this.$axios.defaults.headers.common["Authorization"] = data._sid_;
        if (this.state.auth.rutaBack == null) {
          commit("setRutaBack", "/");
        }
        this.$router.push(this.state.auth.rutaBack);
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
  },
  getUser({getters,commit,dispatch}){
    if (!getters.getUser){
      dispatch('reloadUser',false);
    }
    return getters.getUser;
  },
  logout({ commit }) {
    //await this.$axios.post("logout");
    this.$axios.defaults.headers.common["Authorization"] = "";
    commit("SET_USER", null);
    commit("setAuthToken", null);
    commit("setAcceso", false);

    this.$router.push("/login");
  },
  reloadUser({ commit },persist=true) {
    if (localStorage.getItem("Auth")) {
      try {
        let user =JSON.parse(AES.decrypt(localStorage.getItem("Auth"), _lap).toString(Utf8));
        let token =JSON.parse(AES.decrypt(localStorage.getItem("AuthToken"), _lap).toString(Utf8));
        commit("SET_USER", user,persist);
        commit("setAuthToken", token,persist);
        return user;
      } catch (e) {
        console.log("error", e);
        localStorage.removeItem("Auth");
        localStorage.removeItem("AuthToken");
      }
    }
  }
};
