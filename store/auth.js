import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import MD5 from 'crypto-js/md5'
import { c } from '@/components/mkComponentes/lib/MkUtils.js'
const _lap = process.env.mkConfig.authKey

export const state = () => ({
    pwa: false,
    authToken: null,
    authUser: null,
    acceso: false,
    rutaBack: null,
    cacheActive: false,
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
        recyclar: 8
    }
})

export const getters = {
    getCtOnly: (state) => (url, paginate = false, lista = 1) => {
        if (!state.cacheActive) {
            return ''
        }
        let ct = ''
        try {
            if (state.encryptActive) {
                ct = JSON.parse(localStorage.getItem('cache_' + MD5(url).toString())).ct
            } else {
                ct = JSON.parse(localStorage.getItem('cache_' + url)).ct
            }
        } catch (error) {
            ct = ''
        }
        return ct
    },
    getCt: (state, getters) => (url, paginate = false, lista = 1) => {
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

        ct = ct + getters.getCtOnly(url)
        if (lista != 1) {
            ct2 = '&_ct2_=' + ct2 + getters.getCtOnly(url + '_' + lista)
        }
        return ct + ct2
    },
    getDataCache: (state) => (data, url, paginate = false, lista = 1) => {
        if (!data) {
            return []
        }
        if (paginate) {
            url = url + JSON.stringify(paginate)
        }
        if (lista != 1) {
            url = url + '_' + lista
        }
        if (data.data == '_ct_') {
            c('datos cacheados', url.split('?')[0].split('/')[0], 'Cache')
            if (state.encryptActive) {
                data.data = JSON.parse(
                        localStorage.getItem('cache_' + MD5(url).toString())
                    ) //encriptado1.0
                    //console.log('decruipt:',data.data,data.data.response);
                if (data.data.response != '') {
                    data.data = JSON.parse(
                            AES.decrypt(data.data.response, _lap).toString(Utf8)
                        ) //encriptado1.1
                } else {
                    data.data = ''
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
                if (data.data) {
                    response = AES.encrypt(
                        //JSON.stringify(Object.values(data.data)),
                        JSON.stringify(data.data),
                        _lap
                    ).toString()
                } else {
                    response = []
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

    getDataCaches: (state) => (datas, listas) => {
        if (!datas) {
            return []
        }
        let resp = {}
        listas.forEach(lista => {
            let mod = lista.mod;
            if (lista.lista && lista.lista != '') {
                mod = lista.lista
            }

            if (!datas.data[mod]) {
                resp[mod] = []
            } else {
                let data = datas.data[mod]
                if (data == '_ct_') {
                    c('Datos cacheados', mod, 'Cache')
                    if (state.encryptActive) {
                        data = JSON.parse(
                            localStorage.getItem('cache_' + MD5(lista.url).toString())
                        )
                        if (data.response != '') {
                            data = JSON.parse(AES.decrypt(data.response, _lap).toString(Utf8))
                        } else {
                            data = ''
                        }
                    } else {
                        data = JSON.parse(localStorage.getItem('cache_' + lista.url))
                            .response
                    }
                } else {
                    let response = data
                    if (state.encryptActive) {
                        lista.url = MD5(lista.url).toString()
                        if (data) {
                            response = AES.encrypt(JSON.stringify(data), _lap).toString()
                        } else {
                            response = []
                        }
                    }
                    const ct = {
                        ct: MD5(JSON.stringify(data)).toString(),
                        response: response
                    }
                    localStorage.setItem('cache_' + lista.url, JSON.stringify(ct))
                }
                //resp.push({ mod: lista.mod, data: data })
                resp[mod] = data
            }
        })
        return resp
    },
    getUser: (state) => {
        return state.authUser
    },
    getToken: (state) => {
        return state.authToken
    },
    rolIs: (state, getters) => (rol) => {
        if (!rol || !state.authUser || !state.authUser.rol) {
            return false
        }
        rol = rol.toUpperCase().trim()
        const rolUser = state.authUser.rol.toLowerCase().trim()
        return rolUser == rol
    },
    getPermiso: (state) => (permiso) => {
        permiso = permiso.toLowerCase().trim()
        return state.permisos[permiso]
    },
    tienePermiso: (state, getters) => {
        var cacheMkAuth = []
        return (tipo, permiso, clear) => {
            const key = tipo + permiso
            if (clear) {
                cacheMkAuth = []
            }
            if (!cacheMkAuth[key] && cacheMkAuth[key] !== false) {
                cacheMkAuth[key] = getters._tienePermiso(tipo, permiso)
            }
            return cacheMkAuth[key]
        }
    },

    _tienePermiso: (state, getters) => (tipo, permiso) => {
        const tipos = state.permisos
        if (!getters.getUser) {
            return false
        }
        if (getters.getUser.rol == 'superAdmin') {
            return true
        }
        if (permiso) {
            permiso = permiso.toLowerCase().trim()
        }
        //console.log("antes tienePermisos No:",getters.getUser);
        let acceso = 0
        if (getters.getUser.permisos) {
            acceso = getters.getUser.permisos[permiso]
        }
        //const permitido=(acceso && (acceso & tipos[tipo]))==tipos[tipo];
        const permitido = (acceso && acceso & tipos[tipo]) == tipos[tipo]
            //console.log("_permisos:",'('+permiso+')',' Tipo:', tipo, " :", tipos[tipo], "/", acceso,'***',permitido,getters.getUser.permisos);
        return permitido
    }
}
export const mutations = {
    setPwa(state, valor) {
        state.pwa = valor
    },
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
        state.acceso = valor
    },
    setCacheActive(state, valor) {
        state.cacheActive = valor
    },

    setEncriptActive(state, valor) {
        state.encrypActive = valor
    },
    SET_USER(state, user, persist = true) {
        if (user != null && persist) {
            localStorage.setItem(
                'Auth',
                AES.encrypt(JSON.stringify(user), _lap).toString()
            )
        } else {
            localStorage.removeItem('Auth')
            localStorage.removeItem('AuthToken')
        }
        state.authUser = user
    },
    setRutaBack(state, val) {
        state.rutaBack = val
    },
    setAuthToken(state, val) {
        if (val != null) {
            localStorage.setItem(
                'AuthToken',
                AES.encrypt(JSON.stringify(val), _lap).toString()
            )
        } else {
            localStorage.removeItem('AuthToken')
        }
        state.authToken = val
    }
}

export const actions = {
    async loadDatas({ commit, getters, dispatch }, options) {
        let listado = []
        options.listas.forEach((datos) => {
            let url =
                datos.mod + '?page=1&per_page=-1&cols=' + datos.campos + '&disabled=1'
            if (datos.filter) {
                url = url + '&filter=' + datos.filter
            }
            if (datos.rels) {
                url = url + '&rels=1'
            }
            if (datos.relsE) {
                url = url + '&relsE=1'
            }
            if (datos.rel) {
                url = url + '&rel=' + datos.rel
            }
            if (!datos.url) {
                datos.url = url
            }

            // let modulo = ''
            // if (datos.datos) {
            //     modulo = datos.datos.modulo || 'mk' + datos.mod
            // } else {
            //     modulo = 'mk' + datos.mod
            // }

            let list = {
                mod: datos.mod,
                ct: getters.getCtOnly(url),
                ...datos.datos
            }
            if (datos.lista) {
                list.l = datos.lista
            }
            if (datos.campos) {
                list.campos = datos.campos
            }
            //   if (datos.modulo) {
            //     list.modulo = datos.modulo
            // }

            listado.push(list)
        })
        let response = await this.$axios.post(options.mod + '/listData', {
            lista: listado
        })
        if (response.data.ok < -1) {
            if (response.data.ok == -1001) {
                dispatch('logout')
            }
            return false
        }
        return getters.getDataCaches(response.data, options.listas)
    },

    async loadData({ commit, getters, dispatch }, datos) {
        let url =
            datos.url + '?page=1&per_page=-1&cols=' + datos.campos + '&disabled=1'
        if (datos.filter) {
            url = url + '&filter=' + datos.filter
        }
        let response = ''
        let method = 'get'
        if (datos.datos && datos.datos.length > 0) {
            method = 'post'
        }
        if (datos.method && datos.method == 'post') {
            method = 'post'
        }
        if (datos.method && datos.method == 'get') {
            method = 'get'
        }

        if (method == 'post') {
            response = await this.$axios.post(url + getters.getCt(url), datos.datos)
        } else {
            response = await this.$axios.get(url + getters.getCt(url))
        }
        if (response.data.ok < -1) {
            if (response.data.ok == -1001) {
                dispatch('logout')
            }
            return false
        }
        return getters.getDataCache(response.data, url)
    },

    can({ getters, commit }, act) {
        let modulo = this.$router.currentRoute.matched.find(
            (v) => v.path == this.$router.currentRoute.path
        )
        modulo =
            modulo.components.default.options.authAccess ||
            modulo.components.default.options.name
        let per = getters.tienePermiso(act, modulo)
        commit('setAcceso', per)
        return per
    },
    async login({ commit, getters }, auth) {
        //console.log("this rutaBAck:", this.state.auth.rutaBack);
        try {
            getters.tienePermiso('view', 'usuarios', true)

            const { data } = await this.$axios.post('login', auth)
            if (data.ok > 0) {
                commit('SET_USER', data.data)
                commit('setAuthToken', data._sid_)
                this.$axios.defaults.headers.common['Authorization'] = data._sid_
                    // if (this.state.auth.rutaBack == null) {
                    //     commit("setRutaBack", "/");
                    // }
                    // this.$router.push(this.state.auth.rutaBack);
                this.$router.back()
                return true
            } else {
                commit('setAuthToken', null)
                this.$axios.defaults.headers.common['Authorization'] = ''
                throw new Error(data.msg)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                commit('setAuthToken', null)
                this.$axios.defaults.headers.common['Authorization'] = ''
                throw new Error('Bad credentials')
            }
            throw error
        }
        return false
    },
    async getUser({ getters, commit, dispatch }) {
        if (!getters.getUser) {
            return await dispatch('reloadUser', false)
        }
        return getters.getUser
    },
    logout({ commit }) {
        //await this.$axios.post("logout");
        let me = this
        me.$axios.defaults.headers.common['Authorization'] = ''
        commit('SET_USER', null)
        commit('setAcceso', false)
            //commit("setRutaBack", this.$router.history._startLocation);
            //console.log('logout:',this.$router.history._startLocation);
        setTimeout(() => {
            me.$router.push('/login/')
        }, 300)

        return true
    },
    reloadUser({ commit }, persist = true) {
        let user = {}
        if (localStorage.getItem('Auth')) {
            try {
                user = JSON.parse(
                    AES.decrypt(localStorage.getItem('Auth'), _lap).toString(Utf8)
                )
                let token = JSON.parse(
                    AES.decrypt(localStorage.getItem('AuthToken'), _lap).toString(Utf8)
                )
                commit('SET_USER', user, persist)
                commit('setAuthToken', token, persist)
                this.$axios.defaults.headers.common['Authorization'] = token
                    //                console.log("reload", user);
                    //return user;
            } catch (e) {
                console.log('error', e)
                commit('SET_USER', null)
            }
        }
        return user
    }
}