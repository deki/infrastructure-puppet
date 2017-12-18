// Generated by CoffeeScript 1.9.3
var HTML, app, changePage, checkPrivacy, colorField, cuserExists, fetch, formData, formSubmitted, forms, get, isArray, isHash, lastGoodFormData, loadForm, makeWave, mk, post, postJSON, preloadFiles, preloaded, regex, renderForm, saveFile, set, submitForm, txt, urls, userExists, verifiers, verifyCONF, verifyField, verifyJIRA, verifyListname, xobj, xpage,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Number.prototype.pretty = function(fix) {
  if (fix) {
    return String(this.toFixed(fix)).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
  return String(this.toFixed(0)).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};

fetch = function(url, xstate, callback, snap, nocreds) {
  var xmlHttp;
  xmlHttp = null;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (!nocreds) {
    xmlHttp.withCredentials = true;
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
  return xmlHttp.onreadystatechange = function(state) {
    var e, response;
    if (xmlHttp.readyState === 4 && xmlHttp.status >= 200) {
      if (callback) {
        try {
          response = JSON.parse(xmlHttp.responseText);
          return callback(response, xstate);
        } catch (_error) {
          e = _error;
          return callback(null, xstate);
        }
      }
    }
  };
};

post = function(url, args, xstate, callback, snap) {
  var ar, fdata, j, k, len, v, x, xmlHttp;
  xmlHttp = null;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlHttp.withCredentials = true;
  ar = [];
  for (k in args) {
    v = args[k];
    if (isArray(v)) {
      for (j = 0, len = v.length; j < len; j++) {
        x = v[j];
        ar.push(k + "=" + encodeURIComponent(x));
      }
    } else if (v && v !== "") {
      ar.push(k + "=" + encodeURIComponent(v));
    }
  }
  fdata = ar.join("&");
  xmlHttp.open("POST", url, true);
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.send(fdata);
  return xmlHttp.onreadystatechange = function(state) {
    var e, response;
    if (xmlHttp.readyState === 4 && xmlHttp.status === 500) {
      if (snap) {
        snap(xstate);
      }
    }
    if (xmlHttp.readyState === 4 && xmlHttp.status >= 200) {
      if (callback) {
        try {
          response = JSON.parse(xmlHttp.responseText);
          return callback(response, xstate, xmlHttp.status);
        } catch (_error) {
          e = _error;
          return callback(xmlHttp.responseText, xstate, xmlHttp.status);
        }
      }
    }
  };
};

postJSON = function(url, json, xstate, callback, snap) {
  var fdata, key, val, xmlHttp;
  xmlHttp = null;
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlHttp.withCredentials = true;
  for (key in json) {
    val = json[key];
    if (val.match) {
      if (val.match(/^\d+$/)) {
        json[key] = parseInt(val);
      }
      if (val === 'true') {
        json[key] = true;
      }
      if (val === 'false') {
        json[key] = false;
      }
    }
  }
  fdata = JSON.stringify(json);
  xmlHttp.open("POST", url, true);
  xmlHttp.setRequestHeader("Content-type", "application/json");
  xmlHttp.send(fdata);
  return xmlHttp.onreadystatechange = function(state) {
    var e, response;
    if (xmlHttp.readyState === 4 && xmlHttp.status === 500) {
      if (snap) {
        snap(xstate);
      }
    }
    if (xmlHttp.readyState === 4 && xmlHttp.status >= 200) {
      if (callback) {
        try {
          response = JSON.parse(xmlHttp.responseText);
          return callback(response, xstate, xmlHttp.status);
        } catch (_error) {
          e = _error;
          return callback(xmlHttp.responseText, xstate, xmlHttp.status);
        }
      }
    }
  };
};

mk = function(t, s, tt) {
  var j, k, len, r, v;
  r = document.createElement(t);
  if (s) {
    for (k in s) {
      v = s[k];
      if (v) {
        r.setAttribute(k, v);
      }
    }
  }
  if (tt) {
    if (typeof tt === "string") {
      app(r, txt(tt));
    } else {
      if (isArray(tt)) {
        for (j = 0, len = tt.length; j < len; j++) {
          k = tt[j];
          if (typeof k === "string") {
            app(r, txt(k));
          } else {
            app(r, k);
          }
        }
      } else {
        app(r, tt);
      }
    }
  }
  return r;
};

app = function(a, b) {
  var item, j, len, results;
  if (isArray(b)) {
    results = [];
    for (j = 0, len = b.length; j < len; j++) {
      item = b[j];
      if (typeof item === "string") {
        item = txt(item);
      }
      results.push(a.appendChild(item));
    }
    return results;
  } else {
    return a.appendChild(b);
  }
};

set = function(a, b, c) {
  return a.setAttribute(b, c);
};

txt = function(a) {
  return document.createTextNode(a);
};

get = function(a) {
  return document.getElementById(a);
};

isArray = function(value) {
  return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
};


/* isHash: function to detect if an object is a hash */

isHash = function(value) {
  return value && typeof value === 'object' && !isArray(value);
};

HTML = (function() {
  function HTML(type, params, children) {

    /* create the raw element, or clone if passed an existing element */
    var child, j, key, len, subkey, subval, val;
    if (typeof type === 'object') {
      this.element = type.cloneNode();
    } else {
      this.element = document.createElement(type);
    }

    /* If params have been passed, set them */
    if (isHash(params)) {
      for (key in params) {
        val = params[key];

        /* Standard string value? */
        if (typeof val === "string" || typeof val === 'number') {
          this.element.setAttribute(key, val);
        } else if (isArray(val)) {

          /* Are we passing a list of data to set? concatenate then */
          this.element.setAttribute(key, val.join(" "));
        } else if (isHash(val)) {

          /* Are we trying to set multiple sub elements, like a style? */
          for (subkey in val) {
            subval = val[subkey];
            if (!this.element[key]) {
              throw "No such attribute, " + key + "!";
            }
            this.element[key][subkey] = subval;
          }
        }
      }
    }

    /* If any children have been passed, add them to the element */
    if (children) {

      /* If string, convert to textNode using txt() */
      if (typeof children === "string") {
        this.element.inject(txt(children));
      } else {

        /* If children is an array of elems, iterate and add */
        if (isArray(children)) {
          for (j = 0, len = children.length; j < len; j++) {
            child = children[j];

            /* String? Convert via txt() then */
            if (typeof child === "string") {
              this.element.inject(txt(child));
            } else {

              /* Plain element, add normally */
              this.element.inject(child);
            }
          }
        } else {

          /* Just a single element, add it */
          this.element.inject(children);
        }
      }
    }
    return this.element;
  }

  return HTML;

})();


/**
 * prototype injector for HTML elements:
 * Example: mydiv.inject(otherdiv)
 */

HTMLElement.prototype.inject = function(child) {
  var item, j, len;
  if (isArray(child)) {
    for (j = 0, len = child.length; j < len; j++) {
      item = child[j];
      if (typeof item === 'string') {
        item = txt(item);
      }
      this.appendChild(item);
    }
  } else {
    if (typeof child === 'string') {
      child = txt(child);
    }
    this.appendChild(child);
  }
  return child;
};

formData = {};

lastGoodFormData = {};

regex = {};

verifiers = {};

preloaded = {};

urls = {};

forms = {};

verifyJIRA = function(name) {
  if (preloaded["js/keys.json"]) {
    if (indexOf.call(preloaded["js/keys.json"], name) >= 0) {
      return name + " is already in use!";
    }
  }
};

verifyCONF = function(name) {
  if (preloaded["js/spacekeys.json"]) {
    if (indexOf.call(preloaded["js/spacekeys.json"], name) >= 0) {
      return name + " is already in use!";
    }
  }
};

userExists = function(name) {
  var request;
  request = new XMLHttpRequest();
  request.open('GET', 'cgi-bin/jirauser.cgi?username=' + name, false);
  request.send(null);
  if (request.status !== 200) {
    return request.responseText;
  }
};

cuserExists = function(name) {
  var request;
  request = new XMLHttpRequest();
  request.open('GET', 'cgi-bin/confluenceuser.cgi?username=' + name, false);
  request.send(null);
  if (request.status !== 200) {
    return request.responseText;
  }
};

checkPrivacy = function(name) {
  var ref;
  if (name === 'true' && formData['list'] && !((ref = formData['list']) === 'private' || ref === 'security')) {
    return "Only private@ and security@ may be privately archived!";
  }
};

verifyListname = function(name) {
  if (name === "" && get('form_preset').value === "") {
    return "You must pick a list name or a preset!";
  }
};

verifyField = function(e) {
  var cval, f, key, obj, rv;
  key = e.target.getAttribute('id').split('_').slice(1).join('_');
  if (regex[key] && colorField(e)) {
    return;
  }
  f = verifiers[key];
  if (!lastGoodFormData[key] || lastGoodFormData[key] !== e.target.value) {
    cval = e.target.value;
    if (e.target.getAttribute("type") === 'checkbox' && e.target.checked === false) {
      cval = null;
    }
    rv = f(cval);
    obj = get('warning_' + key);
    if (obj) {
      obj.parentNode.removeChild(obj);
    }
    if (rv) {
      e.target.parentNode.setAttribute("class", "bad");
      e.target.parentNode.parentNode.appendChild(new HTML("div", {
        id: "warning_" + key,
        "class": "warning"
      }, rv));
      return rv;
    } else if (e.target.value.length > 0) {
      e.target.parentNode.setAttribute("class", "good");
      lastGoodFormData[key] = e.target.value;
      if (typeof e.target.checked === 'boolean') {
        lastGoodFormData[key] = e.target.checked ? 'true' : null;
      }
      return false;
    } else if (e.target.parentNode.getAttribute("class") === 'bad') {
      e.target.parentNode.setAttribute("class", "");
      return false;
    }
  }
};

colorField = function(e) {
  var f, key;
  key = e.target.getAttribute('id').split('_').slice(1).join('_');
  f = regex[key];
  if (e.target.value.length > 0 && !e.target.value.match(f)) {
    e.target.parentNode.setAttribute("class", "bad");
    return true;
  } else {
    e.target.parentNode.setAttribute("class", "");
    if (e.target.value.length > 0) {
      e.target.parentNode.setAttribute("class", "good");
    }
    return false;
  }
};

xpage = 1;

xobj = null;

renderForm = function(state, page) {
  var bc, bctext, box, bpct, doc, e, el, entry, fdiv, field, form, hasMandatory, i, idiv, j, key, l, len, len1, len2, list, m, mpct, options, pages, ref, sel, tdiv, val, wpct, x, xbc;
  doc = xobj;
  doc.innerHTML = "";
  pages = forms[state.file].pages;
  if (!pages[page - 1]) {
    page = 1;
  }
  xpage = page;
  wpct = parseInt(100 / pages.length) + "%";
  bpct = "calc(" + wpct + " - 24px)";
  mpct = parseInt(100 / pages.length) / 2 + "%";
  if (pages.length > 1) {
    bc = new HTML("div", {
      "class": 'breadcrumb',
      style: {
        marginLeft: "-" + mpct
      }
    });
    bctext = new HTML("div", {
      "class": 'breadcrumb',
      style: {
        marginLeft: "-" + mpct
      }
    });
    bc.inject(new HTML('div', {
      style: {
        float: 'left',
        height: '24px',
        width: "calc(" + mpct + " - 12px)"
      }
    }, ""));
    for (i = j = 0, len = pages.length; j < len; i = ++j) {
      entry = pages[i];
      xbc = new HTML('div', {
        "class": 'bc',
        type: ((i + 1) === page ? 'selected' : null),
        onclick: "changePage(\"" + state.file + "\", " + (i + 1) + ");"
      }, String(i + 1));
      bctext.inject(new HTML('div', {
        "class": 'bctext',
        style: {
          width: wpct
        },
        onclick: "changePage(\"" + state.file + "\", " + (i + 1) + ");"
      }, entry.title));
      bc.inject(xbc);
      if (i !== (pages.length - 1)) {
        bc.inject(new HTML('div', {
          "class": 'bcsplitter',
          style: {
            width: bpct
          }
        }));
      }
    }
    doc.inject([bc, bctext]);
  }
  entry = pages[page - 1];
  form = new HTML('form');
  form.inject(new HTML('h2', {}, entry.title));
  hasMandatory = false;
  ref = entry.fields;
  for (key in ref) {
    field = ref[key];
    if (field.preload && !preloaded[field.preload]) {
      fetch(field.preload, {
        url: field.preload
      }, function(json, state) {
        return preloaded[state.url] = json;
      });
    }
    fdiv = new HTML('div', {
      style: {
        width: '100%',
        float: 'left',
        marginBottom: '16px'
      }
    });
    tdiv = new HTML('div', {
      style: {
        width: '50%',
        float: 'left'
      }
    }, field.desc + ":");
    if (field.mandatory === true) {
      tdiv.style.fontWeight = 'bold';
      hasMandatory = true;
    }
    box = new HTML('input', {
      type: 'text',
      placeholder: field.placeholder,
      id: "form_" + key,
      value: formData[key]
    });
    if (field.type === 'textarea') {
      box = new HTML('textarea', {
        placeholder: field.placeholder,
        id: "form_" + key
      }, formData[key]);
    }
    if (field.type === 'checkbox') {
      box = new HTML('input', {
        type: 'checkbox',
        value: 'true',
        id: "form_" + key,
        checked: (formData[key] && formData[key] === 'true' ? 'checked' : null)
      });
    }
    if (field.type === 'list') {
      list = [];
      options = field.options;
      if (typeof options === "string" && urls[options]) {
        options = urls[options];
      }
      if (isArray(options)) {
        for (l = 0, len1 = options.length; l < len1; l++) {
          el = options[l];
          sel = (formData[key] && formData[key] === el) || (!formData[key] && el === field["default"]) ? 'true' : null;
          x = new HTML('option', {
            value: el,
            selected: sel
          }, el);
          list.push(x);
        }
      } else if (isHash(options)) {
        for (el in options) {
          val = options[el];
          sel = (formData[key] && el === formData[key]) || (!formData[key] && el === field["default"]) ? 'true' : null;
          x = new HTML('option', {
            value: el,
            selected: sel
          }, val);
          list.push(x);
        }
      }
      box = new HTML('select', {
        id: "form_" + key
      }, list);
    }
    if (field.type === 'multilist') {
      list = [];
      options = field.options;
      if (typeof options === "string" && urls[options]) {
        options = urls[options];
      }
      if (isArray(options)) {
        for (m = 0, len2 = options.length; m < len2; m++) {
          el = options[m];
          sel = (formData[key] && indexOf.call(formData[key], el) >= 0) || (!formData[key] && el === field["default"]) ? 'true' : null;
          x = new HTML('option', {
            value: el,
            selected: sel
          }, el);
          list.push(x);
        }
      } else if (isHash(options)) {
        for (el in options) {
          val = options[el];
          sel = (formData[key] && indexOf.call(formData[key], el) >= 0) || (!formData[key] && el === field["default"]) ? 'true' : null;
          x = new HTML('option', {
            value: el,
            selected: sel
          }, val);
          list.push(x);
        }
      }
      box = new HTML('select', {
        multiple: "multiple",
        id: "form_" + key
      }, list);
    }
    idiv = new HTML('div', {
      style: {
        width: '50%',
        float: 'left'
      }
    }, box);
    if (field.type === 'checkbox' && field.placeholder) {
      idiv.inject(new HTML('span', {
        style: {
          display: 'inline-block'
        }
      }, field.placeholder));
    }
    fdiv.inject([tdiv, idiv]);
    form.inject(fdiv);
    if (!field.filter) {
      field.filter = /.*/;
    }
    if (field.verifier) {
      try {
        verifiers[key] = eval(field.verifier);
      } catch (_error) {
        e = _error;
      }
      if (verifiers[key]) {
        if (field.type === "checkbox") {
          box.addEventListener('change', verifyField);
        } else {
          box.addEventListener('blur', verifyField);
        }
        if (formData[key]) {
          verifyField({
            target: box
          });
        }
      }
    }
    if (field.filter) {
      regex[key] = field.filter;
      box.addEventListener('keyup', colorField);
      if (formData[key]) {
        colorField({
          target: box
        });
      }
    }
  }
  if (hasMandatory) {
    form.inject(new HTML('div', {
      style: {
        fontStyle: 'italic',
        fontSize: '12px'
      }
    }, "Fields in bold are mandatory"));
  }
  if (page > 1) {
    form.inject(new HTML('input', {
      style: {
        float: 'left'
      },
      type: 'button',
      value: 'Previous page',
      onclick: 'changePage("' + state.file + '", ' + (page - 1) + ');'
    }));
  }
  if (page < pages.length) {
    form.inject(new HTML('input', {
      style: {
        float: 'right'
      },
      type: 'button',
      value: 'Next page',
      onclick: 'changePage("' + state.file + '", ' + (page + 1) + ');'
    }));
  } else {
    form.inject(new HTML('input', {
      style: {
        float: 'right',
        background: '#125caa'
      },
      type: 'button',
      value: 'Submit request',
      onclick: 'submitForm("' + state.file + '");'
    }));
  }
  if (entry.footer) {
    doc.innerHTML += entry.footer;
  }
  return doc.inject(form);
};

changePage = function(form, page, norender) {
  var d, el, entry, eo, field, j, key, len, pages, ref, ref1, rv;
  pages = forms[form].pages;
  entry = pages[xpage - 1];
  ref = entry.fields;
  for (key in ref) {
    field = ref[key];
    el = get("form_" + key);
    if (el.getAttribute("type") === 'checkbox') {
      if (el.checked === true) {
        el = {
          value: 'true'
        };
      } else {
        el = {
          value: ''
        };
      }
    }
    if (page >= xpage && field.mandatory === true && el.value === "") {
      alert("Please fill in the mandatory field '" + field.desc + "'!'");
      return true;
    }
    if (page >= xpage && field.filter && !el.value.match(field.filter)) {
      alert("The field '" + field.desc + "' must match " + field.filter + "!");
      return true;
    }
    if (page >= xpage && eval(field.verifier)) {
      rv = verifyField({
        target: get("form_" + key)
      });
      if (rv) {
        alert(rv);
        return true;
      }
    }
    formData[key] = el.value;
    if (field.type === 'multilist') {
      d = [];
      ref1 = el.options;
      for (j = 0, len = ref1.length; j < len; j++) {
        eo = ref1[j];
        if (eo.selected) {
          d.push(eo.value);
        }
      }
      formData[key] = d;
    }
  }
  if (!norender) {
    return renderForm({
      file: form
    }, page);
  }
};

saveFile = function(json, state) {
  if (state && state.file) {
    urls[state.file] = json;
    forms[state.form.file].pending--;
    if (forms[state.form.file].pending === 0) {
      return renderForm(state.form, 1);
    }
  }
};

preloadFiles = function(json, state) {
  var j, len, ref, results, url;
  if (json && state) {
    forms[state.file] = json;
    if (isArray(json.preload) && json.preload.length > 0) {
      forms[state.file].pending = json.preload.length;
      urls[state.file] = json.preload;
      ref = json.preload;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        url = ref[j];
        results.push(fetch(url, {
          form: state,
          file: url
        }, saveFile));
      }
      return results;
    } else {
      return renderForm(state, 1);
    }
  }
};

loadForm = function(file, divid) {
  var obj;
  obj = get(divid);
  xobj = obj;
  if (obj) {
    obj.innerHTML = "";
    obj.appendChild(makeWave());
  }
  return fetch(file, {
    file: file,
    div: divid
  }, preloadFiles);
};

makeWave = function(text) {
  var div, i, j, parent;
  parent = new HTML('div', {
    "class": 'wave-parent'
  });
  div = new HTML('div', {
    "class": 'wavetext'
  }, text ? text : "Loading, please wait...");
  parent.appendChild(div);
  for (i = j = 1; j <= 16; i = ++j) {
    div = new HTML('div', {
      "class": 'wave'
    });
    parent.appendChild(div);
  }
  return parent;
};

formSubmitted = function(response, state, rc) {
  var form;
  xobj.innerHTML = "";
  form = new HTML('form');
  xobj.inject(form);
  if (rc === 200 || rc === 201) {
    return form.innerHTML = response;
  } else {
    form.innerHTML = response;
    return form.inject(new HTML('input', {
      style: {
        float: 'left'
      },
      type: 'button',
      value: 'Back to form',
      onclick: 'renderForm({file:"' + state.file + '"}, 1);'
    }));
  }
};

submitForm = function(file) {
  var form;
  if (!changePage(file, xpage + 1, true)) {
    xobj.innerHTML = "";
    xobj.appendChild(makeWave("Submitting request, please wait..."));
    form = forms[file];
    if (form.format && form.format.toLowerCase() === 'json') {
      return postJSON(form.posturl, formData, {
        file: file
      }, formSubmitted);
    } else {
      return post(form.posturl, formData, {
        file: file
      }, formSubmitted);
    }
  }
};
