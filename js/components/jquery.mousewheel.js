function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MagicScroll = /*#__PURE__*/function () {
  function MagicScroll(options) {
    var _this = this;

    _classCallCheck(this, MagicScroll);

    Object.assign(this, options);
    if (this.target === document) this.target = document.scrollingElement || document.documentElement || document.body.parentNode || document.body;
    this.speed = this.speed || 80;
    this.smooth = this.smooth || 12;
    this.pos = this.current || 0;
    this.frame = this.target === document.body && document.documentElement ? document.documentElement : this.target;
    this.min = this.min || 0;
    this.max = this.target.scrollHeight - this.target.clientHeight;
    this.moving = false;
    this.target.scrollTop = this.pos;
    this.target.addEventListener("mousewheel", scrolled, {
      passive: false
    });
    this.target.addEventListener("DOMMouseScroll", scrolled, {
      passive: false
    });
    this.target.addEventListener("scroll", function (e) {
      if (!_this.moving) {
        _this.pos = e.target.scrollTop;
      }
    }, {
      passive: false
    });
    var scope = this;

    function scrolled(e) {
      var delta = scope.normalizeWheelDelta(e);
      scope.pos += -delta * scope.speed;
      scope.pos = Math.max(0, Math.min(scope.pos, scope.max));
      console.log(scope.pos)
      if (!scope.moving) scope.update();
    }
  }

  _createClass(MagicScroll, [{
    key: "normalizeWheelDelta",
    value: function normalizeWheelDelta(e) {
      if (e.detail) {
        if (e.wheelDelta) return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1);else return -e.detail / 3;
      } else return e.wheelDelta / 120;
    }
  }, {
    key: "update",
    value: function update() {
      this.moving = true;
      var delta = (this.pos - this.target.scrollTop) / this.smooth;

      this.target.scrollTop += delta;

      if (this.onUpdate) {
        this.onUpdate(this.target.scrollTop);
      }

      var scope = this;
      if (Math.abs(delta) > 0.5) requestFrame(function () {
        scope.update();
      });else this.moving = false;
    }
  }]);

  return MagicScroll;
}();

var requestFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (func) {
    window.setTimeout(func, 1000);
  };
}();

