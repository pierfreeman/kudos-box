
this.FormTemplate = (function() {
    function FormTemplate(templ) {
        this.templ = templ;
    }

    FormTemplate.prototype.getInput = function(name) {
        return this.templ.find('[name=' + name + ']');
    };

    FormTemplate.prototype.getInputValue = function(name) {
        return this.getInput(name).val();
    };

    FormTemplate.prototype.reset = function(name) {
        return this.getInput(name).val('');
    };

    FormTemplate.prototype.resets = function() {
        var arg, _i, _len, _results,
            _this = this;
        _results = [];
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            arg = arguments[_i];
            _results.push((function(arg) {
                return _this.getInput(arg).val('');
            })(arg));
        }
        return _results;
    };

    return FormTemplate;

})();

/*
 class @FormTemplate
     constructor: (@templ) ->

 getInput: (name) ->
     @templ.find('[name=' + name + ']')

 getInputValue: (name) ->
     @getInput(name).val()

 reset: (name) ->
     @getInput(name).val('')

 resets: () ->
     for arg in arguments then do (arg) =>
         @getInput(arg).val('')

 */