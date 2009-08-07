function qunit_spec_test() {
  var cat = {
    mew: function() {
      log('mew mew');
    },
    sings: function() {
      return this.mew();
    }
  };
  test("spec", function() {
    up();
    cat = spec(cat);
    
    expect(up(1));
    cat.should_receive('mew');
    cat.sings();
    
    expect(up(2));
    cat.should_receive('mew').and_call(function() {
      return 'nyao nyao';
    });
    equals(cat.sings(), 'nyao nyao');
    
    expect(up(2));
    cat.should_receive('mew').and_return('nyao');
    equals(cat.sings(), 'nyao');
  });

  // var cat = spec({
  //   mew: function() { log('mew mew'); },
  //   play_with: function(item_json) {
  //     log("------------");
  //     var str = "playing with " + (function() {
  //       var items = [];
  //       $.map(item_json.item, function(i, name) {
  //         items.push(name);
  //       });
  //       return items.join(",");
  //     })();
  //     log(str);
  //   }
  // });
  // 
  // var requestor = spec($);
  // 
  // //----------------------------------------------------------
  // module("should_receive");
  // //----------------------------------------------------------  
  // test("should_receive works", function() {
  //   $('#form').submit(function(evt) {
  //     cat.mew();
  //     return false;
  //   });
  //   
  //   expect(up(1));
  //   cat.should_receive('mew');
  //   $('#form').submit();
  // });
  // 
  // //----------------------------------------------------------
  // module("should_receive + ajax call");
  // //----------------------------------------------------------  
  // test("should_receive.and_return works", function() {
  //   $('#form').unbind().submit(function(evt) {
  //     requestor.getJSON('/path', cat.play_with);
  //     return false;
  //   });
  //   
  //   expect(1);
  //   requestor.should_receive('getJSON').and_return({items: ['mouse-toy', 'ball']});
  //   $('#form').submit();
  // });
  
  // test("execute request", function() {
  //   setup(); countup();
  //   bm.request_handler = spec(bm.request_handler);
  //   
  //   expect(countup(3));
  //   bm.get('name').val('hoge');
  //   bm.should_receive('query_for_request_add');
  //   bm.request_handler.should_receive('getJSON').and_return("res");
  //   equals(bm.request_add(), false); // prevent default
  // });  
}
