export default async function(ctx) {
    ctx.store.commit("auth/setRutaBack", ctx.route.fullPath);
    if (!(await ctx.store.dispatch('auth/getUser')).id) {
        return ctx.redirect("/login/");
    }
    ctx.$axios.defaults.headers.common["Authorization"] =
        ctx.store.getters["auth/getToken"];
}