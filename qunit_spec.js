/*
 * Copyright (c) 2009 sousk.net
 * Dual licensed under the MIT and GPL licenses.
 */
if (!window.log) {
 window.log = window.getLogger ? window.getLogger() : (function() {
     if (typeof(window) != "undefined" && window.console 
       && window.console.log) {
         // Safari and FireBug 0.4
         // Percent replacement is a workaround for cute Safari crashing bug
         // window.console.log(msg.replace(/%/g, '\uFF05'));
         return window.console.log;
     }
     else {
       return function() {};
     }
   })();
}

function __test() {};


function up(n) {
  return n ? _expect_countup_cn+=n : _expect_countup_cn=0;
};
var _expect_countup_cn = 0;


function not_empty(expr, msg) {
  ok(function() {
    if (! expr) {
      return false;
    }
    // has length
    else if (typeof expr['length'] == 'number') {
      return expr.length > 0;
    }
    else if (typeof expr == 'number') {
      return expr > 0;
    }
    else {
      log("got undefined type: "+ typeof expr);
      return false;
    }
  }(), msg);
};


var spec = function(object, config) {
  //----------------------------------------------------------
  // privaet members
  //----------------------------------------------------------
  var set_source_object = function(object) {
    speced._original = object;
    return this;
  };
  var source_object = function() {
    return speced._original || {};
  };
  var method_taker_of = function(sig) {
    return speced._takers[sig];
  };
  var mocked_response_of = function(sig) {
    return speced._mocked_responses[sig];
  };
  var create = function(o) {
    var F = function() {};
    F.prototype = o;
    return new F();
  };
  var verbose = (config && config.verbose) ? log : function() {};
  
  //----------------------------------------------------------
  // appending method, keep minimum not to override original one
  //----------------------------------------------------------
  var speced = create(object);
  $.extend(speced, {
    _caller: {},
    _mocked_responses: {},
    _interrupted_methods: [],
    and_return: function(response) {
      this.receiver._mocked_responses[this.sig] = response;
      return this;
    },
    and_call: function(fn) {
      this.receiver._caller[this.sig] = fn;
      return this;
    },
    with_args: function() {
      return this;
    },
    match_signiture: function() {
      return true;
    },
    should_receive: function(method_name, opts) {
      var self = this;
      var sig = method_name;
      var orig = self[method_name];
      var sig_args = {};
      if (opts && opts['with']) {
        
      }
      
      self._interrupted_methods.push(method_name); // record just as for information
      verbose('should_receive: block execution of '+method_name);
      
      // replace method
      self[method_name] = function() {
        if (self.match_signiture(method_name, arguments)) {
          return self.stub(method_name, arguments);
        }
        else {
          return orig.apply(source_object(), arguments);
        }
      };
      return {
        receiver: self,
        sig: sig,
        orig: orig,
        with_args:  self.with_args,
        and_return: self.and_return,
        and_call:   self.and_call
      };
    },
    stub: function(method_name, args) {
      var response = self = this;
      var sig = method_name;
        
      // count up for expects(n)
      ok(true, method_name+" called");
      verbose(method_name+" interrupted by 'should_receive'. fn/args is:", source_object()[method_name], args);
        
      // execute if taken orver
      var fn = self._caller[sig];
      if (fn) {
        response = fn.apply(source_object(), args);
      }
        
      var mocked_response = self._mocked_responses[sig];
      return typeof(mocked_response) == 'undefined' ? response : mocked_response;
      // return speced_method(sig, orig, self[method_name]);
    }
  });
  set_source_object(object);
  
  return speced;
};
