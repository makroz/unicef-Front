const Menu = [
        { header: 'menu Principal' },
        {
            title: 'Dashboard',
            group: 'apps',
            icon: 'dashboard',
            name: 'Dashboard',
            href: '/dashboard'
        },
        {
            title: 'Modulo Servicios',
            group: 'servicios',
            component: 'servicios',
            icon: 'face',
            items: [{
                    name: 'solicitudServicios',
                    title: 'Solicitud de Servicios',
                    href: '/servicios/solicitudServicios'
                },
                {
                    name: 'servicios',
                    title: 'Servicios',
                    href: '/servicios/servicios'
                }
            ]
        },
        {
            title: 'Modulo Rutas',
            group: 'rutas',
            component: 'rutas',
            icon: 'face',
            items: [{
                name: 'rutas',
                title: 'Rutas',
                href: '/rutas/rutas'
            }]
        },
        {
            title: 'Modulo Beneficiarios',
            group: 'beneficiarios',
            component: 'beneficiarios',
            icon: 'face',
            items: [{
                    name: 'beneficiarios',
                    title: 'Beneficiarios',
                    href: '/beneficiarios/beneficiarios'
                },
                {
                    name: 'entidades',
                    title: 'Entidades',
                    href: '/beneficiarios/entidades'
                },
                {
                    name: 'distritos',
                    title: 'Distritos',
                    badge: 'new',
                    href: '/beneficiarios/distritos'
                }
            ]
        },
        {
            title: 'Modulo Preguntas',
            group: 'preguntas',
            component: 'preguntas',
            icon: 'face',
            items: [{
                    name: 'categ',
                    title: 'Categorias',
                    href: '/preguntas/categ'
                },
                {
                    name: 'preguntas',
                    title: 'Preguntas',
                    badge: 'new',
                    href: '/preguntas/preguntas'
                }
            ]
        },
        {
            title: 'Modulo Usuarios',
            group: 'usuarios',
            component: 'usuarios',
            icon: 'face',
            items: [{
                    name: 'roles',
                    title: 'Roles',
                    href: '/usuarios/roles'
                },
                {
                    name: 'permisos',
                    title: 'Permisos',
                    badge: 'new',
                    href: '/usuarios/permisos'
                },
                {
                    name: 'grupos',
                    title: 'Grupos',
                    href: '/usuarios/grupos'
                },
                {
                    name: 'usuarios',
                    title: 'Usuarios',
                    badge: 'new',
                    href: '/usuarios/usuarios'
                }
            ]
        },

        {
            title: 'Modulo Horarios',
            group: 'horarios',
            component: 'horarios',
            icon: 'face',
            items: [{
                    name: 'paramsHorarios',
                    title: 'Parametros Horarios',
                    href: '/horarios/paramsHorarios'
                },
                {
                    name: 'horarios',
                    title: 'Horarios',
                    badge: 'new',
                    href: '/horarios/horarios'
                }
            ]
        },
        { divider: true },
        { header: 'Extras' },
        {
            title: 'Login',
            group: 'extra',
            icon: 'list',
            href: '/login'
        },
        {
            title: 'Empty',
            group: 'extra',
            icon: 'insert_drive_file',
            href: '/empty'
        }
    ]
    // reorder menu
Menu.forEach((item) => {
    if (item.items) {
        item.items.sort((x, y) => {
            let textA = x.title.toUpperCase()
            let textB = y.title.toUpperCase()
            return textA < textB ? -1 : textA > textB ? 1 : 0
        })
    }
})

export default Menu