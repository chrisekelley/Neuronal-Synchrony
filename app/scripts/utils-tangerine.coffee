window.Tangerine = {}
Tangerine.printJSON = (callback) ->
  NeuronalSynchrony.db.allDocs {include_docs: true}, (err, response) ->
    docs = []
    _.each response.rows, (row) ->
      # If you want to pre-seed users you need to remove the match check here
      if !row.id || row.id.match(/^user-/) || row.id == 'settings'
        return
      docs.push(row.doc)
    console.log(JSON.stringify(docs))

Tangerine.docs = null
Tangerine.seed = (callback) ->
#  deferred = $.Deferred()
  promises = [];
  initialDef = new $.Deferred();
  promises.push(initialDef);
  results = $.get 'importDocs/tangerine.json', (response) =>
    results = response
  .done(() ->
    Tangerine.docs = results
    initialDef.resolve(results)
    )
  return initialDef.promise();

Tangerine.insertNewBars = (response) ->
  promises = [];
  _.each response, (row) ->
    def = new $.Deferred();
    NeuronalSynchrony.db.get row._id, (err, doc) =>
      if !doc
        #NeuronalSynchrony.db.put(row, {})
#          def = new $.Deferred();
        NeuronalSynchrony.Song.create row,
          success: (model, resp) ->
            console.log("added new record to song." + row._id)
            def.resolve(row);
#              promises.push(def);
          error: (err) ->
            console.log("Error saving: " + err)
      else
        def.resolve(row);
    promises.push(def);
  return $.when.apply(undefined, promises).promise()

Tangerine.initdoc = (callback) =>
  promise = Tangerine.seed()
  promise.done(() ->
    Tangerine.insertNewBars(Tangerine.docs).done(()=>
      NeuronalSynchrony.MainMenuView.loadSequencePanel()
    )
  )
  promise.fail((msg)  ->
    console.log("Problem seeding database: " + JSON.stringify(msg)))