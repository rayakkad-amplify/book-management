this["amplify"] = this["amplify"] || {};
this["amplify"]["ui_toolkit"] = this["amplify"]["ui_toolkit"] || {};
this["amplify"]["ui_toolkit"]["templates"] = this["amplify"]["ui_toolkit"]["templates"] || {};

Handlebars.registerPartial("amplify.ui_toolkit.templates.select_option_group", Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, helper, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = self.invokePartial(partials['amplify.ui_toolkit.templates.select_option'], 'amplify.ui_toolkit.templates.select_option', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n    ";
  }

  buffer += "\n<optgroup label=\"";
  if (helper = helpers.displayText) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.displayText); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.optionGroup), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</optgroup>";
  return buffer;
  }));