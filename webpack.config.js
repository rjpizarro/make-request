//https://medium.com/@BrodaNoel/how-to-create-a-react-component-and-publish-it-in-npm-668ad7d363ce
const dotProp = require('dot-prop-immutable');
const path = require('path');

const common = 'common';
const makeRequestWeb = 'make-request-web';
const makeRequestMobile = 'make-request-mobile';

const defaultConfig = {
    entry: {
        actions: `./src/${common}/actions.js`,
        constants: `./src/${common}/constants.js`,
        makeRequest: `./src/${common}/make-request.js`,
        reducer: `./src/${common}/reducer.js`,
        selectors: `./src/${common}/selectors.js`,
        normalizers: `./src/${common}/normalizers`,
        mimeTypes: `./src/${common}/mime-types.js`,
        //hocs
        withMakeRequestProps: `./src/${common}/hocs/withMakeRequestProps.js`,
        withServiceIsLoading: `./src/${common}/hocs/withServiceIsLoading.js`,
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
        ]
    },
    externals: {
        'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    },
};
const _generateWebBundleConfig = (config) => {
    config = dotProp.set(config, 'output.path', path.resolve(`${__dirname}/src/${makeRequestWeb}`, 'dist'));
    config = dotProp.set(
        config,
        'module.rules',
        [
            ...config.module.rules,
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
        ]
    );
    config = dotProp.set(config, 'entry', Object.assign({}, config.entry, {
            Api: `./src/${makeRequestWeb}/ApiWeb.js`,
            FirebaseApi: `./src/${makeRequestWeb}/FirebaseWebApi.js`,
            //components
            AppSpinner: `./src/${makeRequestWeb}/components/spinner.js`,
            PrivateRoute: `./src/${makeRequestWeb}/components/privateRoute.js`,
            SuccessSnackbar: `./src/${makeRequestWeb}/components/successSnackbar.js`,
            ErrorMessage: `./src/${makeRequestWeb}/components/error-message.js`,
            LoadingButton: `./src/${makeRequestWeb}/components/loading-button.js`,
            //hocs
            withSpinner: `./src/${makeRequestWeb}/hocs/withSpinner.js`,
            withCustomRequestSpinner: `./src/${makeRequestWeb}/hocs/withCustomRequestSpinner.js`,
    }));

    return config
};

const _generateMobileBundleConfig = (config) => {
    config = dotProp.set(config, 'output.path', path.resolve(`${__dirname}/src/${makeRequestMobile}`, 'dist'));
    config = dotProp.set(config, 'externals', {
            'react-native': 'react-native'
    });
    config = dotProp.set(config, 'entry', Object.assign({}, config.entry, {
        Api: `./src/${makeRequestMobile}/ApiMobile.js`,
    }));

    return config
};

const webBundle = _generateWebBundleConfig(defaultConfig);
const mobileBundle = _generateMobileBundleConfig(defaultConfig);

module.exports = [
    webBundle,
    mobileBundle,
];