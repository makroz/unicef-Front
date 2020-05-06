const Menu = [
  { header: "menu Principal" },
  {
    title: "Dashboard",
    group: "apps",
    icon: "dashboard",
    name: "Dashboard",
    href: "/dashboard"
  },
  {
    title: "Modulo Usuarios",
    group: "usuarios",
    component: "usuarios",
    icon: "face",
    items: [
      {
        name: "roles",
        title: "Roles",
        href: "/usuarios/roles"
      },
      {
        name: "permisos",
        title: "Permisos",
        badge: "new",
        href: "/usuarios/permisos"
      },
      {
        name: "grupos",
        title: "Grupos",
        href: "/usuarios/grupos"
      },
            {
        name: "usuarios",
        title: "Usuarios",
        badge: "new",
        href: "/usuarios/usuarios"
      }
    ]
  },
  {
    title: "Modulo Empresas",
    group: "empresas",
    component: "empresas",
    icon: "face",
    items: [
      {
        name: "empresas",
        title: "Empresas",
        href: "/empresas/empresas"
      },
      {
        name: "sucursales",
        title: "Sucursales",
        badge: "new",
        href: "/empresas/sucursales"
      },
      {
        name: "empleados",
        title: "Empleados",
        href: "/empresas/empleados"
      },
    ]
  },
  { divider: true },
  { header: "Extras" },
  {
    title: "Login",
    group: "extra",
    icon: "list",
    href: "/login"
  },
  {
    title: "Empty",
    group: "extra",
    icon: "insert_drive_file",
    href: "/empty"
  }
];
// reorder menu
Menu.forEach(item => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }
});

export default Menu;
