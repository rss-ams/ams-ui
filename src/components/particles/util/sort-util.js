(function () {

    //typeof Object.defineProperty ---> function
    if (typeof Object.defineProperty === 'function') {
      try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb, writable: true }); } catch (e) { }
    }
  
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;
  
    //based on swartzian transform based function
    function sb(f) {
  
      //add the attribute values together into array
      for (var i = this.length; i;) {
        var o = this[--i];
        // console.log(o)
        // console.log(f.call(this, o))
        this[i] = [].concat(f.call(this, o), o);
      }
  
      //sort the array
      this.sort(function (a, b) {
        for (var i = 0, len = a.length; i < len; ++i) {
          if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
        }
        return 0;
      });
  
      //remove the attribi=ute values from the sorted array
      for (var j = this.length; j;) {
        this[--j] = this[j][this[j].length - 1];
      }
      //return the sorted array
      return this;
    }
  })();