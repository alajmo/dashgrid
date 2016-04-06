
export function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

export function decorateRunAll(t, o1, o2) {
    t.all = function () {
        Object.keys(t).forEach(function (key) {
            if (key !== 'all') {t[key](o1, o2);}
        });
    };
}

export function isNumber(obj) {
    return !Array.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
}

export function isFunction(object) {
    // return object && getClass.call(object) == '[object Function]';
}

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
