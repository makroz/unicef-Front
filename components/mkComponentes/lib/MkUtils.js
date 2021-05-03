export function c(msg, m1 = '', m2 = '', tipo = '') {
    // if (m1!=''){
    //   m1=' '+m1.trim()+' ';
    // }
    // if (m2!=''){
    //   m2=' '+m2.trim()+' ';
    // }
    let c1 = 'background:#35495e ; color: #fff'
    let c2 = 'background:#41b883 ; color: #fff'
    if (tipo.trim() == 'warning') {
        c1 = 'background:#FF5733 ; color: #fff'
    }
    if (tipo.trim() == 'warning') {
        c1 = 'background:#FF5733 ; color: #fff'
    }
    if (tipo.trim() == 'info') {
        c1 = 'background:#1C72E7 ; color: #fff'
        c2 = 'background:#000 ; color: #fff'
    }

    if (tipo.trim() == 'error') {
        c1 = 'background:#ff0808 ; color: #fff'
        c2 = 'background:#000 ; color: #fff'
        console.error(
            '%c ' + m1 + ' %c ' + m2 + ' %c',
            'padding: 1px; border-radius: 3px 0 0 3px;' + c1,
            'padding: 1px; border-radius: 0 3px 3px 0;' + c2,
            'background:transparent',
            msg
        )
    } else {
        console.log(
            '%c ' + m1 + ' %c ' + m2 + ' %c',
            'padding: 1px; border-radius: 3px 0 0 3px;' + c1,
            'padding: 1px; border-radius: 0 3px 3px 0;' + c2,
            'background:transparent',
            msg
        )
    }

    return true
}

export function getTitFromName(msg) {
    return (msg + '').split('/').pop().split(/(?=[A-Z])/).join(' ');
}

export function getFirstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDataLista(lista, valor, busco = 'id', devuelvo = 'name', def = false) {
    let r = def
        //console.log('getdatalista:' + valor + ':' + busco + ':' + devuelvo, lista);
    let o = lista.find(el => el[busco] === valor)
    if (o) {
        if (devuelvo == '*') {
            r = o
        } else {
            r = o[devuelvo];
        }
    }
    //console.log('getdatalista resulatdo:' + o);
    return r
}
export function getDistancia(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1) * Math.PI / 180; // deg2rad below
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

export function imprimirElemento(nombre, title = 'Impresion') {
    let elemento = document.getElementById(nombre);
    let ventana = window.open('', 'PRINT', 'height=400,width=1800');
    ventana.document.write('<html><head><title>' + title + '</title>');
    //ventana.document.write('<link rel="stylesheet" href="style.css">'); 
    ventana.document.write('<script src="/_nuxt/runtime.js"></script><script src="/_nuxt/commons/app.js"></script><script src="/_nuxt/vendors/app.js"></script><script src="/_nuxt/app.js"></script><link data-n-head="1" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons">');
    ventana.document.write('</head><body >');
    ventana.document.write(elemento.innerHTML);
    ventana.document.write('</body></html>');
    ventana.document.close();
    ventana.focus();
    ventana.onload = function() {
        ventana.print();
        ventana.close();
    };
    return true;
}


export function formatDT(d = '', time = true) {
    //return new Date(data).toString().split
    //    console.log('fecha',(d+' ').trim())
    if (!d || d == '') {
        return ''
    }
    let data = new Date(d)
    let year = data.getFullYear().toString()
    let month = (data.getMonth() + 101).toString().substring(1)
    let day = (data.getDate() + 100).toString().substring(1)
    let hour = (data.getHours() + 100).toString().substring(1)
    let minute = (data.getMinutes() + 100).toString().substring(1)
    let secons = (data.getSeconds() + 100).toString().substring(1)
    let r = year + '/' + month + '/' + day
    if (time) {
        r = r + ' ' + hour + ':' + minute + ':' + secons
    }
    return r
}