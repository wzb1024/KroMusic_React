const path = require("path");
const HtmlWebPackPlugin = require('html-webpack-plugin')
const htmlPlugin = new HtmlWebPackPlugin({
    template: path.join(__dirname, './src/index.html'), // 源文件
    filename: 'index.html' // 生成的内存中首页的名称
})


module.exports = {
    mode: "development",
    plugins: [
        htmlPlugin
    ],
    module: {

        rules: [

            {

                use: "babel-loader"
                ,

                test: /\.js|jsx$/,

                exclude: /node_modules/ //excludes node_modules folder from being transpiled by babel. We do this because it's a waste of resources to do so.

            },
            {
                test: /\.css$/, use: ['style-loader', 'css-loader']
            },
            {
                 test: /\.ttf|woff|woff2|eot|svg$/, use: 'url-loader'  // 打包处理 字体文件 的loader

            }

        ]

    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.vue'], // 表示，这几个文件的后缀名，可以省略不写
        alias: { // 表示别名
            '@': path.join(__dirname, './src'), // 这样，@ 就表示 项目根目录中 src 的这一层路径
            '#': path.join(__dirname,'../../')
        }
    }

}


