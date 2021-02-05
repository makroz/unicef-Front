export const state = () => ({
    tbl_opts_p: process.env.mkConfig.tbl_opts_p || false,
    tbl_opts_type: process.env.mkConfig.tbl_opts_type || 'normal',
});

export const getters = {

};
export const mutations = {
    toggle_tbl_opts_p(state) {
        state.tbl_opts_p = !state.tbl_opts_p
    },
    toggle_tbl_opts_type(state) {
        state.tbl_opts_type = state.tbl_opts_type == 'normal' ? 'dial' : 'normal'
    },
};

export const actions = {

};