export default async function(ctx) {
    //return false
    ctx.store.commit("auth/setRutaBack", ctx.route.fullPath);
    if (!(await ctx.store.dispatch('auth/getUser')).id) {
        ctx.store.dispatch('auth/logger', {
            message: 'Logout x Auth Middleware',
        })
        ctx.redirect("/login/")
        return false
    }
    ctx.$axios.defaults.headers.common["Authorization"] =
        ctx.store.getters["auth/getToken"];
}