    export default async function(ctx) {
      ctx.store.commit("auth/setRutaBack", ctx.route.fullPath);
      let access = ctx.route.matched.find(
         v => v.path == ctx.route.fullPath
       );
      access=access.components.default.options.authAccess||access.components.default.options.name;
      if (!(await ctx.store.dispatch('auth/getUser')).id) {
        return ctx.redirect("/login");
      } else {

      if (!ctx.store.getters["auth/tienePermiso"]('ver',access)) {
          ctx.error({ statusCode: 403, message: 'No tiene Permisos a este Modulo' })
        }
      }
      ctx.$axios.defaults.headers.common["Authorization"] =
      ctx.store.getters["auth/getToken"];
    }
