//https://medium.com/@BrodaNoel/how-to-create-a-react-component-and-publish-it-in-npm-668ad7d363ce

const path = require('path');

module.exports = {
    entry: {
        actions: './src/actions.js',
        api: './src/api.js',
        constants: './src/constants.js',
        makeRequest: './src/make-request.js',
        reducer: './src/reducer.js',
        selectors: './src/selectors.js',
        normalizers: './src/normalizers',
        mimeTypes: './src/mime-types.js',
        //components
        AppSpinner: './src/components/spinner.js',
        PrivateRoute: './src/components/privateRoute.js',
        SuccessSnackbar: './src/components/successSnackbar.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'makeRequest',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-class-properties'],
                    }
                }
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
        ]
    },
    externals: {
        'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    },
};