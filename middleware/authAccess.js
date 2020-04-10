export default function(context) {
  context.store.commit("auth/setRutaBack", context.route.fullPath);
  let access = context.route.matched.find(
    v => v.path == context.route.fullPath
  );

  context.store.commit(
    "auth/setAuthAccess",
    access.components.default.options.authAccess
  );

  if (!context.store.getters["auth/getUser"]) {
    context.store.dispatch("auth/reloadUser");
  }
  let user = context.store.getters["auth/getUser"];

  if (!user) {
    return context.redirect("/login");
  } else {
    const plug = context.store.state.auth.authAccess;
    console.log(
      "Verificar permiso del componente:",
      context.store.state.auth.rutaBack,
      " que debe ser:",
      plug
    );

    if (context.store.getters["auth/_tienePermiso"](plug, "view")) {
      console.log("Si Tiene permiso a", plug);
    } else {
      console.log("No Tiene permiso a", plug);
    }
  }
  context.$axios.defaults.headers.common["Authorization"] =
    context.store.getters["auth/getToken"];
}
