import React from 'react'

export default {
    entry: 'index.tsx',
    //maxThreads: 1,
    productionSourceMaps: true,
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
                    path: '/exchange',
                    template: 'src/pages/exchange/index',
                },

                // A route with data and dynamically generated child routes

                {
                    path: '/',
                    //redirect: 'exchange'
                     template: 'src/pages/exchange/index',
                },
                {
                    path: '/liquidity',
                    template: 'src/pages/liquidity',
                },
                {
                    path: '/send',
                    template: 'src/pages/send',
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
                renderMeta
            } = this.props;
            let config;
            if (process.env.NODE_ENV === 'development') {
                config = "/settings/config.js";
            } else {
                config = "/config/config.js";
            }
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
    devServer: {
        contentBase: ['.'],
    },
}
