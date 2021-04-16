import React from 'react'

export default {
    entry: 'index.tsx',
    //maxThreads: 1,
    productionSourceMaps: true,
    siteRoot: 'https://cennzx.centrality.me',
    getSiteData: () => ({
        title: 'Best of CENNZX'
    }),
    getRoutes: async () => {
        try {
            return [
                // A simple route
                {
                    path: '/about',
                    template: 'src/pages/about',
                },

                // A route with data
                {
                    path: 'exchange',
                    template: 'src/pages/exchange/index',
                },

                // A route with data and dynamically generated child routes

                {
                    path: '/',
                    //redirect: 'exchange'
                     template: 'src/pages/exchange/index',
                },
                {
                    path: 'liquidity',
                    template: 'src/pages/liquidity/index',
                },
                //  A 404 component
                {
                    path: '404',
                    template: 'src/pages/404',
                },
            ];
        } catch (error) {
            console.error('Error while building the routes!', error.message)
            // Don't try to display the stacktrace here, it will cause a strange error
            process.exit(1) // throwing an error does not stop the building process
        }
    },
    Document: class CustomHtml extends React.Component {
        render() {
            const {
                Html,
                Head,
                Body,
                children,
                state
            } = this.props;
            console.log('state::',state);
            console.log('process.env.NODE_ENV:',process.env.NODE_ENV);
            const config = process.env.NODE_ENV === 'development' ? "/settings/dev-spotx-config.js": "/settings/config.js";
            return (
                <Html lang='en-US'>
               <Head>
                   <meta charSet='UTF-8'/>
                   <meta name='viewport' content='width=device-width, initial-scale=1'/>
                   <script src={config}></script>
                   <link href='https://fonts.googleapis.com/css?family=Open+Sans” rel=“stylesheet'/>
                   <link href='https://fonts.googleapis.com/css?family=Montserrat&display=swap' rel='stylesheet'/>
                   <link href='https://fonts.googleapis.com/css?family=Montserrat:700&display=swap' rel='stylesheet'/>
               </Head>
            <Body>{children}</Body>
        </Html>
        )
        }
        },


    plugins: [
        ['react-static-plugin-typescript', { typeCheck: false }],
        'react-static-plugin-styled-components',
        'react-static-plugin-reach-router',
    ],
    resolve: {
        alias: {
            config: 'settings',
        },
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto"
            }
        ],
    },
    output: {
        globalObject: this,
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendorOther: {
                    chunks: 'initial',
                    enforce: true,
                    name: 'vendor',
                    test: /node_modules\/(asn1|bn\.js|buffer|cuint|elliptic|lodash|moment|readable-stream|rxjs)/
                },
                vendorReact: {
                    chunks: 'initial',
                    enforce: true,
                    name: 'react',
                    test: /node_modules\/(chart|i18next|react|semantic-ui)/
                },
                polkadotJs: {
                    chunks: 'initial',
                    enforce: true,
                    name: 'polkadotjs',
                    test: /node_modules\/(@polkadot\/wasm-(crypto|dalek-ed25519|schnorrkel))/
                }
            }
        }
    },
    devServer: {
        https: process.env.NODE_ENV === 'development' ? false : true,
        contentBase: ['.'],
    },
}
