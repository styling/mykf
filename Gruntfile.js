module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: [
        //  "src/lang.js",
          "src/main.js",
          "src/loader.js",
          "src/TB.im.config.js",
          "src/TB.im.lang.js",
          "src/TB.im.message.js",
          "src/TB.im.net.js",
         "src/TB.im.js",
         "src/TB.stat.js",
         "src/TB.src.mobilewebim.log.js",
         "src/TB.src.stat.js",
         "src/TB.src.lightapp.stat.js",
         "src/TB.src.mobilewebim.webim.js"
        ],
        dest: 'static/<%= pkg.file %>.min.js'
      }
    }
  });
  // 加载提供"uglify"任务的插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // 默认任务
  grunt.registerTask('default', ['uglify']);
}