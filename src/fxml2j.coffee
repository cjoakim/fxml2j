
EventEmitter = require('events').EventEmitter


class Fxml2j extends EventEmitter

  constructor: (opts={}) ->
    @finish_obj = {}

  parse: ->
    @finish_obj.message = 'Not implemented yet'
    this.finish()

  finish: =>
    this.emit('done', @finish_obj)


root = exports ? this
root.Fxml2j = Fxml2j
