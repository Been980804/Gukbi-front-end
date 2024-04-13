const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({

  transpileDependencies: true,

  outputDir: "../bookply-backend/src/main/resources/static",

  devServer: {
    proxy: {
      '/' : {
        target: "http://localhost:8080",
        pathRewrite: {'^/':''},
        changeOrigin: true,
        ws: false, // 웹 소켓 실행 끔
      }
    }
  },
  
  // 컴파일 타임 플래그 설정
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
})
