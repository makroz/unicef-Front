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
    group: "roles",
    component: "roles",
    icon: "face",
    items: [
      {
        name: "grupos",
        title: "Grupos",
        href: "/roles/grupos"
      },
      {
        name: "roles",
        title: "Roles",
        href: "/roles/roles"
      },
      {
        name: "permisos",
        title: "Permisos",
        badge: "new",
        href: "/roles/permisos"
      },
      {
        name: "usuarios",
        title: "Usuarios",
        badge: "new",
        href: "/roles/usuarios"
      }
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
