export default function(context) {
  context.store.commit("auth/setRutaBack", context.route.fullPath);
  let user = context.store.getters["auth/getUser"];
  if (!user) {
    context.store.dispatch("auth/reloadUser");
  }
  // error({
  //   message: "You are not connected",
  //   statusCode: 403
  // });

  if (!user) {
    return context.redirect("/login");
  }
  context.$axios.defaults.headers.common["Authorization"] =
    context.store.getters["auth/getToken"];
}
