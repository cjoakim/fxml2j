module.exports = function (grunt) {

  var config = {

    coffee: {
      compile: {
        files: {
          'example.js':               ['src/example.coffee'],
          'lib/fxml2j.js':            ['src/fxml2j.coffee'],
          'lib/fxml_parser.js':       ['src/fxml_parser.coffee'],
          'lib/ui_component.js':      ['src/ui_component.coffee']
        }
      }
    },

    mocha_istanbul: {
      coverage: {
        src: 'test', // the folder, not the files
        options: {
          coverageFolder: 'coverage',
          mask: '**/*_test.js',
          root: '/',
          mochaOptions: { slow: 200 }
        }
      }
    }

  };

  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.registerTask('test', [ 'mocha_istanbul:coverage' ]);
  grunt.registerTask('default', [ 'coffee' ]);
};
