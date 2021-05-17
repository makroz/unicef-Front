const Menu = [
    { header: 'menu Principal' },
    {
        title: 'Dashboard',
        name: 'dashboard',
        href: '/dashboard/'
    },
    {
        title: 'Recolectores',
        icon: 'face',
        name: 'recolector',
        href: '/recoleccion/recolector/'
    },
    {
        name: 'evaluaciones',
        title: 'Modulo Evaluaciones',
        icon: 'face',
        items: [{
            name: 'evaluaciones',
            title: 'Evaluaciones',
            href: '/evaluaciones/evaluaciones/'
        }]
    },
    {
        title: 'Modulo Rutas',
        name: 'rutas',
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
        name: 'servicios',
        title: 'Modulo Servicios',
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
            },
            {
                name: 'medidas',
                title: 'Medidas',
                href: '/servicios/medidas/'
            },
            {
                name: 'forma_pagos',
                title: 'Formas de Pago',
                href: '/servicios/forma_pagos/'
            },
            {
                name: 'control_calidades',
                title: 'Lista de QA',
                href: '/servicios/control_calidades/'
            },
            {
                name: 'materiales',
                title: 'Materiales',
                href: '/servicios/materiales/'
            },
            {
                name: 'orden_servicios',
                title: 'Ordenes de Servicios',
                href: '/servicios/orden_servicios/'
            },
            {
                name: 'control_solicitudes',
                title: 'Control QA Solicitudes',
                href: '/servicios/control_solicitudes/'
            },
            {
                name: 'reprogramados',
                title: 'Reprogramados',
                href: '/servicios/reprogramados/'
            }

        ]
    },
    {
        title: 'Modulo Beneficiarios',
        name: 'beneficiarios',
        icon: 'face',
        items: [{
                name: 'beneficiarios',
                title: 'Beneficiasrios',
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
                    }
                ]
            }
        ]
    },
    {
        title: 'Modulo Capacitaciones',
        name: 'capacitaciones',
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
        name: 'usuarios',
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
    {
        name: 'divider1',
        divider: true
    }
]
export default Menu