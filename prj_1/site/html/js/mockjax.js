var strings = ['Superdry', 'Supernatural', 'Super Mario', 'Superman'];


$.mockjax({
    url:        '/autocomplete',
    type:       'GET',
    dataType:   'json',
    response:   function(settings) {
        this.responseText = strings;
    }
});
