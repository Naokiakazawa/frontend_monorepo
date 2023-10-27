const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * metroが監視するフォルダの一覧
 * 指定したフォルダ配下のファイルに変更が入ると、ホットリロードされる
 */
const watchFolders = [
  path.resolve(__dirname, 'node_modules'),
];

/**
 * metroが監視しないフォルダの一覧
 * 指定したフォルダ配下のファイルに変更が入っても、ホットリロードされなくなる
 * モノレポでは設定しないと、監視対象のファイルが多くなり、とても重くなる
 */
const blockList = exclusionList([
  /packages\web/,
  /packages\docs/,
  /node_modules\/@monoya\/web/,
  /node_modules\/@monoya\/docs/,
]);

module.exports = {
  projectRoot: path.join(__dirname, 'apps/mobile'),
  transformer: {
    /**
     * モノレポでAndroidが静的ファイルを読み込めるようにするための設定
     * Androidの画像のホスト先
     */
    publicPath: '/assets/dark/magic',
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    resolverMainFields: ['react-native', 'browser', 'module', 'main'],
    blockList,
  },
  watchFolders,
  /**
   * モノレポでAndroidが静的ファイルを読み込めるようにするための設定
   * metroはnodeサーバを起動してエミュレーターを動かしている
   * 画像のホスト先を変更し、特定のリクエストを書き換えることで読み込めるようになる
   * assets/dark/magicはmetroがAndroidをビルドする時の画像の出力先になっている
   */
  server: {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.startsWith('/assets/dark/magic')) {
          req.url = req.url.replace('/assets/dark/magic', '/assets');
        } else if (req.url.startsWith('/assets/dark')) {
          req.url = req.url.replace('/assets/dark', '/assets/..');
        } else if (req.url.startsWith('/assets')) {
          req.url = req.url.replace('/assets', '/assets/../..');
        }
        return middleware(req, res, next);
      };
    },
  },
};