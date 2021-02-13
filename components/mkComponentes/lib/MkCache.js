import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import MD5 from 'crypto-js/md5'
import { c } from '@/components/mkComponentes/lib/MkUtils.js'
//import _lap from '/key.env'
const _lap = process.env.mkConfig.authKey
export function getCt(url, store, lista = 1) {
    if (!store.state.auth.cacheActive) {
        return ''
    }
    let ct = '_ct_='
    let ct2 = ''
    if (url.includes('?')) {
        ct = '&' + ct
    } else {
        ct = '?' + ct
    }
    // if (paginate) {
    //   url = url + JSON.stringify(this.paginator)
    // }
    if (lista == 1) {
        ct2 = ''
    }

    try {
        if (store.state.auth.encryptActive) {
            ct =
                ct + JSON.parse(localStorage.getItem('cache_' + MD5(url).toString())).ct
        } else {
            ct = ct + JSON.parse(localStorage.getItem('cache_' + url)).ct
        }
        if (lista != 1) {
            ct2 = '&_ct2_='
            if (store.state.auth.encryptActive) {
                ct2 =
                    ct2 +
                    JSON.parse(
                        localStorage.getItem('cache_' + MD5(url + '_' + lista).toString())
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
}

export function getDataCache(data, url, store, lista = 1) {
    // if (paginate) {
    //   url = url + JSON.stringify(this.paginator)
    // }

    if (lista != 1) {
        url = url + '_' + lista
    }
    if (data.data == '_ct_') {
        c('Estos datos ya estan cacheados', 'CACHE', 'Cache')
        if (store.state.auth.encryptActive) {
            data.data = JSON.parse(
                    localStorage.getItem('cache_' + MD5(url).toString())
                ) //encriptado1.0
                //console.log(url,data.data);
            data.data = JSON.parse(
                    AES.decrypt(data.data.response, _lap).toString(Utf8)
                ) //encriptado1.1
        } else {
            data.data = JSON.parse(localStorage.getItem('cache_' + url)).response
                //console.log(url,data.data);
        }
    } else {
        let response = data.data
        if (store.state.auth.encryptActive) {
            url = MD5(url).toString()
            response = AES.encrypt(
                JSON.stringify(Object.values(data.data)),
                _lap
            ).toString()
        }
        const ct = {
            ct: MD5(JSON.stringify(data.data)).toString(),
            response: response
        }
        localStorage.setItem('cache_' + url, JSON.stringify(ct))
    }
    return data.data
}

export function setCache(key, datos, encrypt = true) {
    let c = { f: {}, d: {} };
    for (let k in datos) {
        if (datos.hasOwnProperty(k) && typeof datos[k] === 'function') {
            c.f[k] = encodeURIComponent(datos[k]);
        }
    }

    c.d = datos;

    if (encrypt) {

        localStorage.setItem(key, AES.encrypt(JSON.stringify(c), _lap).toString());
    } else {
        localStorage.setItem(key, JSON.stringify(c));
    }
    return true
}

export function getCache(key, def = false, encrypt = true) {

    let r = def
    try {
        if (encrypt) {
            r = JSON.parse(AES.decrypt(localStorage.getItem(key), _lap).toString(Utf8))
        } else {
            r = JSON.parse(localStorage.getItem(key))
        }
        let b = r.d;
        for (var k in r.f) {
            if (r.f.hasOwnProperty(k)) {
                b[k] = eval("(" + decodeURIComponent(r.f[k]) + ")");
            }
        }
        r = b
    } catch (e) {
        r = def
    }
    return r
}

export function getCacheKey(datos) {
    return MD5(JSON.stringify(datos)).toString()
}