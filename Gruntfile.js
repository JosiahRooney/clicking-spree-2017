module.exports = (grunt) => {
  // require('load-grunt-tasks')(grunt);
  grunt.initConfig({

    eslint: {
      src: ['./src/js/game.js'],
      options: {
        configFile: 'conf/eslint.json',
        rulePaths: ['conf/rules'],
      },
    },

    // babel: {
    //   options: {
    //     sourceMap: true,
    //     presets: ['env'],
    //   },
    //   dist: {
    //     files: {
    //       'dist/js/game.js': 'src/js/game.js',
    //     },
    //   },
    // },

    stylus: {
      compile: {
        options: {
          'include css': true,
          paths: ['./src/css'],
        },
        files: {
          './dist/css/game.css': './src/css/game.styl',
        },
      },
    },

    watch: {
      scripts: {
        files: ['./src/js/**/*.js'],
        tasks: ['eslint'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      css: {
        files: './src/css/**/*.styl',
        tasks: ['stylus'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      options: {
        dateFormat(time) {
          grunt.log.writeln(`\nThe watch finished in ${time}ms at ${new Date().toString()}`);
          grunt.log.writeln('Waiting for more changes...');
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['eslint']);
};
