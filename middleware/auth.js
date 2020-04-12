export default function(context) {
  context.store.commit("auth/setRutaBack", context.route.fullPath);
  if (!context.store.getters["auth/getUser"]) {
    context.store.dispatch("auth/reloadUser");
  }
  let user = context.store.getters["auth/getUser"];

  if (!user) {
    return context.redirect("/login");
  }
  context.$axios.defaults.headers.common["Authorization"] =
    context.store.getters["auth/getToken"];
}
