const pkg = require('./package')


const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
    mode: 'spa',

    env: {
        mkConfig: {
            authKey: 'asasasa',
            dirty: true,
            storageUrl: 'http://unicef.test/storage/'
        },


    },

    /*
     ** Headers of the page
     */
    head: {
        title: "Unicef v.0.1",
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content: 'unicef v0.1 \n' +
                    '    Makroz@hotmail.com. +591 72170900'
            }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
            }
        ],
        script: [
            { src: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.4/echarts-en.min.js' }
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#3adced' },

    /*
     ** Global CSS
     */
    css: [
        '~/assets/style/theme.styl',
        '~/assets/style/app.styl',
        'font-awesome/css/font-awesome.css',
        'roboto-fontface/css/roboto/roboto-fontface.css'
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/vuetify',
        '@/plugins/vee-validate',

    ],

    /*
     ** Nuxt.js modules
     */
    modules: ["@nuxtjs/axios", 'nuxt-leaflet', '@nuxtjs/webpackmonitor'],
    axios: {
        // proxyHeaders: false,
        baseURL: "http://unicef.test/api",
        // headers: {
        //     'Accept': 'application/x-www-form-urlencoded',
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //     common: {
        //         'Accept': 'application/x-www-form-urlencoded',
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        // }
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
    },

    /*
     ** Build configuration
     */
    build: {
        transpile: ['vuetify/lib'],
        plugins: [new VuetifyLoaderPlugin()],
        loaders: {
            stylus: {
                import: ["~assets/style/variables.styl"]
            }
        },

        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {

        }
    }
}