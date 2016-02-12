// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (cb){
            cb = cb || function () {};
            window.setTimeout(cb, 1000 / 60);
        };
})();
