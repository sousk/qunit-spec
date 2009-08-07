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
}
