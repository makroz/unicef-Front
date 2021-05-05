const Menu = [
        { header: 'menu Principal' },
        {
            title: 'Dashboard',
            group: 'apps',
            icon: 'dashboard',
            name: 'Dashboard',
            href: '/dashboard/'
        },

        {
            title: 'Modulo Evaluaciones',
            group: 'evaluaciones',
            component: 'evaluaciones',
            icon: 'face',
            items: [{
                name: 'evaluaciones',
                title: 'Evaluaciones',
                href: '/evaluaciones/evaluaciones/'
            }]
        },
        {
            title: 'Modulo Rutas',
            group: 'rutas',
            component: 'rutas',
            icon: 'face',
            items: [{
                    name: 'ruteos',
                    title: 'Ruteos',
                    href: '/rutas/ruteos/'
                },
                {
                    name: 'rutas',
                    title: 'Rutas',
                    href: '/rutas/rutas/'
                }
            ]
        },

        {
            title: 'Modulo Servicios',
            group: 'servicios',
            component: 'servicios',
            icon: 'face',
            items: [{
                    name: 'solicitudServicios',
                    title: 'Solicitud de Servicios',
                    href: '/servicios/solicitudServicios/'
                },
                {
                    name: 'servicios',
                    title: 'Servicios',
                    href: '/servicios/servicios/'
                }
            ]
        },
        {
            title: 'Modulo Beneficiarios',
            group: 'beneficiarios',
            component: 'beneficiarios',
            icon: 'face',
            items: [{
                    name: 'beneficiarios',
                    title: 'Beneficiarios',
                    group: 'beneficiarios',
                    component: 'beneficiarios',
                    href: '/beneficiarios/beneficiarios/'
                },
                {
                    name: 'auxiliares',
                    title: 'Auxiliares',
                    items: [{
                            name: 'entidades',
                            title: 'Entidades',
                            href: '/beneficiarios/entidades/'
                        },
                        {
                            name: 'dptos',
                            title: 'Dptos',
                            href: '/beneficiarios/dptos/'
                        },
                        {
                            name: 'municipios',
                            title: 'Municipios',
                            href: '/beneficiarios/municipios/'
                        },
                        {
                            name: 'distritos',
                            title: 'Distritos',
                            href: '/beneficiarios/distritos/'
                        },
                        {
                            name: 'zonas',
                            title: 'Zonas',
                            href: '/beneficiarios/zonas/'
                        },
                        {
                            name: 'epsas',
                            title: 'Epsas',
                            href: '/beneficiarios/epsas/'
                        },
                        {
                            name: 'descoms',
                            title: 'Descoms',
                            href: '/beneficiarios/descoms/'
                        },
                        {
                            name: 'parentescos',
                            title: 'Parentescos',
                            href: '/beneficiarios/parentescos/'
                        },
                        {
                            name: 'est_civiles',
                            title: 'Estados Civiles',
                            href: '/beneficiarios/est_civiles/'
                        },
                        {
                            name: 'niv_educativos',
                            title: 'Niveles Educativos',
                            href: '/beneficiarios/niv_educativos/'
                        },
                        {
                            name: 'ocupaciones',
                            title: 'Ocupaciones',
                            href: '/beneficiarios/ocupaciones/'
                        },
                        {
                            name: 'tipo_banos',
                            title: 'Tipos de baños',
                            href: '/beneficiarios/tipo_banos/'
                        },
                        {
                            name: 'doc_firmados',
                            title: 'Doc. Firmados',
                            href: '/beneficiarios/doc_firmados/'
                        },
                        {
                            name: 'info_metodos',
                            title: 'Métodos de Información',
                            href: '/beneficiarios/info_metodos/'
                        },
                        // {
                        //     name: 'familiares',
                        //     title: 'Familiares',
                        //     href: '/beneficiarios/familiares/'
                        // }
                    ]
                }
            ]
        }, {
            title: 'Modulo Capacitaciones',
            group: 'capacitaciones',
            component: 'capacitaciones',
            icon: 'face',
            items: [{
                    name: 'lista_apoyos',
                    title: 'Lista de Apoyos',
                    href: '/capacitaciones/lista_apoyos/'
                },
                {
                    name: 'sesion_familiares',
                    title: 'Sesiones Familiares',
                    href: '/capacitaciones/sesion_familiares/'
                },
                {
                    name: 'sesion_grupales',
                    title: 'Sesiones Grupales',
                    href: '/capacitaciones/sesion_grupales/'
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
                    href: '/usuarios/roles/'
                },
                {
                    name: 'permisos',
                    title: 'Permisos',
                    badge: 'new',
                    href: '/usuarios/permisos/'
                },
                {
                    name: 'grupos',
                    title: 'Grupos',
                    href: '/usuarios/grupos/'
                },
                {
                    name: 'usuarios',
                    title: 'Usuarios',
                    badge: 'new',
                    href: '/usuarios/usuarios/'
                }
            ]
        },
        // { divider: true },
        // {
        //     title: 'Importaciones',
        //     group: 'importaciones',
        //     component: 'importaciones',
        //     icon: 'face',
        //     items: [{
        //         name: 'ImportarBeneficiarios',
        //         title: 'Importar Beneficiarios',
        //         href: '/importaciones/beneficiarios/'
        //     }, ]
        // },
        // { divider: true },
        // {
        //     title: 'IA CRUD',
        //     group: 'ia',
        //     component: 'ia',
        //     icon: 'face',
        //     items: [{
        //         name: 'iaCrud',
        //         title: 'IA CRUD',
        //         href: '/ia/ia/'
        //     }, ]
        // },

    ]
    // reorder menu
    // Menu.forEach((item) => {
    //     if (item.items) {
    //         item.items.sort((x, y) => {
    //             let textA = x.title.toUpperCase()
    //             let textB = y.title.toUpperCase()
    //             return textA < textB ? -1 : textA > textB ? 1 : 0
    //         })
    //     }
    // })

export default Menu