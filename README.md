JSAutoForm
---

JSAutoForm is a lightweight file with objects that make easier dealing with HTML form. You just need be aware of exceptions you want to have and create the form, the rest will go automatically. The data collected by the form will be returned locally, so you could preform local task or sending the data after validate it on client side.

* [Usage](https://github.com/AFO-UYI/JSAutoForm#usage)
  * [AutoForm class](https://github.com/AFO-UYI/JSAutoForm#autoform-class)
    * [Methods](https://github.com/AFO-UYI/JSAutoForm#autoform-methods)
      * [create_input()](https://github.com/AFO-UYI/JSAutoForm#create_inputinput_id-input_type--args)
      * [create_label()](https://github.com/AFO-UYI/JSAutoForm#create_labellabels_list-class_name)
      * [create_subform()](https://github.com/AFO-UYI/JSAutoForm#create_subformsubform_id-func_parser)
      * [create_mutable_select()](https://github.com/AFO-UYI/JSAutoForm#create_mutable_selectmutable_id-mutable_options_list)
      * [insert_item()](https://github.com/AFO-UYI/JSAutoForm#insert_itemitem)
      * [set_form_info()](https://github.com/AFO-UYI/JSAutoForm#set_form_infoform_info)
    * [Events](https://github.com/AFO-UYI/JSAutoForm#autoform-events)
      * [on_submit_commit](https://github.com/AFO-UYI/JSAutoForm#on_submit_commit)
      * [on_submit_validation](https://github.com/AFO-UYI/JSAutoForm#on_submit_validation)
      * [on_submit_exception](https://github.com/AFO-UYI/JSAutoForm#on_submit_exception)
      * [on_prepare_canel](https://github.com/AFO-UYI/JSAutoForm#on_prepare_cancel)
    * [Customization](https://github.com/AFO-UYI/JSAutoForm#autoform-customization)
      * [set_submit(cancel)_label](https://github.com/AFO-UYI/JSAutoForm#set_submit_button_labelsubmit_label-is_default-and-set_cancel_button_labelcancel_label-is_default)
  * [Element class](https://github.com/AFO-UYI/JSAutoForm#element-class-aka-inputs)
    * [Methods](https://github.com/AFO-UYI/JSAutoForm#element-methods)
      * [get_value()](https://github.com/AFO-UYI/JSAutoForm#get_value)
      * [get_node()](https://github.com/AFO-UYI/JSAutoForm#get_node)
      * [set_value()](https://github.com/AFO-UYI/JSAutoForm#set_valuevalue)
      * [set_attributes()](https://github.com/AFO-UYI/JSAutoForm#set_attributesattributes_json)
      * [binding_event()](https://github.com/AFO-UYI/JSAutoForm#binding_eventevent_type-callback)
  * [InputLabel class](https://github.com/AFO-UYI/JSAutoForm#inputlabel-class)
    * [Methods](https://github.com/AFO-UYI/JSAutoForm#inputlabel-methods)
      * [get_node()](https://github.com/AFO-UYI/JSAutoForm#get_node-1)
      * [set_attributes()](https://github.com/AFO-UYI/JSAutoForm#set_attributesattributes_json--label_index)
      * [set_text()](https://github.com/AFO-UYI/JSAutoForm#set_texttext--label_position)
      * [insert_item()](https://github.com/AFO-UYI/JSAutoForm#insert_iteminput_object--position)
  * [SubForm class](https://github.com/AFO-UYI/JSAutoForm#subform-class)
    * [Methods](https://github.com/AFO-UYI/JSAutoForm#subform-methods)
      * [get_node()](https://github.com/AFO-UYI/JSAutoForm#get_node-2)
      * [some methods shared with AutoForm methods](https://github.com/AFO-UYI/JSAutoForm#set_attributesattributes_json--create_inputinput_id-input_type-args-create_labellabels_list-class_name--create_subformsubform_id-func_parser-create_mutable_selectmutable_id-mutable_options_list-insert_itemitem)
      * [get_value()](https://github.com/AFO-UYI/JSAutoForm#get_value-1)
      * [set_value()](https://github.com/AFO-UYI/JSAutoForm#set_valuevalues)
  * [FormMutableSelect class](https://github.com/AFO-UYI/JSAutoForm#formmutableselect-class)
    * [Methods](https://github.com/AFO-UYI/JSAutoForm#formmutableselect-methods)
      * [get_node()](https://github.com/AFO-UYI/JSAutoForm#get_node-3)
      * [set_attributes()](https://github.com/AFO-UYI/JSAutoForm#set_attributesattributes_json-1)
      * [get_value()](https://github.com/AFO-UYI/JSAutoForm#get_value-2)
      * [set_value()](https://github.com/AFO-UYI/JSAutoForm#set_valuevalues-1)
* [CSS Customization](https://github.com/AFO-UYI/JSAutoForm#css-customization)
* [TO-DOs](https://github.com/AFO-UYI/JSAutoForm#to-dos)

# Usage

Before of the `</body>` tag, you get the `JSAutoForm` file and instance an `AutoForm` object, passing the id of the `div` where the form will be inserted and an anonymous function that build the form. In this example, we create a label-like with `this.create_label()` which contains a `div` with the text 'Insert your name:'. Then an input text type is created with `this.create_input(_, 'text')`, the input is inserted on the label and the whole label (including input) is inserted on the form. Finally, an anonymous function is attached to `on_submit_commit` autoform event.

```html
  <div id="my_auto_form"></div>
  <script src="/path_to/autoform.min.js" charset="utf-8"></script>
  <script type="text/javascript">
    let formulario = new AutoForm('my_auto_form',                     // AutoForm object is instanced
      function(){
        let label_name = this.create_label(['Insert your name:']);    // a label is created
        let input_name = this.create_input('name', 'text');           // an input text is created
        label_name.insert_item(input_name);                           // the input is inserted inside the label
        this.insert_item(label_name);                                 // the label is inserted inside the form
      });

      formulario.on_submit_commit = function(form_values){            // the event behaviour is defined
        console.log(JSON.stringify(form_values));
      }
  </script>
</body>
```

If you want use the module version:

```html
  <div id="my_auto_form"></div>
  <script type="module" charset="utf-8">
      import { AutoForm } from '/path_to/autoform_module.min.js';
    let formulario = new AutoForm('my_auto_form',                     // AutoForm object is instanced
      function(){
        ...     // compose your form.
```
The usage of both version are the same. But this could change for module version.

There are a few objects and methods to composite your form builder algorithm.

---

### `AutoForm` class:

Is the root object that handles the whole form.

#### `AutoForm` methods:
##### `create_input(input_id, input_type [, ...args])`:
Returns an Input-like Object (named as `Element` in `AutoForm`) with the type specified in `input_type`. `AutoForm` saves a reference of that input with the key `input_id`. Some extra `...args` could be necesary depending of the input type.

The type can be:
* text.
* number.
* checkbox.
* range.
* select (require a list of strings as extra arguments. Will be the options availables on select).
* radio (require a string and a list of strings as extra arguments. The string will be the group name for radios, and the list of strings will be the labels of those radios).
* checkboxgroup (require a list of strings as extra arguments. Will be the labels of each checkbox).

##### `create_label([labels_list, class_name])`:
Returns an `InputLabel` object. `label_list` is a strings list. Each string item in the list are displayed inside a common `div` where will be placed with inputs aswell. `class_name` is the css class of the whole `div` that contains everything that will be displayed. If you dont give any params, an empty `div` is created.

##### `create_subform(subform_id, func_parser)`:
Returns a `SubForm` object. Works like `Autoform`, but serving a way to packing some key-values (id-inputs) as value of `subform-id` key. In the body of the anonymous function passed as parameter, the keyword `this` is attached to the `SubForm` object, not to `AutoForm`.

##### `create_mutable_select(mutable_id, mutable_options_list)`:
Returns a `FormMutableSelect`. `mutable_options_list` is a list of JSONs with two keys: `{option_label, subform_builder}`. `option_label` is a string and `subform_builder` is an anonymous function which contains form builder algorithms. 
In the body of each anonymous functions, the keyword `this` is attached to a inner `SubForm` object, not to `AutoForm`.

##### `insert_item(item)`:
Append to `AutoForm` the item param. Oftenly, you will pass an `InputLabel` object, but you can pass any created object by `AutoForm`.

##### `set_form_info(form_info)`:
Will set the values of all inputs in your form. `form_info` must be a JSON with a valid structure for your form. Being aware that the keys are the same as used at creation of inputs and values are of the same type.

---

#### `AutoForm` events: 
##### `on_submit_commit`:
This is a mandatory event and must be defined always. The anonymous functions must expect a single parameter. This parameter will be a JSON. Each key of the JSON are the ids you passed on the `create_*` methods above, and values of those keys are the returned values of form inputs.

##### `on_submit_validation`:
To define this event, the anonymous function must except one parameter. Is the same JSON explained in `on_submit_commit`. You could check with keys over the JSON if the returned values are what you want. If any value is wrong, return whatever you want, if everything is ok, just dont return anything.

##### `on_submit_exception`:
In case of `on_submit_validation` return something the codeflow will call the function defined for this event. The anonymous function must expect one parameter. That parameter is the exception returned by `on_submit_validation`, so whatever exceptions could be and how exceptions must be procesed in this event, is totally defined by you.

##### `on_prepare_cancel`:
If the cancel button is clicked and you want preform something before rollback. The anonymous function dont must expect any parameter. Must return `true` in case of avoid the rollback and a falsy value to preform the rollback and clean form.

---

#### `Autoform` customization:
##### `set_submit_button_label(submit_label[, is_default])` and `set_cancel_button_label(cancel_label[, is_default])`:
Those functions set the labels of submit and cancel form buttons. By default the labels are `Submit` and `Cancel`. `submit_label` and `cancel_label` are the respective strings for the text buttons. The optional param `is_default` if is `true` will overwrite the default values of labels, if false will change the labels, but after a commit or cancel will be rewrited to the default labels. If you dont pass the `is_default` param, will preform as `false`.

---

### `Element` class a.k.a. inputs:

The inputs-like objects. Those created with `created_input()` method. 

The inputs can be: (and what return on submit)
* text: returns a string.
* number: returns a number (integer or float).
* checkbox: return a boolean.
* range: return a number (integer or float).
* select: return an integer (the index selected).
* radio: return an integer (the index of selected radio. Index is given by the option list passed as `create_input` param).
* checkboxgroup: return a list of booleans.

#### `Element` methods:
##### `get_value()`:
Returns the current value input. Is called automatically at submit event, but you can call it for binding your own events.
##### `get_node()`:
Returns the DOM Node.
##### `set_value(value)`:
Set a value for a concrete input. Is recomended call the global form function `set_form_info()` at the root object form. But if you need specify a concrete value on your own event bind, ya have this method.
##### `set_attributes(attributes_JSON)`:
Set attributes for inputs tags. E.g: `input.set_attributes({min: 0, max: 100, step: 5})` for a range input.
##### `binding_event(event_type, callback)`:
Creates an event binding for an input. Under the hood `addEventListener()` is called. The callback function is binded to the `AutoForm` `Element` object, so you must use `Element` methods on those callbacks. You also can call `get_node()` if `Element` methods dont fit your need.

NOTE: in radio and checkgroup types, `binding_event()` params are `({event_type [, input_index], callback})`. Because you have a list of inputs related to the object, you must specify what concrete input you want to bind the event. If is no index passed, iterates over the input list you pass at creation to bind the same callback to every input in the group. Anyway, at callback level you still can use the `Element` methods to handle inputs independently, because the bind of callback is at input level and not at group level.

---

### `InputLabel` class:

A holder for text messages and inputs. Can hold a few texts and inputs, not just one.

#### `InputLabel` methods:
##### `get_node()`:
Returns the DOM Node.

##### `set_attributes(attributes_JSON [, label_index])`:
According to the list passed on `AutoForm.create_label()`. If an label index is passed, will be setted the attributes of `div` that contains the text message indicated. If no label index was passed, the attributes will be setted to the global label `div` that enclose all the `div`s that contain the text messages.

##### `set_text(text [, label_position])`:
If you want change the text of some message on input event. `label_position` is the index of the message you want to change, according to the list passed on `create_label()`. If no `label_position` was passed, will be setted the text of the first item in the list.

##### `insert_item(input_object [, position])`:
For insert inputs into the global label `div`. If a `position` is given, the insertion will be at the index indicated. If no `position` is passed, will be appended to the end of the Node.

---

### `SubForm` class:

Works like the root object `AutoForm`, but is enclosing to the key with it was created on `create_subform()`. So, when submit return JSON, a subform appears as a sub JSON attached to a key of the main JSON. You must be aware that everything you want enclosed at subform returned values, must be created from the subform object and not from the root `AutoForm` object.

#### `SubForm` methods: 
##### `get_node()`:
Returns de DOM Node.

##### `set_attributes(attributes_json)`,  `create_input(input_id, input_type, ...args)`, `create_label(labels_list, class_name)`,  `create_subform(subform_id, func_parser)`, `create_mutable_select(mutable_id, mutable_options_list)`, `insert_item(item)`:
Preform the same behaviour as previously descrived on `Element` or `AutoForm` according where methods appears, just being preformed over the `SubForm` object. Is important take care from what object are you calling the `create_thing()` methods, because those items will be attached and returned from where you call it. `insert_item()` is just about where will be displayed on HTML, not about where will be the logical data structure returned by `AutoForm`.

##### `get_value()`:
Returns a JSON where the keys are the ids you passed in `create_thing()` methods, and values are the return of the inputs you create. Is like the submit of the root `AutoForm` object, but cant be submit because is not the root.

##### `set_value(values)`:
Set the values of inputs that `SubForm` contains. Must be a valid JSON structure according the inputs you create in the `SubForm`.

---

### `FormMutableSelect` class:
Create a select input. When you change the value of select, a mutable `div` is cleaned and filled with the attached subform to that selected option.

#### `FormMutableSelect` methods:
##### `get_node()`:
Returns de DOM Node.

##### `set_attributes(attributes_json)`:
Set the attributes of main `div` which contains the select tag and mutable `div`.

##### `get_value()`:
Returns a JSON with keys `{item_selected, mutant_content}`. `item_selected` is the index of selected option on `select` tag. `mutable_content` contains the JSON returned by the `SubForm` attached to the selected option.

##### `set_value(values)`:
Set the values for the `select` tag and proper `SubForm`. Values must respect the format of returned JSON by `get_value()` of `FormMutableSelect`.

# CSS Customization

Your own `div` with id passed to AutoForm object instance will contain two `div`s. One contain the form itself, and have as id `your_own_id + '_form_box'`. While the other `div` have the submit and cancel buttons with id `your_own_id + '_buttons_box'`.

`checkboxgroup`, `radio`, `subform` and `form_mutable_select` will have `checkboxgroup`, `radiogroup`, `subform` and `mutable_subform` css classes respectively.

Those ids and classes have no predefined rules. All CSS customization is yours. Eventually `AutoForm` will have all inputs with html only, so will be more customizable.

# TO-DOs:
* Clean a few redundant methods.
* Add extra input types created with pure html.
* Sustitute included input types with inputs created with pure html, improving the customization
