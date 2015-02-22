
sax     = require('sax')
sprintf = require("sprintf-js").sprintf

EventEmitter = require('events').EventEmitter


class FxmlParser extends EventEmitter

  constructor: (xml_str, opts={}) ->
    @sys_config    = new SysConfig()
    @start_time_ms = @sys_config.curr_epoch_ms()
    @xml           = ('' + xml_str).toString().trim()
    @options       = opts
    @root_tag      = 'prop_set'
    @tag_stack     = []
    @paths         = []
    @end_reached   = false
    @curr_tag      = undefined
    @curr_text     = ''
    @curr_prop_id  = undefined
    @error         = undefined

    parser_opts = {} # All default to false.
    parser_opts.trim = true
    parser_opts.lowercase = true
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
        msg = sprintf("FxmlParser on opentag: %s  path: %s  depth: %s", JSON.stringify(node), p, d)
        this.log(msg)

      switch p
        when 'prop_set|prop'
          @curr_prop_id = node.attributes['id'] # raw_val is a crazy value like "\\\"24000\\\"", use RegEx to fix these values
          if @curr_prop_id
            @curr_prop_id = @curr_prop_id.replace(/\\/g, '')
            @curr_prop_id = @curr_prop_id.replace(/\"/g, '')
          if this.verbose()
            this.log('FxmlParser.startElement; curr_prop_id: ' + @curr_prop_id)
    )

    @sax_stream.on("closetag", (tag) =>
      p = this.curr_path()
      d = this.curr_depth()

      if (d == 3) and (@curr_prop_id)
        key = '' + @curr_prop_id
        @props[key] = @curr_text
        if this.verbose()
          this.log('FxmlParser on closetag; d3: ' + key)

      if d == 2
        @curr_prop_id = undefined

      @tag_stack.pop()
      @curr_tag  = undefined
      @curr_text = ''
      if tag == @root_tag
        @end_reached = true
        if this.verbose()
          this.log('FxmlParser; end root_tag encountered')
        this.finish()
    )

    @sax_stream.on("text", (text) =>
      @curr_text = @curr_text + text
      if this.verbose()
        this.log('FxmlParser on text: ' + text)
    )

    @sax_stream.on("error", (err) =>
      @error = err
      this.log('FxmlParser on error: ' + JSON.stringify(err))
      @sax_stream.error = null
      @sax_stream.resume()
      this.finish()
    )

    @sax_stream.on("end", =>
      if this.verbose()
        this.log('FxmlParser on end')
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
      IpcLogger.log(msg) if msg and (msg.length > 0)
      @log_writes = @log_writes + 1

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
