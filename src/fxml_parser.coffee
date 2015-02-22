
sax     = require('sax')
sprintf = require("sprintf-js").sprintf

EventEmitter = require('events').EventEmitter


class FxmlParser extends EventEmitter

  constructor: (xml_str, opts={}) ->
    @xml           = ('' + xml_str).toString().trim()
    @options       = opts
    @tag_stack     = []
    @paths         = []
    @end_reached   = false
    @curr_tag      = undefined
    @curr_text     = ''
    @curr_prop_id  = undefined
    @error         = undefined

    parser_opts = {} # All default to false.
    parser_opts.trim = true
    parser_opts.lowercase = false
    @sax_stream = sax.createStream(false, parser_opts) # <-- boolean 1st arg is 'strict' flag.

  verbose: =>
    @options.verbose

  parse: =>
    
    @sax_stream.on("opentag", (node) => # node has "name" and "attributes"
      @tag_stack.push(node.name)
      @curr_tag     = node.name
      @curr_text    = ''
      p = this.curr_path()
      d = this.curr_depth()
      if this.verbose()
        msg = sprintf("opentag: %s  path: %s  depth: %s", JSON.stringify(node), p, d)
        this.log(msg)
    )

    @sax_stream.on("closetag", (tag) =>
      p = this.curr_path()
      d = this.curr_depth()

      if this.verbose()
        this.log('closetag: ' + tag)

      @tag_stack.pop()
      @curr_tag  = undefined
      @curr_text = ''
    )

    @sax_stream.on("text", (text) =>
      @curr_text = @curr_text + text
      if this.verbose()
        this.log('text: ' + text)
    )

    @sax_stream.on("error", (err) =>
      @error = err
      this.log('error: ' + JSON.stringify(err))
      @sax_stream.error = null
      @sax_stream.resume()
      this.finish()
    )

    @sax_stream.on("end", =>
      this.log('end')
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

  log: (msg) ->
    if @options.verbose
      console.log('FxmlParser: ' + msg)

  finish: =>
    event_obj = {}
    event_obj.props = @props
    event_obj.error = @error
    event_obj.end_reached = @end_reached
    event_obj.elapsed_ms  = (@sys_config.curr_epoch_ms()) - @start_time_ms
    this.log('FxmlParser.finish: ' + JSON.stringify(event_obj))
    this.gc()
    this.emit('done', event_obj)

  
root = exports ? this
root.FxmlParser = FxmlParser
