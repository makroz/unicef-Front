const Menu = [
    { header: 'menu Principal' },
    { title: 'Dashboard', name: 'dashboard', href: '/dashboard/' },
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
        items: [
            { name: 'ruteos', title: 'Ruteos', href: '/rutas/ruteos/' },
            { name: 'rutas', title: 'Rutas', href: '/rutas/rutas/' }
        ]
    },
    {
        title: 'Modulo Preguntas',
        group: 'preguntas',
        component: 'preguntas',
        icon: 'face',
        items: [
            { name: 'categ', title: 'Categorias', href: '/preguntas/categ/' },
            {
                name: 'preguntas',
                title: 'Preguntas',
                badge: 'new',
                href: '/preguntas/preguntas/'
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
            { name: 'servicios', title: 'Servicios', href: '/servicios/servicios/' },
            {
                name: 'orden_servicios',
                title: 'Ordenes de Servicios',
                href: '/servicios/orden_servicios/'
            },
            {
                name: 'reprogramados',
                title: 'Reprogramados',
                href: '/servicios/reprogramados/'
            },
            {
                name: 'comercial',
                title: 'Comercial Exportados',
                href: '/servicios/comercial/'
            },
            {
                name: 'auxiliaresServ',
                title: 'Auxiliares',
                items: [
                    { name: 'medidas', title: 'Medidas', href: '/servicios/medidas/' },
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
                    }
                ]
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
                    { name: 'dptos', title: 'Dptos', href: '/beneficiarios/dptos/' },
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
                    { name: 'zonas', title: 'Zonas', href: '/beneficiarios/zonas/' },
                    { name: 'epsas', title: 'Epsas', href: '/beneficiarios/epsas/' },
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
                        title: 'Tipos de ba\u00f1os',
                        href: '/beneficiarios/tipo_banos/'
                    },
                    {
                        name: 'doc_firmados',
                        title: 'Doc. Firmados',
                        href: '/beneficiarios/doc_firmados/'
                    },
                    {
                        name: 'info_metodos',
                        title: 'M\u00e9todos de Informaci\u00f3n',
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
        title: 'Modulo Almacenes',
        name: 'almacenes',
        icon: 'face',
        items: [{
                name: 'movimientos',
                title: 'Mov. Almacen',
                href: '/almacenes/movimientos/'
            },
            {
                name: 'Materiales',
                title: 'Materiales',
                href: '/servicios/materiales/'
            },
            {
                name: 'auxiliares',
                title: 'Auxiliares',
                items: [{
                        name: 'mat_categ',
                        title: 'Categorias de Materiales',
                        href: '/almacenes/mat_categ/'
                    },
                    {
                        name: 'ubicaciones',
                        title: 'Ubicaciones en Almacen',
                        href: '/almacenes/ubicaciones/'
                    },
                    {
                        name: 'subtipos',
                        title: 'Subtipos de Mov.',
                        href: '/almacenes/subtipos/'
                    }
                ]
            }
        ]
    },
    {
        title: 'Modulo Usuarios',
        name: 'usuarios',
        icon: 'face',
        items: [
            { name: 'roles', title: 'Roles', href: '/usuarios/roles/' },
            {
                name: 'permisos',
                title: 'Permisos',
                badge: 'new',
                href: '/usuarios/permisos/'
            },
            { name: 'grupos', title: 'Grupos', href: '/usuarios/grupos/' },
            {
                name: 'usuarios',
                title: 'Usuarios',
                badge: 'new',
                href: '/usuarios/usuarios/'
            }
        ]
    },
    { name: 'divider1', divider: true },
    {
        name: 'recolector',
        title: 'Recolector',
        icon: 'face',
        items: [{
                name: 'vehiculos_marcas',
                title: 'Marcas de Vehiculos',
                href: '/recolector/vehiculos_marcas/'
            },
            {
                name: 'check_categ',
                title: 'Categor\u00edas Check List',
                href: '/recolector/check_categ/'
            },
            { name: 'eventos', title: 'Eventos', href: '/recolector/eventos/' },
            { name: 'checks', title: 'Checks', href: '/recolector/checks/' },
            { name: 'choferes', title: 'Choferes', href: '/recolector/choferes/' },
            { name: 'vehiculos', title: 'Vehiculos', href: '/recolector/vehiculos/' },
            {
                name: 'check_diarios',
                title: 'Checks Diarios',
                href: '/recolector/check_diarios/'
            }
        ]
    }
]
export default Menu