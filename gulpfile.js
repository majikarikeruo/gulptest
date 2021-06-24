const gulp = require("gulp");
// Sassをコンパイルするプラグインを読み込みます
const sass = require("gulp-sass");
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const imageminGif = require('imagemin-gifsicle');
const imageminSvg = require('imagemin-svgo');


/**
 * Sassをコンパイルするタスクです
 */
const compileSass = () =>
  // style.scssファイルを取得
  gulp.src("css/style.scss")
    // Sassのコンパイルを実行
    .pipe(
      // コンパイル後のCSSを展開
      sass({
        outputStyle: "expanded"
      })
    )
    // cssフォルダー以下に保存
    .pipe(gulp.dest("dist/css"));





const paths = {
    srcDir: '.',
    dstDir: './dist'
}

// 画像を格納しているフォルダのパス
const srcGlob = paths.srcDir + '/images';
const dstGlob = paths.dstDir + '/images';


/**
 * 画像の変換
 */
const imageMin = () => {
  return (
      // 参照するフォルダのパスを記述する
      gulp.src(srcGlob + '/**/*.+(jpg|jpeg|png|gif|svg)')
          .pipe(imagemin([
              // pngの圧縮
              pngquant({
                  quality: [0.6, 0.8]
              }),
              // jpgの圧縮
              mozjpeg({
                  quality: 85,
                  progressive: true
              }),
              // gifの圧縮
              imageminGif({
                  interlaced: false,
                  optimizationLevel: 3,
                  colors: 180
              }),
              // SVGの圧縮
              imageminSvg()
          ]
          ))
          // 圧縮したファイルの吐き出し先のパス
          .pipe(gulp.dest(dstGlob))
  );
}

/**
 * ファイルを監視し、変更があったらSassを変換します
 */
const watchFile = ()=> {
  gulp.watch(srcGlob + '/**/*.+(jpg|jpeg|png|gif|svg)', imageMin);
  gulp.watch("css/style.scss", compileSass);
}

// npx gulpというコマンドを実行した時、watch系のタスクが実行されるようにします
exports.default = gulp.series(imageMin, watchFile);