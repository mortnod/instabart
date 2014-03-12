module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Compile handlebars templates
    handlebars: {
      options: {
        namespace: 'Handlebars.templates',
        processName: function(filePath) {
          return filePath.replace(/^templates\//, '').replace(/\.handlebars$/, '');
        }
      },

      all: {
        files: {
          "js/templates.js": ["templates/*.handlebars"]
        }
      }
    },

    // Concatenate .js files
    concat: {
      dist: {
        src: [
          'js/libs/*.js',
          'js/templates.js',
          'js/card.js',
          'js/modal.js',
          'js/content.js',
          'js/schedule.js',
          'js/analytics.js',
          'js/header.js',
          'js/global.js'
        ],
        dest: 'js/build/production.js',
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
        tasks: ['concat', 'uglify'],
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

  // Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['handlebars', 'concat', 'uglify', 'sass', 'autoprefixer', 'cssmin']);
  grunt.registerTask('dev', ['connect', 'watch']);

};