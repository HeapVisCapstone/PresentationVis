
function *HeapGen() {
  var size = 0;
  while(true) {
    var diff = 500 - Math.ceil(Math.random() * 1000);
    size += diff
    yield size;
  }
}

function take(n, iter) {
    var values = Array.from(Array(n), iter.next, iter).map(o => o.value)
    return values
}

function namedSlice(_name, n, iter) {
    let i = iter()
    return {
        name:   _name,
        values: take(n, iter())
    }
}