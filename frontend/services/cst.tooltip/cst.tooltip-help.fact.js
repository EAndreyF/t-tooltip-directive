(function () {
  'use strict';

  angular
    .module('cst.tooltip')
    .factory('cstTooltipHelpFct', TooltipHelpFct);

  TooltipHelpFct.$inject = ['CANVAS_WIDTH', 'CANVAS_HEIGHT', 'BZ_HEIGHT', 'ICON_WIDTH', 'ICON_HEIGHT'];

  function TooltipHelpFct(CANVAS_WIDTH, CANVAS_HEIGHT, BZ_HEIGHT, ICON_WIDTH, ICON_HEIGHT) {
    var MIN_LEFT = ICON_WIDTH / 2;
    var CANVAS_MIN_WIDTH = ICON_WIDTH / 2;
    var CANVAS_MIN_HEIGHT = ICON_HEIGHT + BZ_HEIGHT;

    return {
      placeInBoard: placeInBoard,
      _getStyle: _getStyle,
      _getPolyPoints: _getPolyPoints,
      _setSize: _setSize,
      _checkLineIntersection: _checkLineIntersection,
      _findIntersection: _findIntersection,
      _getDiffX: _getDiffX,
      _getDiffY: _getDiffY,
      _checkAndMove: _checkAndMove,
      _sortLine: _sortLine
    };

    /**
     * Place tooltips on page
     * @param {Array}
     */
    function placeInBoard(tooltips) {
      var _this = this;
      var poly = [];
      tooltips.forEach(function (el) {
        _this._getStyle(el, el.canvas, el.icon, poly);
        poly.push(_this._getPolyPoints(el.canvas, el.icon));
      });
    }

    /**
     * Set style for current tooltip
     * @param el
     * @param canvas
     * @param icon
     * @param polys
     * @returns {boolean} - false if invisible
     * @private
     */
    function _getStyle(el, canvas, icon, polys) {
      var _this = this;

      var centerX = el.left + el.width / 2;
      var centerY = el.top + el.height / 2;
      var width = CANVAS_WIDTH;
      var height = CANVAS_HEIGHT;
      var left = centerX - CANVAS_WIDTH;
      var top = centerY - CANVAS_HEIGHT;
      var visibility = true;

      if (left < MIN_LEFT) {
        width = width - (MIN_LEFT - left);
        left = MIN_LEFT;
      }

      if (top < 0) {
        height += top;
        top = 0;
      }

      if (width < CANVAS_MIN_WIDTH || height < CANVAS_MIN_HEIGHT) {
        return canvas.visibility = false;
      }

      this._setSize({
        canvas: canvas,
        icon: icon,
        width: width,
        height: height,
        left: left,
        top: top,
        visibility: visibility
      });

      return polys.every(function (poly) {
        if (!visibility) {
          return false;
        }

        return _this._checkAndMove(poly, canvas, icon);
      });
    }

    /**
     * Check that tooltip could be places here, or move and resize it
     * @param poly
     * @param canvas
     * @param icon
     * @returns {boolean}
     * @private
     */
    function _checkAndMove(poly, canvas, icon) {
      var ps = this._getPolyPoints(canvas, icon);
      var width = canvas.widthOrg;
      var height = canvas.heightOrg;
      var top = canvas.topOrg;
      var left = canvas.leftOrg;
      var visibility = canvas.visibility;
      var changed = false;

      for (var i = 0, j = ps.length - 1; i < ps.length; j = i++) {
        var p1 = [ps[i][0], ps[i][1]];
        var p2 = [ps[j][0], ps[j][1]];
        var line = [p1, p2];
        var intersection = this._findIntersection(poly, line);
        if (intersection.intersect) {
          var line2 = intersection.line;

          // try decrease width
          var diffX = this._getDiffX(line, line2) + 1;
          if (width - diffX < CANVAS_MIN_WIDTH) {
            // try decrease height
            var diffY = this._getDiffY(line, line2) + 1;
            if (height - diffY < CANVAS_MIN_HEIGHT) {
              return visibility = false;
            } else {
              height -= diffY;
              top += diffY;
              changed = true;
              break;
            }
          } else {
            width -= diffX;
            left += diffX;
            changed = true;
            break;
          }
        }
      }

      if (changed) {
        this._setSize({
          canvas: canvas,
          icon: icon,
          width: width,
          height: height,
          left: left,
          top: top,
          visibility: visibility
        });
        return this._checkAndMove(poly, canvas, icon);
      }
      return true;
    }

    /**
     * Return points, that describe tooltip
     * @param canvas
     * @param icon
     * @returns {Array}
     * @private
     */
    function _getPolyPoints(canvas, icon) {
      return [
        [canvas.leftOrg, canvas.topOrg],
        [canvas.leftOrg + canvas.widthOrg, canvas.topOrg],
        [canvas.leftOrg + canvas.widthOrg, canvas.topOrg + canvas.heightOrg],
        [icon.leftOrg + ICON_WIDTH / 2, icon.topOrg + ICON_HEIGHT],
        [icon.leftOrg, icon.topOrg + ICON_HEIGHT],
        [icon.leftOrg, icon.topOrg]
      ];
    }

    /**
     * Set style for canvas and icon
     * @param o
     * @private
     */
    function _setSize(o) {
      o.canvas.widthOrg = o.width;
      o.canvas.heightOrg = o.height;
      o.canvas.leftOrg = o.left;
      o.canvas.topOrg = o.top;

      o.icon.leftOrg = o.canvas.leftOrg - ICON_WIDTH / 2;
      o.icon.topOrg = o.canvas.topOrg + BZ_HEIGHT - ICON_HEIGHT / 2;
      o.icon.widthOrg = ICON_WIDTH;
      o.icon.heightOrg = ICON_HEIGHT;

      o.canvas.width = o.canvas.widthOrg + 'px';
      o.canvas.height = o.canvas.heightOrg + 'px';
      o.canvas.left = o.canvas.leftOrg + 'px';
      o.canvas.top = o.canvas.topOrg + 'px';

      o.icon.left = o.icon.leftOrg + 'px';
      o.icon.top = o.icon.topOrg + 'px';
      o.icon.width = o.icon.widthOrg + 'px';
      o.icon.height = o.icon.heightOrg + 'px';

      o.canvas.visibility = o.visibility;
    }

    /**
     * Check if lines intersect
     * @param line1
     * @param line2
     * @returns {{x: null, y: null, onLine1: boolean, onLine2: boolean}}
     * @private
     */
    function _checkLineIntersection(line1, line2) {
      var line1Start = line1[0];
      var line1End = line1[1];
      var line2Start = line2[0];
      var line2End = line2[1];
      // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
      var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
      };
      denominator = ((line2End[1] - line2Start[1]) * (line1End[0] - line1Start[0]))
        - ((line2End[0] - line2Start[0]) * (line1End[1] - line1Start[1]));

      if (denominator == 0) {
        return result;
      }
      a = line1Start[1] - line2Start[1];
      b = line1Start[0] - line2Start[0];
      numerator1 = ((line2End[0] - line2Start[0]) * a) - ((line2End[1] - line2Start[1]) * b);
      numerator2 = ((line1End[0] - line1Start[0]) * a) - ((line1End[1] - line1Start[1]) * b);
      a = numerator1 / denominator;
      b = numerator2 / denominator;

      // if we cast these lines infinitely in both directions, they intersect here:
      result.x = line1Start[0] + (a * (line1End[0] - line1Start[0]));
      result.y = line1Start[1] + (a * (line1End[1] - line1Start[1]));
      /*
       // it is worth noting that this should be the same as:
       x = line2StartX + (b * (line2EndX - line2StartX));
       y = line2StartX + (b * (line2EndY - line2StartY));
       */
      // if line1 is a segment and line2 is infinite, they intersect if:
      if (a >= 0 && a <= 1) {
        result.onLine1 = true;
      }
      // if line2 is a segment and line1 is infinite, they intersect if:
      if (b >= 0 && b <= 1) {
        result.onLine2 = true;
      }
      // if line1 and line2 are segments, they intersect if both of the above are true
      return result;
    }

    /**
     * Find intersection poly and line and return it
     * @param poly
     * @param line
     * @returns {object}
     * @private
     */
    function _findIntersection(poly, line) {
      for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var p1 = [poly[i][0], poly[i][1]];
        var p2 = [poly[j][0], poly[j][1]];
        var intersection = this._checkLineIntersection([p1, p2], line);
        if (intersection.onLine1 && intersection.onLine2) {
          return {
            intersect: true,
            point: [intersection.x, intersection.y],
            line: [p1, p2]
          }
        }
      }

      return {
        intersect: false
      }
    }

    /**
     * How to change x position to not intersect line1 and line2
     * @param line1
     * @param line2
     * @returns {number|*}
     * @private
     */
    function _getDiffX(line1, line2) {
      this._sortLine(line1);
      this._sortLine(line2);
      var x1 = line1[0][0];
      var x2 = line1[1][0];
      var y1 = line1[0][1];
      var y2 = line1[1][1];

      var x3 = line2[0][0];
      var x4 = line2[1][0];
      var y3 = line2[0][1];
      var y4 = line2[1][1];

      var a, k;
      // I
      a = (y4 - y1) / (y2 - y1);
      if (0 <= a && a <= 1) {
        k = x4 - x1 - a * (x2 - x1);
        if (k >= 0) {
          return k;
        }
      }

      // II
      a = (y2 - y3) / (y4 - y3);
      if (0 <= a && a <= 1) {
        k = x3 + a * (x4 - x3) - x2;
        if (k >= 0) {
          return k;
        }
      }

      // III
      a = (y1 - y3) / (y4 - y3);
      if (0 <= a && a <= 1) {
        k = x3 + a * (x4 - x3) - x1;
        if (k >= 0) {
          return k;
        }
      }

      console.error(line1, line2);
    }

    /**
     * How to change y position to not intersect line1 and line2
     * @param line1
     * @param line2
     * @returns {number|*}
     * @private
     */
    function _getDiffY(line1, line2) {
      this._sortLine(line1);
      this._sortLine(line2);
      var y1 = line1[0][0];
      var y2 = line1[1][0];
      var x1 = line1[0][1];
      var x2 = line1[1][1];

      var y3 = line2[0][0];
      var y4 = line2[1][0];
      var x3 = line2[0][1];
      var x4 = line2[1][1];

      var a, k;
      // I
      a = (y4 - y1) / (y2 - y1);
      if (0 <= a && a <= 1) {
        k = x4 - x1 - a * (x2 - x1);
        if (k >= 0) {
          return k;
        }
      }

      // II
      a = (y2 - y3) / (y4 - y3);
      if (0 <= a && a <= 1) {
        k = x3 + a * (x4 - x3) - x2;
        if (k >= 0) {
          return k;
        }
      }

      // III
      a = (y1 - y3) / (y4 - y3);
      if (0 <= a && a <= 1) {
        k = x3 + a * (x4 - x3) - x1;
        if (k >= 0) {
          return k;
        }
      }

      console.error(line1, line2);
    }

    /**
     * Sort line points. First left top
     * @param line
     * @returns {*}
     * @private
     */
    function _sortLine(line) {
      if (line[0][0] < line[1][0]) {
        return line;
      } else if (line[0][0] > line[1][0]) {
        return line.reverse();
      } else if (line[0][1] > line[1][1]) {
        return line.reverse();
      }
      return line;
    }

  }
})();
