import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import MD5 from 'crypto-js/md5'
import { c } from '@/components/mkComponentes/lib/MkUtils.js'
const _lap = process.env.mkConfig.authKey

export const state = () => ({
    authToken: null,
    authUser: null,
    acceso: false,
    rutaBack: null,
    cacheActive: true,
    encryptActive: true,
    permisos: {
        view: 1,
        ver: 1,
        show: 1,
        leer: 1,
        read: 1,
        add: 4,
        crear: 4,
        alta: 4,
        create: 4,
        store: 4,
        edit: 2,
        editar: 2,
        mod: 2,
        modificar: 2,
        update: 2,
        del: 8,
        delete: 8,
        borrar: 8,
        suprimir: 8,
        baja: 8,
        destroy: 8,
        restore: 8,
        recycled: 8,
        restaurar: 8,
        recyclar: 8,
    }


});

export const getters = {

    getCt: state => (url, paginate = false, lista = 1, ) => {
        if (!state.cacheActive) {
            return ''
        }
        let ct = '_ct_='
        let ct2 = ''
        if (url.includes('?')) {
            ct = '&' + ct
        } else {
            ct = '?' + ct
        }
        if (paginate) {
            url = url + JSON.stringify(paginate)
        }
        if (lista == 1) {
            ct2 = ''
        }

        try {
            if (state.encryptActive) {
                ct =
                    ct +
                    JSON.parse(localStorage.getItem('cache_' + MD5(url).toString())).ct
            } else {
                ct = ct + JSON.parse(localStorage.getItem('cache_' + url)).ct
            }
            if (lista != 1) {
                ct2 = '&_ct2_='
                if (state.encryptActive) {
                    ct2 =
                        ct2 +
                        JSON.parse(
                            localStorage.getItem(
                                'cache_' + MD5(url + '_' + lista).toString()
                            )
                        ).ct
                } else {
                    ct2 =
                        ct2 +
                        JSON.parse(localStorage.getItem('cache_' + url + '_' + lista)).ct
                }
            }
        } catch (error) {
            ct = ''
            ct2 = ''
        }
        return ct + ct2
    },
    getDataCache: state => (data, url, paginate = false, lista = 1) => {
        if (!data){
            return []
        }
        if (paginate) {
            url = url + JSON.stringify(paginate)
        }

        if (lista != 1) {
            url = url + '_' + lista
        }
        if (data.data == '_ct_') {

            c('datos cacheados', (url.split('?'))[0].split('/')[0], 'Cache')
            if (state.encryptActive) {
                data.data = JSON.parse(
                        localStorage.getItem('cache_' + MD5(url).toString())
                    ) //encriptado1.0
                    //console.log('decruipt:',data.data,data.data.response);
                    if (data.data.response!=''){
                        data.data = JSON.parse(
                            AES.decrypt(data.data.response, _lap).toString(Utf8)
                        ) //encriptado1.1
                    }else{
                        data.data='';
                    }
                
            } else {
                data.data = JSON.parse(localStorage.getItem('cache_' + url)).response
                    //console.log(url,data.data);
            }
        } else {
            let response = data.data
            if (state.encryptActive) {
                url = MD5(url).toString()
                //console.log('no decruipt:',data,_lap);
                if (data.data){
                response = AES.encrypt(
                    //JSON.stringify(Object.values(data.data)),
                    JSON.stringify(data.data),
                    _lap
                ).toString()
                }else{
                    response=[]
                }
            }
            const ct = {
                ct: MD5(JSON.stringify(data.data)).toString(),
                response: response
            }
            localStorage.setItem('cache_' + url, JSON.stringify(ct))
        }
        return data.data
    },
    getUser: state => {
        return state.authUser;
    },
    getToken: state => {
        return state.authToken;
    },
    rolIs: (state, getters) => rol => {
        if ((!rol) || (!state.authUser) || !state.authUser.rol) {
            return false;
        }
        rol = rol.toUpperCase().trim();
        const rolUser = state.authUser.rol.toLowerCase().trim();
        return rolUser == rol;
    },
    getPermiso: state => permiso => {
        permiso = permiso.toLowerCase().trim();
        return state.permisos[permiso];
    },
    tienePermiso: (state, getters) => {
        var cacheMkAuth = [];
        return (tipo, permiso, clear) => {
            const key = tipo + permiso;
            if (clear) { cacheMkAuth = []; }
            if ((!cacheMkAuth[key]) && (cacheMkAuth[key] !== false)) {
                cacheMkAuth[key] = getters._tienePermiso(tipo, permiso);
            }
            return cacheMkAuth[key];
        }
    },

    _tienePermiso: (state, getters) => (tipo, permiso) => {
        const tipos = state.permisos;
        if (!getters.getUser) {
            return false;
        }
        if (permiso) {
            permiso = permiso.toLowerCase().trim();
        }
        //console.log("antes tienePermisos No:",getters.getUser);
        let acceso = 0;
        if (getters.getUser.permisos) {
            acceso = getters.getUser.permisos[permiso];
        }
        //const permitido=(acceso && (acceso & tipos[tipo]))==tipos[tipo];
        const permitido = (acceso && (acceso & tipos[tipo])) == tipos[tipo];
        //console.log("_permisos:",'('+permiso+')',' Tipo:', tipo, " :", tipos[tipo], "/", acceso,'***',permitido,getters.getUser.permisos);
        return permitido;
    }
};
export const mutations = {
    toggle_tbl_opts_p(state) {
        state.tbl_opts_p = !state.tbl_opts_p
    },
    toggleCache(state) {
        state.cacheActive = !state.cacheActive
    },
    toggleEncrypt(state) {
        state.encrypActive = !state.encrypActive
    },
    setAcceso(state, valor) {
        state.acceso = valor;
    },
    setCacheActive(state, valor) {
        state.cacheActive = valor;
    },

    setEncriptActive(state, valor) {
        state.encrypActive = valor;
    },
    SET_USER(state, user, persist = true) {
        if ((user != null) && (persist)) {
            localStorage.setItem("Auth", AES.encrypt(JSON.stringify(user), _lap).toString());
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
    async loadData({ commit,getters, dispatch }, datos) {
        let url = datos.url + '?page=1&per_page=-1&cols=' + datos.campos + '&disabled=1'
        if (datos.filter) {
            url = url + '&filter=' + datos.filter
        }
        let response = ''
        if ((datos.datos) && (datos.datos.length > 0)) {
            response = await this.$axios.post(url + getters.getCt(url), datos.datos)
        } else {
            response = await this.$axios.get(url + getters.getCt(url))
        }

        //console.log('authloaddata', response);
        if (response.data.ok < -1) {
            //console.log('auth loaddata');
            //commit("setRutaBack", this.$router.history._startLocation);
            //console.log('loaddata:',this.$router.history._startLocation);
            if (response.data.ok == -1001) {
                dispatch('logout')
            }
            return false;
        }
        //console.log('loadata',response.data, url);
        return getters.getDataCache(response.data, url)
    },

    can({ getters, commit }, act) {
        let modulo = this.$router.currentRoute.matched.find(
            v => v.path == this.$router.currentRoute.path
        );
        modulo = modulo.components.default.options.authAccess || modulo.components.default.options.name;
        let per = getters.tienePermiso(act, modulo);
        //console.log('can:', modulo, ':', act, '//', per);
        commit("setAcceso", per);
        return per;
    },
    async login({ commit, getters }, auth) {
        //console.log("this rutaBAck:", this.state.auth.rutaBack);
        try {
            getters.tienePermiso('view', 'usuarios', true);

            const { data } = await this.$axios.post("login", auth);
            if (data.ok > 0) {
                commit("SET_USER", data.data);
                commit("setAuthToken", data._sid_);
                this.$axios.defaults.headers.common["Authorization"] = data._sid_;
                // if (this.state.auth.rutaBack == null) {
                //     commit("setRutaBack", "/");
                // }
                // this.$router.push(this.state.auth.rutaBack);
                this.$router.back();
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
    async getUser({ getters, commit, dispatch }) {
        if (!getters.getUser) {
            return await dispatch('reloadUser', false);
        }
        return getters.getUser;
    },
    logout({ commit }) {
        //await this.$axios.post("logout");
        let me = this
        me.$axios.defaults.headers.common["Authorization"] = "";
        commit("SET_USER", null);
        commit("setAcceso", false);
        //commit("setRutaBack", this.$router.history._startLocation);
        //console.log('logout:',this.$router.history._startLocation);
        setTimeout(() => {
            me.$router.push("/login");
        }, 300)

        return true;
    },
    reloadUser({ commit }, persist = true) {
        let user = {};
        if (localStorage.getItem("Auth")) {
            try {
                user = JSON.parse(AES.decrypt(localStorage.getItem("Auth"), _lap).toString(Utf8));
                let token = JSON.parse(AES.decrypt(localStorage.getItem("AuthToken"), _lap).toString(Utf8));
                commit("SET_USER", user, persist);
                commit("setAuthToken", token, persist);
                this.$axios.defaults.headers.common["Authorization"] = token;
                //                console.log("reload", user);
                //return user;
            } catch (e) {
                console.log("error", e);
                commit("SET_USER", null);
            }
        }
        return user;
    }
};