JSAutoForm
---

JSAutoForm is a lightweight file with objects that make easier dealing with HTML form. You just need be aware of exceptions you want to have and create the form, the rest will go automatically. The data collected by the form will be returned locally, so you could preform local task or sending the data after validate it on client side.

# Usage

Before of the `</body>` tag, you get the `JSAutoForm` file and instance an `AutoForm` object, passing the id of the `div` where the form will be inserted and an anonymous function that build the form. In this example, we create a label-like with `this.create_label()` which contains a `div` with the text 'Insert your name:'. Then an input text type is created with `this.create_input(_, 'text')`, the input is inserted on the label and the whole label (including input) is inserted on the form. Finally, an anonymous function is attached to `on_submit_commit` autoform event.

```html
  <div id="my_auto_form"></div>
  <script src="/path_to/autoform.js" charset="utf-8"></script>
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

There are a few objects and methods to composite your form builder algorithm.

---

### Class `AutoForm`:

Is the root object that handles the whole form.

#### `AutoForm` methods:
##### `create_input(input_id, input_type [, ...args])`:
Returns an Input-like Object (named as `Element` in `AutoForm`) with the type specified in `input_type`. `AutoForm` saves a reference of that input with the key `input_id`. Some extra `...args` could be necesary depending of the input type.

The type can be:
* text
* number
* checkbox
* range
* select
* radio
* checkgroup

##### `create_label([labels_list, class_name])`:
Returns an `InputLabel` object. `label_list` is a strings list. Each string item in the list are displayed inside a common `div` where will be placed with inputs aswell. `class_name` is the css class of the whole `div` that contains everything that will be displayed. If you dont give any params, an empty `div` is created.

##### `create_subform(subform_id, func_parser)`:
Returns a `SubForm` object. Works like `Autoform`, but serving a way to packing some key-values (id-inputs) as value of `subform-id` key.

##### `create_mutable_select(mutable_id, mutable_options_list)`:
Returns a `FormMutableSelect`. `mutable_options_list` is a list of anonymous functions which contains form builder algorithms. 

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

### Class `Element` a.k.a. inputs:

The inputs-like objects. Those created with `created_input()` method. 
The inputs can be:
* text: returns a string.
* number: returns a number (integer or float).
* checkbox: return a boolean.
* range: return a number (integer or float).
* select: return an integer (the index selected).
* radio: return an integer (the index of selected radio. Index is given by the option list passed as `create_input` param).
* checkgroup: return a list of booleans.

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

NOTE: in radio and checkgroup types, `binding_event()` params are `({event_type[, input_index], callback})`. Because you have a list of inputs related to the object, you must specify what concrete input you want to bind the event. If is no index passed, iterates over the input list you pass at creation to bind the same callback to every input in the group. Anyway, at callback level you still can use the `Element` methods to handle inputs independently, because the bind of callback is at input level and not at group level.



