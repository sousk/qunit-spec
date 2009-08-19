function test_qunit_spec() {
  var cat = {
    mew: function() {
      log('mew mew');
    },
    sings: function() {
      return this.mew();
    }
  };
  
  //----------------------------------------------------------
  module("spec/receive");
  //----------------------------------------------------------
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

  // //----------------------------------------------------------
  // module("receive/with");
  // //----------------------------------------------------------
  // var master = {
  //   members: {foo: {type: 'A'}},
  //   get_member: function(id) {
  //     return this.members[id];
  //   },
  //   get_member_type: function(id) {
  //     var mem = this.get_member(id);
  //     return mem ? "type:"+mem.type : null;
  //   }
  // };
  // test("should_receive.with", function() {
  //   var obj = spec(master);
  //   obj.should_receive('get_member', {'with': 'foo'}).and_return({
  //     type: "X"
  //   });
  //   equals(obj.get_member_type('foo'), "type:typeX");
  // });
}
