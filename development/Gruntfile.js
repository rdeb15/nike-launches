module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // compile less into css, heavy compression with yuicompress
    less: {
      production: {
        options: {
          paths: ["src/less"],
          yuicompress: true
        },
        files: [
          {src:["src/less/style.less"], dest: "src/css/style.css"}
        ]
      }
    },
    // concatenate compiled coffeescript with any plugins or handmade js
    concat: {
      dist: {
        src: [
          'src/scripts/lib/modernizr.custom.35775.js',
          'src/scripts/bootstrap/collapse.js',
          'src/scripts/bootstrap/dropdown.js',
          'src/scripts/bootstrap/transition.js',
          'src/scripts/plugins/*.js',
          'src/scripts/script.js'

          ],
        dest: 'src/scripts/script-concat.js'
      }
    },
    // uglifiy exported scripts and move into deployable
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n'  +
        ' * <%= pkg.author %>\n */'
        // mangle: false,
        // compress: true
      },
      dist: {
        files: {
          'src/js/script.min.js': ['src/scripts/script-concat.js']
        }
      }
    },
    // compress png and jpg images
    imagemin: {
      dist: {
        options: {
            optimizationLevel: 3
        },                            
        files: [{                        
          expand: true,
          cwd: 'src/images/',
          src: '**',
          dest: 'src/img/'
        }]
      }
    },
    copy:{
      main:{
        files:[
        {expand: true, cwd: 'src/root/icons/', src: ['**'], dest:'deploy/' },        
        {expand: true, cwd: 'src/img/', src: ['**'], dest:'deploy/img/' },
        {expand: true, cwd: 'src/css/', src: ['**'], dest:'deploy/css/' },
        {expand: true, cwd: 'src/js/', src: ['**'], dest:'deploy/js/' },
        {expand: true,
          cwd: 'src/',
          src: '*.html',
          dest: 'deploy/',
          flatten: true,
          filter: 'isFile'
        },
        {expand: true, cwd: 'deploy/', src: ['**'], dest:'mac-app/app/' }
        //{expand: true, cwd: 'src/js', src: 'src/scripts/lib/modernizr-2.6.2-respond-1.1.0.min.js', dest:'src/js/' }
        ]
      }
    },
    watch: {
      html: {
        files: ['src/*.html'],
        tasks: ['imagemin', 'copy:main']
      },
      css: {
        files: ['src/less/**/*.less'],
        tasks: ['less', 'imagemin', 'copy:main']
      },
      js: {
        files: ['src/scripts/**/*.js', '! src/scripts/script-concat.js'],
        tasks: ['coffee', 'concat', 'uglify:dist', 'copy:main' ]
      },
      options: {
        livereload: true,
      }
    }
  });
  // Load the plugin that provides the "less" task.
  grunt.loadNpmTasks('grunt-contrib-less');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Load the plugin that provides the "copy" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Load teh plugin the provides the "imagemin" task.
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Load teh plugin the watch task
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('default', ['less', 'concat', 'uglify', 'imagemin', 'copy']);

  // Start the watcher
  grunt.registerTask('dev', ['watch']);

};