module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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

    uglify: {
      build: {
        src: 'js/build/production.js',
        dest: 'js/build/production.min.js'
      }
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },

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
        tasks: ['compass'],
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
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['handlebars', 'concat', 'uglify', 'compass']);
  grunt.registerTask('dev', ['connect', 'watch']);

};