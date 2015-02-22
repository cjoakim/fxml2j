
sax     = require('sax')
sprintf = require("sprintf-js").sprintf

EventEmitter = require('events').EventEmitter
CounterHash  = require("counter-hash-js").CounterHash
UIComponent  = require("./ui_component").UIComponent


class FxmlParser extends EventEmitter

  constructor: (xml_str, opts={}) ->
    @xml           = ('' + xml_str).toString().trim()
    @options       = opts
    @tag_stack     = []
    @controller    = undefined
    @ui_components = []
    @component_num = 0
    @counter_hash  = new CounterHash()
    @curr_tag      = undefined
    @curr_text     = ''
    @curr_prop_id  = undefined
    @error         = undefined

    parser_opts = {} # All options default to false.
    parser_opts.trim = true
    parser_opts.lowercase = true
    @sax_stream = sax.createStream(false, parser_opts) # <-- boolean 1st arg is 'strict' flag.

  parse: =>
    @sax_stream.on("opentag", (node_obj) =>  # node_obj has "name" and "attributes"
      @tag_stack.push(node_obj.name)
      @curr_tag  = node_obj.name
      @curr_text = ''

      if node_obj.attributes['fx:controller']
        @counter_hash.increment(node_obj.name)
        @controller = node_obj.attributes['fx:controller']
        c = new UIComponent(@component_num, node_obj.name, fxid, node_obj.attributes)
        @ui_components.push(c)

      if node_obj.attributes['fx:id']
        @counter_hash.increment(node_obj.name)
        fxid = node_obj.attributes['fx:id']
        @component_num = @component_num + 1
        c = new UIComponent(@component_num, node_obj.name, fxid, node_obj.attributes)
        @ui_components.push(c)
    )

    @sax_stream.on("closetag", (tag) =>
      @tag_stack.pop()
      @curr_tag  = undefined
      @curr_text = ''
      if this.curr_depth() == 0
        this.finish()
    )

    @sax_stream.on("text", (text) =>
      @curr_text = @curr_text + text
    )

    @sax_stream.on("error", (err) =>
      @error = err
      console.log('error: ' + JSON.stringify(err))
      @sax_stream.error = null
      @sax_stream.resume()
      this.finish()
    )

    @sax_stream.on("end", =>
      this.finish()
    )
      
    if @error
      this.finish()
    else
      @sax_stream.write(@xml)

  curr_path: ->
    @tag_stack.slice(0).join('|')

  curr_full_path: ->
    @tag_stack.join('|')

  curr_depth: ->
    @tag_stack.length

  finish: =>
    event_obj = {}
    #event_obj.tags_found    = @counter_hash.sorted_tuples()
    event_obj.controller    = @controller
    event_obj.ui_components = @ui_components
    event_obj.error         = @error
    this.emit('done', event_obj)

  
root = exports ? this
root.FxmlParser = FxmlParser
