module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Compile handlebars templates
    handlebars: {
      options: {
        namespace: 'Handlebars.templates',
        processName: function(filePath) {
          return filePath.replace(/^html\//, '').replace(/\.handlebars$/, '');
        }
      },

      all: {
        files: {
          "js/templates.js": ["html/*.handlebars"]
        }
      }
    },

    // Replace code snippets based on environment
    preprocess : {
      phone : {
        options : {
          context : { ENV : 'phone' }
        },
        files : {
          'index.html' : 'html/index.html',
          'js/build/processed/analytics.js' : 'js/analytics.js',
          'js/build/processed/global.js' : 'js/global.js',
          'js/build/processed/schedule.js' : 'js/schedule.js',
        }
      },
      web : {
        options : {
          context : { ENV : 'web' }
        },
        files : {
          'index.html' : 'html/index.html',
          'js/build/processed/analytics.js' : 'js/analytics.js',
          'js/build/processed/global.js' : 'js/global.js',
          'js/build/processed/schedule.js' : 'js/schedule.js',
        }
      }
    },

    // Concatenate .js files
    concat: {
      dist: {
        src: [
          'js/libs/handlebars.runtime-v1.3.0.js',
          'js/libs/jquery.leanModal.min.js',
          'js/libs/modernizr.js',
          'js/templates.js',
          'js/card.js',
          'js/modal.js',
          'js/content.js',
          'js/build/processed/schedule.js',
          'js/build/processed/analytics.js',
          'js/header.js',
          'js/alerts.js',
          'js/build/processed/global.js'
        ],
        dest: 'js/build/production.js',
      }
    },

    copy: {
      js: {
        expand: true,
        filter: 'isFile',
        cwd: 'js/libs',
        src: ['jquery-2.1.0.min.js'],
        dest: 'js/build'
      }
    },

    // Minify .js files
    uglify: {
      build: {
        src: 'js/build/production.js',
        dest: 'js/build/production.min.js'
      }
    },

    // Compile .scss files
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'css/build/compiled/global.css': 'css/global.scss',
          'css/build/compiled/ie.css': 'css/ie.scss'
        }
      }
    },

    // Add vendor prefixes to the css
    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/build/compiled/*.css',
        dest: 'css/build/prefixed/'
      }
    },

    // Minify the compiled .css file
    cssmin: {
      combine: {
        files: {
          'css/build/minified/global.css': ['css/build/prefixed/global.css'],
          'css/build/minified/ie.css': ['css/build/prefixed/ie.css'],
        }
      }
    },

    // Watch files for changes. If a file is changed, run the proper tasks
    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['js/*.js'],
        tasks: ['preprocess:web', 'concat', 'uglify'],
        options: {
          spawn: false,
        },
      },

      css: {
        files: ['css/*.scss'],
        tasks: ['sass', 'autoprefixer', 'cssmin'],
        options: {
          spawn: false,
        }
      },

      html: {
        files: ['html/*.html'],
        tasks: ['preprocess:web'],
        options: {
          spawn: false,
        }
      },

      handlebars: {
        files: ['templates/*.handlebars'],
        tasks: ['handlebars', 'concat', 'uglify'],
        options: {
          spawn: false,
        }
      }
    },

    // Starts a server (necessary for some file paths to work properly)
    connect: {
      server: {
        options: {
          port: 8000,
          base: './'
        }
      }
    }

  });

  // Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['handlebars', 'preprocess:web', 'concat', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'copy:js']);
  grunt.registerTask('phone', ['handlebars', 'preprocess:phone', 'concat', 'uglify', 'sass', 'autoprefixer', 'cssmin', 'copy:js']);
  grunt.registerTask('dev', ['connect', 'watch']);


};