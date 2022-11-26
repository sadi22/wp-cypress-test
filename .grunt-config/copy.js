/**
 * Grunt copy task config
 * @package MRM
 */
const getBuildFiles = [
    '**',
    '!.git/**',
    '!.github/**',
    '!.gitignore',
    '!.gitmodules',
    '!.jscsrc',
    '!karma.conf.js',
    '!.jshintignore',
    '!.jshintrc',
    '!.travis.yml',
    '!assets/**/*.map',
    '!node_modules/**',
    '!app/Internal/FormBuilder/node_modules/**',
    '!app/Internal/FormBuilder/blocks/node_modules/**',
    '!bin/**',
    '!packages/**',
    '!src/**',
    '!tests',
    '!tmp',
    '!npm-debug.log',
    '!package-lock.json',
    '!package.json',
    '!phpunit.xml',
    '!CHANGELOG.md',
    '!README.md',
    '!phpcs.xml',
    '!tests/**',
    '!test-results/',
    '!tmp/**',
    '!yarn.lock',
    '!yarn-error.log',
    '!composer.lock',
    '!docker-compose.yml',
    '!Dockerfile',
    '!Gruntfile.js',
    '!Gruntfile.js',
    '!phpunit.xml.dist',
    '!tsconfig.json',
    '!webpack.common.js',
    '!webpack.config.js',
    '!webpack.dev.js',
    '!webpack.prod.js',
    '!*~',
];
/**
 * @type {{main: {src: string[], expand: boolean, dest: string}, secondary: {src: string[], expand: boolean, dest: string}}}
 */
const copy = {
    main: {
        src: getBuildFiles,
        expand: true,
        dest: 'build/'
    },
    secondary: {
        src: getBuildFiles,
        expand: true,
        dest: '/tmp/mrm-builds/<%= pkg.version %>/'
    }
};

module.exports = copy;