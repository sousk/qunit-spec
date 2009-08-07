/*
 * Copyright (c) 2009 sousk.net
 * Dual licensed under the MIT and GPL licenses.
 */

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
  // var speced_method = function(mother, sig, orig, spec_method) {
  //   return {
  //     mother: 
  //     sig: sig,
  //     orig: orig,
  //     
  //   };
  // };
  var verbose = (config && config.verbose) ? log : function() {};
  
  var speced = $.extend({}, object, {
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
    should_receive: function(method_name) {
      var that = this;
      var sig = method_name; // will support arguments
      var orig = that[method_name];
      
      that._interrupted_methods.push(method_name);
      verbose('should_receive: block execution of '+method_name);
      that[method_name] = function() {
        var response = that;
        
        // count up for expects(n)
        ok(true, method_name+" called");
        verbose(method_name+" interrupted by 'should_receive'. fn/args is:", source_object()[method_name], arguments);
        
        // execute if taken orver
        var fn = that._caller[sig];
        if (fn) {
          response = fn.apply(source_object(), arguments);
        }
        
        var mocked_response = that._mocked_responses[sig];
        return typeof(mocked_response) == 'undefined' ? response : mocked_response;
      };
      // return speced_method(sig, orig, that[method_name]);
      return {
        receiver: that,
        sig: sig,
        orig: orig,
        and_return: that.and_return,
        and_call:   that.and_call
      };
    }
  });
  set_source_object(object);
  
  return speced;
};
