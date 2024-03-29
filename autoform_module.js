'use strict';

/* Must to change a bit of things to adjust better to capabilities that export have
Currently is basically the same code as normal version

A nice change could be have a super class FormLike, and AutoForm and SubForm inherints from it*/

export class AutoForm {
  constructor(form_name, content_builder_function) {
    this.input_type_list = {
      'text': Text,
      'number': Number,
      'checkbox': Checkbox,
      'range': SimpleRange,
      'select': Select,
      'radio': RadioGroup,
      'checkboxgroup': CheckboxGroup
    }

    this.form_name = form_name;
    this.form_holder = null;
    this.form_inputs = {};
    this.submit_button = null;
    this.submit_button_label = 'Submit';
    this.cancel_button = null;
    this.cancel_button_label = 'Cancel';
    this.build_tool();
    this.content_builder = content_builder_function.bind(this);
    this.content_builder();
  }

/*############################################################################*/

  build_tool(){
    /*Creates the form holder with two divs, one for the form content and
     other for the buttons*/
    let root_holder = document.getElementById(this.form_name);

    let form_content_box = document.createElement('div');
    form_content_box.setAttribute('id', this.form_name + '_form_box');

    //save a reference as object attribute for shortcuts in other methods
    this.form_holder = form_content_box;

    let form_buttons_box = document.createElement('div');
    form_buttons_box.setAttribute('id', this.form_name + '_buttons_box');

    this.submit_button = document.createElement('button');
    this.submit_button.innerText = this.submit_button_label;
    this.cancel_button = document.createElement('button');
    this.cancel_button.innerText = this.cancel_button_label;

    this.submit_button.onclick = this.on_submit.bind(this);
    this.cancel_button.onclick = this.on_cancel.bind(this);

    form_buttons_box.appendChild(this.submit_button);
    form_buttons_box.appendChild(this.cancel_button);

    root_holder.appendChild(form_content_box);
    root_holder.appendChild(form_buttons_box);
  }

/*############################################################################*/

  set_submit_button_label(submit_label, is_default = false){
    if (is_default) {
      this.submit_button_label = submit_label;
      this.submit_button.innerText = submit_label;
    } else {
      this.submit_button.innerText = submit_label;
    }
  }

/*############################################################################*/

  set_cancel_button_label(cancel_label, is_default = false){
    if (is_default) {
      this.cancel_button_label = cancel_label;
      this.cancel_button.innerText = cancel_label;
    } else {
      this.cancel_button.innerText = cancel_label;
    }
  }

/*############################################################################
  Because the params protocol or usefulness of savin g a referemce are diferent
  according the type of form items we create, there are diferents methods to
  create those types
############################################################################*/

  create_input(input_id, input_type, ...args){
    let input = new this.input_type_list[input_type](args)
    this.form_inputs[input_id] = input;
    return input;
  }

/*############################################################################*/

  create_label(labels_list, class_name){
    return new InputLabel(labels_list, class_name);
  }

/*############################################################################*/

  create_subform(subform_id, func_parser){
    let subform = new SubForm(this.input_type_list, func_parser);
    this.form_inputs[subform_id] = subform;
    return subform;
  }

/*############################################################################*/

  create_mutable_select(mutable_id, mutable_options_list){
    let mutable_select = new FormMutableSelect(this.input_type_list, mutable_options_list);
    this.form_inputs[mutable_id] = mutable_select;
    return mutable_select;
  }

/*############################################################################*/

  insert_item(item){
    /*Element types dont have their own root div. So for consistency in css
    for those objects that are instance of Elements we build a div before append*/
    if (item.__proto__.__proto__.constructor.name === 'Element') {
      let input_holder = document.createElement('div');
      input_holder.appendChild(item.get_node());
      this.form_holder.appendChild(input_holder);
    } else {
      this.form_holder.appendChild(item.get_node());
    }
  }

/*############################################################################*/

  set_form_info(form_info){
    for (let value_index in form_info) {
      this.form_inputs[value_index].set_value(form_info[value_index]);
    }
  }

/*############################################################################*/

  on_submit(){
    /*iterate over the inputs references saved, get their values attach it to
    the id with they were saved*/
    let form_values = {};
    for (let input_key in this.form_inputs) {
      form_values[input_key] = this.form_inputs[input_key].get_value();
    }

    this.on_submit_protocol(form_values);
  }

/*############################################################################*/

  on_submit_protocol(form_values){
    /*passing throw own protocols to checks the form values before commit*/
    let exceptions;

    if (typeof this.on_submit_validation === 'function') {
       exceptions = this.on_submit_validation(form_values);
    }

    if (exceptions) {
      if (typeof this.on_submit_exception === 'function') {
        this.on_submit_exception(exceptions);
      } else {
        throw new Error(exceptions);
      }
    } else {
      this.on_submit_commit(form_values);
      this.reset_form();
    }
  }

/*############################################################################*/

  on_cancel(){
    let cancel_flag;

    /*giving a chance to avoid a failed cancelation*/
    if (typeof this.on_prepare_cancel === 'function') {
      cancel_flag = this.on_prepare_cancel();
    }

    if (!cancel_flag) {
      this.reset_form();
    }
  }

/*############################################################################*/

  reset_form(){
    this.form_items = {};
    this.form_holder.innerHTML = '';
    this.content_builder();
  }
}

/*
██╗███╗   ██╗██████╗ ██╗   ██╗████████╗
██║████╗  ██║██╔══██╗██║   ██║╚══██╔══╝
██║██╔██╗ ██║██████╔╝██║   ██║   ██║
██║██║╚██╗██║██╔═══╝ ██║   ██║   ██║
██║██║ ╚████║██║     ╚██████╔╝   ██║
╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝    ╚═╝
████████╗██╗   ██╗██████╗ ███████╗███████╗
╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝
   ██║    ╚████╔╝ ██████╔╝█████╗  ███████╗
   ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ╚════██║
   ██║      ██║   ██║     ███████╗███████║
   ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚══════╝
*/

class Element {
  constructor(type, {value_holder = 'value', is_number = false} = {}) {
    this.input_holder = (function(){
      let input = document.createElement('input');
      input.setAttribute('type', type);

      return input;
    })();
    this.value_holder = value_holder;
    if (is_number) {
      /*html form return ints as strings, so we parse it*/
      this.get_value = (function(){
        return parseInt(this.input_holder[this.value_holder]);
      }).bind(this);
    } else {
      this.get_value = (function(){
        return this.input_holder[this.value_holder];
      }).bind(this);
    }
  }

/*############################################################################*/

  get_node(){
    return this.input_holder;
  }

/*############################################################################*/

  set_value(value){
    this.input_holder[this.value_holder] = value;
  }

/*############################################################################*/

  set_attributes(attributes_json){
    for (let attr_key in attributes_json) {
      this.input_holder.setAttribute(attr_key, attributes_json[attr_key]);
    }
  }

/*############################################################################*/

  binding_event(event_name, callback){
    this.input_holder.addEventListener(event_name, callback.bind(this));
  }

}

/*############################################################################*/
/*############################################################################*/

class Text extends Element {
  constructor() {
    super('text');
  }
}

/*############################################################################*/
/*############################################################################*/

class Number extends Element {
  constructor() {
    super('number', {is_number: true});
  }
}

/*############################################################################*/
/*############################################################################*/

class Checkbox extends Element {
  constructor() {
    super('checkbox', {value_holder: 'checked'});
  }
}

/*############################################################################*/
/*############################################################################*/

class SimpleRange extends Element {
  constructor() {
    super('range', {is_number: true});
  }
}

/*############################################################################*/
/*############################################################################*/

class Select extends Element {
  constructor([options_list]) {
    super('select', {value_holder: 'selectedIndex', is_number: true});
    this.input_holder = (()=>{
      let select_holder = document.createElement('select');

      for (let option_index in options_list) {
        let option_holder = document.createElement('option');
        option_holder.innerText = options_list[option_index];

        select_holder.appendChild(option_holder);
      }

      return select_holder;
    })();
  }
}

/*############################################################################*/
/*############################################################################*/

class Radio extends Element {
  constructor() {
    super('radio', {value_holder: 'checked'});
  }
}

/*############################################################################*/
/*############################################################################*/

class CheckboxGroup{
  constructor([option_list]){
    this.input_holder = document.createElement('div');
    this.input_holder.classList.add('checkboxgroup');
    this.checkbox_items = [];

    /*we save a reference of checkbox to iterate over them when get_value is called*/

    for (let checkbox_label_index in option_list) {
      let checkbox_label;

      if (typeof option_list[checkbox_label_index] === 'string') {
        checkbox_label = new InputLabel([option_list[checkbox_label_index]]);
      } else {
        checkbox_label = option_list[checkbox_label_index];
      }

      let checkbox_input = new Checkbox();

      this.checkbox_items.push(checkbox_input);

      checkbox_label.insert_item(checkbox_input, 0);

      this.input_holder.appendChild(checkbox_label.get_node());
    }
  }

/*############################################################################*/

  get_node(){
    return this.input_holder;
  }

/*############################################################################*/

  set_attributes(attributes_json){
    for (let attr_key in attributes_json) {
      this.input_holder.setAttribute(attr_key, attributes_json[attr_key]);
    }
  }

/*############################################################################*/

  set_value(value_list){
    for (let value_index in value_list) {
      this.checkbox_items[value_index].set_value(value_list[value_index]);
    }
  }

/*############################################################################*/

  get_value(){
    let checkbox_values = [];

    for (let checkbox_index in this.checkbox_items) {
      checkbox_values.push(this.checkbox_items[checkbox_index].get_value());
    }

    return checkbox_values;
  }

/*############################################################################*/

  binding_event({event_name, checkbox_index, callback}){
    if (checkbox_index === undefined) {
      for (let checkbox in this.checkbox_items) {
        this.checkbox_items[checkbox].binding_event(event_name, callback);
      }
    } else {
      this.checkbox_items[checkbox_index].binding_event(event_name, callback);
    }
  }
}

/*############################################################################*/
/*############################################################################*/

class RadioGroup{
  constructor([group_name, option_list]) {
    this.input_holder = document.createElement('div');
    this.input_holder.classList.add('radiogroup');
    this.radio_items = [];

    for (let radio_label_index in option_list) {
      let radio_label;

      if (typeof option_list[radio_label_index] === 'string') {
        radio_label = new InputLabel([option_list[radio_label_index]]);
      } else {
        radio_label = option_list[radio_label_index];
      }

      let radio_input = new Radio();

      if (radio_label_index === '0') {
        radio_input.input_holder.checked = true;
      }

      this.radio_items.push(radio_input);

      radio_input.input_holder.setAttribute('name', group_name);

      radio_label.insert_item(radio_input, 0);

      this.input_holder.appendChild(radio_label.get_node());
    }
  }


/*############################################################################*/

  get_node(){
    return this.input_holder;
  }

/*############################################################################*/

  set_attributes(attributes_json){
    for (let attr_key in attributes_json) {
      this.input_holder.setAttribute(attr_key, attributes_json[attr_key]);
    }
  }

/*############################################################################*/

  set_value(selectedIndex){
    this.radio_items[selectedIndex].set_value(true);
  }

/*############################################################################*/

  get_value(){
    let selected_radio;

    for (let radio_index in this.radio_items) {
      if (this.radio_items[radio_index].get_value()) {
        selected_radio = radio_index;
        break;
      }
    }
    return parseInt(selected_radio);
  }

/*############################################################################*/

  binding_event({event_name, radio_index, callback}){
    if (radio_index === undefined) {
      for (let radio in this.radio_items) {
        this.radio_items[radio].binding_event(event_name, callback);
      }
    } else {
      this.radio_items[radio_index].binding_event(event_name, callback);
    }
  }
}

/*
██╗███╗   ██╗██████╗ ██╗   ██╗████████╗
██║████╗  ██║██╔══██╗██║   ██║╚══██╔══╝
██║██╔██╗ ██║██████╔╝██║   ██║   ██║
██║██║╚██╗██║██╔═══╝ ██║   ██║   ██║
██║██║ ╚████║██║     ╚██████╔╝   ██║
╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝    ╚═╝
██╗      █████╗ ██████╗ ███████╗██╗     ███████╗
██║     ██╔══██╗██╔══██╗██╔════╝██║     ██╔════╝
██║     ███████║██████╔╝█████╗  ██║     ███████╗
██║     ██╔══██║██╔══██╗██╔══╝  ██║     ╚════██║
███████╗██║  ██║██████╔╝███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚══════╝
*/

class InputLabel {
  constructor(label_text_list, class_name){
    this.label_holder = document.createElement('div');
    this.labels = [];

    if (class_name) {
      this.label_holder.classList.add(class_name);
    }

    for (let label_text_index in label_text_list) {
      let input_label = document.createElement('div');
      input_label.innerText = label_text_list[label_text_index];

      this.labels.push(input_label);

      this.label_holder.appendChild(input_label);
    }
  }

/*############################################################################*/

  get_node(){
    return this.label_holder;
  }

/*############################################################################*/

  set_attributes(attributes_json, label_index){
    /*can set attributes of some concrete label or, if the index is not given,
    set the attributes of the holder labels*/
    if (typeof(label_index) === 'undefined') {
      for (let attr_key of attributes_json) {
        this.label_holder.setAttribute(attr_key, attributes_json[attr_key]);
      }
    } else {
      for (let attr_key of attributes_json) {
        this.labels[label_index].setAttribute(attr_key, attributes_json[attr_key]);
      }
    }
  }

/*############################################################################*/

  set_text(text, label_position = 0){
    /*in case of need change the inner text at some event handler*/
    this.labels[label_position].innerText = text;
  }

/*############################################################################*/

  insert_item(input_object, position){
    if (typeof(position) === 'number') {
      this.label_holder.insertBefore(input_object.get_node(),
    this.label_holder.children[position])
    } else {
      this.label_holder.appendChild(input_object.get_node());
    }
  }
}

/*
███████╗██╗   ██╗██████╗ ███████╗ ██████╗ ██████╗ ███╗   ███╗
██╔════╝██║   ██║██╔══██╗██╔════╝██╔═══██╗██╔══██╗████╗ ████║
███████╗██║   ██║██████╔╝█████╗  ██║   ██║██████╔╝██╔████╔██║
╚════██║██║   ██║██╔══██╗██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║
███████║╚██████╔╝██████╔╝██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║
╚══════╝ ╚═════╝ ╚═════╝ ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝
*/

class SubForm {
  constructor(input_types, func_parser) {
    /*so similar to form itself, but can enclosing some values on a single "super" id*/
    this.subform_holder = document.createElement('div');
    this.subform_holder.classList.add('subform');
    this.input_type_list = input_types;
    this.form_inputs = {};
    (func_parser.bind(this))();
  }

/*############################################################################*/

  get_node(){
    return this.subform_holder;
  }

/*############################################################################*/

  set_attributes(attributes_json){
    for (let attr_key in attributes_json) {
      this.subform_holder.setAttribute(attr_key, attributes_json[attr_key]);
    }
  }

/*############################################################################*/

  create_input(input_id, input_type, ...args){
    let input = new this.input_type_list[input_type](args)
    this.form_inputs[input_id] = input;
    return input;
  }

/*############################################################################*/

  create_label(labels_list, class_name){
    return new InputLabel(labels_list, class_name);
  }

/*############################################################################*/

  create_subform(subform_id, func_parser){
    let subform = new SubForm(this.input_type_list, func_parser);
    this.form_inputs[subform_id] = subform;
    return subform;
  }

/*############################################################################*/

  create_mutable_select(mutable_id, mutable_options_list){
    let mutable_select = new FormMutableSelect(this.input_type_list, mutable_options_list);
    this.form_inputs[mutable_id] = mutable_select;
    return mutable_select;
  }

/*############################################################################*/

  insert_item(item){
    if (item.__proto__.__proto__.constructor.name === 'Element') {
      let input_holder = document.createElement('div');
      input_holder.appendChild(item.get_node());
      this.subform_holder.appendChild(input_holder);
    } else {
      this.subform_holder.appendChild(item.get_node());
    }
  }

/*############################################################################*/

  get_value(){
    let form_values = {};
    for (let input_key in this.form_inputs) {
      form_values[input_key] = this.form_inputs[input_key].get_value();
    }

    return form_values
  }

/*############################################################################*/

  set_value(values){
    for (let value_key in values) {
      this.form_inputs[value_key].set_value(values[value_key]);
    }
  }
}

/*
███╗   ███╗██╗   ██╗████████╗ █████╗ ██████╗ ██╗     ███████╗
████╗ ████║██║   ██║╚══██╔══╝██╔══██╗██╔══██╗██║     ██╔════╝
██╔████╔██║██║   ██║   ██║   ███████║██████╔╝██║     █████╗
██║╚██╔╝██║██║   ██║   ██║   ██╔══██║██╔══██╗██║     ██╔══╝
██║ ╚═╝ ██║╚██████╔╝   ██║   ██║  ██║██████╔╝███████╗███████╗
╚═╝     ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
███████╗███████╗██╗     ███████╗ ██████╗████████╗
██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝
███████╗█████╗  ██║     █████╗  ██║        ██║
╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║
███████║███████╗███████╗███████╗╚██████╗   ██║
╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝
*/

class FormMutableSelect{
  constructor(input_type_list, mutable_options_list) {

    /*Creates a select input and a div as mutable target. Preparing the select.onchange
    to clean the mutable target and fill it with the new html of the current option selected*/

    this.input_holder = document.createElement('div');
    this.input_holder.classList.add('mutable_subform');
    this.selector_holder = document.createElement('select');
    this.mutable_holder = document.createElement('div');

    this.input_holder.appendChild(this.selector_holder);
    this.input_holder.appendChild(this.mutable_holder);

    this.html_fragment_list = [];
    this.current_mutant_object = null;

    for (let option_info of mutable_options_list) {

      let option_label_holder = document.createElement('option');
      option_label_holder.innerText = option_info['option_label'];

      this.selector_holder.appendChild(option_label_holder);

      this.html_fragment_list.push(option_info['subform_builder']);
    }

    this.selector_holder.onchange = (function(){
      this.current_mutant_object = new SubForm(input_type_list,
        this.html_fragment_list[this.selector_holder.selectedIndex]);
      this.mutable_holder.innerHTML = "";
      this.mutable_holder.appendChild(this.current_mutant_object.get_node());

    }).bind(this);

    this.selector_holder.onchange();
  }

/*############################################################################*/

  get_node(){
    return this.input_holder;
  }

/*############################################################################*/

  set_attributes(attributes_json){
    for (let attr_key in attributes_json) {
      this.input_holder.setAttribute(attr_key, attributes_json[attr_key]);
    }
  }

/*############################################################################*/

  get_value(){
    return {'item_selected': parseInt(this.selector_holder.selectedIndex),
            'mutant_content': this.current_mutant_object.get_value()};
  }

/*############################################################################*/

  set_value(values){
    this.selector_holder.selectedIndex = values['item_selected'];
    this.selector_holder.onchange();
    this.current_mutant_object.set_value(values['mutant_content']);
  }
}
