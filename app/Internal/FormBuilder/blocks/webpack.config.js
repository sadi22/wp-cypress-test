const path = require( 'path' );
const webpack = require( 'webpack' );
const { kebabCase } = require( 'lodash' );
const RemoveFilesPlugin = require( './remove-files-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const ProgressBarPlugin = require( 'progress-bar-webpack-plugin' );
const CircularDependencyPlugin = require( 'circular-dependency-plugin' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const { exec } = require( 'child_process' );
const { getEntryConfig } = require( './webpack-entries' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const CHECK_CIRCULAR_DEPS = process.env.CHECK_CIRCULAR_DEPS || false;

const isProduction = process.env.NODE_ENV === 'production';
const sharedPlugins = [
    CHECK_CIRCULAR_DEPS === 'true'
        ? new CircularDependencyPlugin( {
            exclude: /node_modules/,
            cwd: process.cwd(),
            failOnError: 'warn',
        } )
        : false,
].filter( Boolean );

function findModuleMatch( module, match ) {
    if ( module.request && match.test( module.request ) ) {
        return true;
    } else if ( module.issuer ) {
        return findModuleMatch( module.issuer, match );
    }
    return false;
}
/**
 * Build config for Blocks in the frontend context.
 *
 * @param {Object} options Build options.
 */
const getFrontConfig = ( options = {} ) => {
    let { fileSuffix } = options;
    const { alias, resolvePlugins = [] } = options;
    fileSuffix = fileSuffix ? `-${ fileSuffix }` : '';
    const resolve = alias
        ? {
            alias,
            plugins: resolvePlugins,
        }
        : {
            plugins: resolvePlugins,
        };
    return {
        entry: getEntryConfig( 'frontend', options.exclude || [] ),
        output: {
            filename: `[name]-frontend${ fileSuffix }.js`,
            path: path.resolve( __dirname, './assets/dist/' ),
            libraryTarget: 'this',
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader?cacheDirectory',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        modules: false,
                                        targets: {
                                            browsers: [
                                                'extends @wordpress/browserslist-config',
                                            ],
                                        },
                                    },
                                ],
                            ],
                            plugins: [
                                require.resolve(
                                    '@babel/plugin-proposal-object-rest-spread'
                                ),
                                require.resolve(
                                    '@babel/plugin-transform-react-jsx'
                                ),
                                require.resolve(
                                    '@babel/plugin-proposal-async-generator-functions'
                                ),
                                require.resolve(
                                    '@babel/plugin-transform-runtime'
                                ),
                                require.resolve(
                                    '@babel/plugin-proposal-class-properties'
                                ),
                                isProduction
                                    ? require.resolve(
                                    'babel-plugin-transform-react-remove-prop-types'
                                    )
                                    : false,
                            ].filter( Boolean ),
                        },
                    },
                },
                {
                    test: /\.s[c|a]ss$/,
                    use: {
                        loader: 'ignore-loader',
                    },
                },
            ],
        },
        optimization: {
            splitChunks: {
                automaticNameDelimiter: '--',
            },
            minimizer: [
                new TerserPlugin( {
                    cache: true,
                    parallel: true,
                    sourceMap: ! isProduction,
                    terserOptions: {
                        output: {
                            comments: /translators:/i,
                        },
                        compress: {
                            passes: 2,
                        },
                        mangle: {
                            reserved: [ '__', '_n', '_nx', '_x' ],
                        },
                    },
                    extractComments: false,
                } ),
            ],
        },
        plugins: [
            ...sharedPlugins,
            new ProgressBarPlugin( { clear: false } ),
        ],
        resolve: {
            ...resolve,
            extensions: [ '.js', '.ts', '.tsx' ],
        },
    };
};


/**
 * Build config for Blocks in the editor context.
 *
 * @param {Object} options Build options.
 */
const getMainConfig = ( options = {} ) => {
    let { fileSuffix } = options;
    const { alias, resolvePlugins = [] } = options;
    fileSuffix = fileSuffix ? `-${ fileSuffix }` : '';
    const resolve = alias
        ? {
            alias,
            plugins: resolvePlugins,
        }
        : {
            plugins: resolvePlugins,
        };
    return {
        entry: getEntryConfig( 'main', options.exclude || [] ),
        output: {
            filename: `getwpf-[name]${ fileSuffix }.js`,
            path: path.resolve( __dirname, './assets/dist/' ),
            libraryTarget: 'this',
        },
        module: {
            rules: [
                {
                    test: /\.(j|t)sx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader?cacheDirectory',
                        options: {
                            presets: [ '@wordpress/babel-preset-default' ],
                            plugins: [
                                isProduction
                                    ? require.resolve(
                                    'babel-plugin-transform-react-remove-prop-types'
                                    )
                                    : false,
                                require.resolve(
                                    '@babel/plugin-proposal-class-properties'
                                ),
                            ].filter( Boolean ),
                        },
                    },
                },
                {
                    test: /\.s[c|a]ss$/,
                    use: {
                        loader: 'ignore-loader',
                    },
                },
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					loader: 'file-loader',
				}
            ],
        },
        optimization: {
            minimizer: [
                new TerserPlugin( {
                    parallel: true,
                    terserOptions: {
                        output: {
                            comments: /translators:/i,
                        },
                        compress: {
                            passes: 2,
                        },
                        mangle: {
                            reserved: [ '__', '_n', '_nx', '_x' ],
                        },
                    },
                    extractComments: false,
                } ),
            ],
        },
        plugins: [
            ...sharedPlugins,
            new ProgressBarPlugin( { clear: false } ),
        ],
        resolve: {
            ...resolve,
            extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
        },
    };
};


/**
 * Build config for CSS Styles.
 *
 * @param {Object} options Build options.
 */
const getStylingConfig = ( options = {} ) => {
    let { fileSuffix } = options;
    const { alias, resolvePlugins = [] } = options;
    fileSuffix = fileSuffix ? `-${ fileSuffix }` : '';
    const resolve = alias
        ? {
            alias,
            plugins: resolvePlugins,
        }
        : {
            plugins: resolvePlugins,
        };
    return {
        entry: getEntryConfig( 'styling', options.exclude || [] ),
        output: {
            devtoolNamespace: 'getwpf',
            path: path.resolve( __dirname, './assets/dist/' ),
            filename: `getwpf-[name]-style${ fileSuffix }.js`,
            jsonpFunction: 'webpackWcBlocksJsonp',
        },
        optimization: {
            splitChunks: {
                minSize: 0,
                automaticNameDelimiter: '--',
                cacheGroups: {
                    editorStyle: {
                        // Capture all `editor` stylesheets and editor-components stylesheets.
                        test: ( module = {} ) =>
                            module.constructor.name === 'CssModule' &&
                            ( findModuleMatch( module, /editor\.scss$/ ) ||
                                findModuleMatch(
                                    module,
                                    /[\\/]assets[\\/]js[\\/]editor-components[\\/]/
                                ) ),
                        name: 'getwpf-blocks-editor-style',
                        chunks: 'all',
                        priority: 10,
                    },
                    vendorsStyle: {
                        test: /\/node_modules\/.*?style\.s?css$/,
                        name: 'getwpf-blocks-vendors-style',
                        chunks: 'all',
                        priority: 7,
                    },
                    blocksStyle: {
                        // Capture all stylesheets with name `style` or name that starts with underscore (abstracts).
                        test: /(style|_.*)\.scss$/,
                        name: 'getwpf-blocks-style',
                        chunks: 'all',
                        priority: 5,
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\/node_modules\/.*?style\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    includePaths: [ 'node_modules' ],
                                },
                                additionalData: ( content ) => {
                                    const styleImports = [
                                        'colors',
                                        'breakpoints',
                                        'variables',
                                        'mixins',
                                        'animations',
                                        'z-index',
                                    ]
                                        .map(
                                            ( imported ) =>
                                                `@import "~@wordpress/base-styles/${ imported }";`
                                        )
                                        .join( ' ' );
                                    return styleImports + content;
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.s?css$/,
                    exclude: /node_modules/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    includePaths: [ 'assets/css/abstracts' ],
                                },
                                // additionalData: ( content, loaderContext ) => {
                                //     const {
                                //         resourcePath,
                                //         rootContext,
                                //     } = loaderContext;
                                //     const relativePath = path.relative(
                                //         rootContext,
                                //         resourcePath
                                //     );
                                //
                                //     if (
                                //         relativePath.startsWith(
                                //             'assets/css/abstracts/'
                                //         )
                                //     ) {
                                //         return content;
                                //     }
                                //
                                //     return (
                                //         '@import "_colors"; ' +
                                //         '@import "_variables"; ' +
                                //         '@import "_breakpoints"; ' +
                                //         '@import "_mixins"; ' +
                                //         content
                                //     );
                                // },
                            },
                        },
                    ],
                },
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					loader: 'file-loader',
					options: {
						name(resourcePath, resourceQuery) {
							if (process.env.NODE_ENV === 'development') {
								return '[name].[ext]';
							}

							return '[contenthash].[ext]';
						},
						outputPath: 'images',
					},
				}
            ],
        },
        plugins: [
            new ProgressBarPlugin( { clear: false } ),
            new MiniCssExtractPlugin( {
                filename: `[name]${ fileSuffix }.css`,
            } ),
            // Remove JS files generated by MiniCssExtractPlugin.
            new RemoveFilesPlugin( `./assets/dist/*style${ fileSuffix }.js` ),
        ],
        resolve: {
            ...resolve,
            extensions: [ '.js', '.ts', '.tsx' ],
        },
    };
};

module.exports = [
    getMainConfig,
    getFrontConfig,
    getStylingConfig,
];


// // inProd?
// if ( isProduction ) {
//     exec( 'wp i18n make-pot . languages/wp-beb.pot --exclude=assets/dist' );
//     config.plugins.push( new webpack.LoaderOptionsPlugin( { minimize: true } ) );
// }
