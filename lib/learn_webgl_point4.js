/**
 * Learn_webgl_point4.js, By Wayne Brown, Fall 2015
 *
 * Learn_webgl_point3 is a set of functions that perform standard
 * operations on a 4-component point - (x, y, z, w), which are stored as
 * 4-element arrays. The data type, Float32Array, was added to JavaScript
 * specifically for GPU programming. It stores 32 bit, floating-
 * point numbers in the format required by the GPU.
 */

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 C. Wayne Brown
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var Learn_webgl_point4 = function () {

  /** ---------------------------------------------------------------------
   * @return Float32Array A new 4-component vector
   */
  this.create = function (x, y, z, w) {
    var p = new Float32Array(4);
    p[0] = 0;
    p[1] = 0;
    p[2] = 0;
    p[3] = 1;
    if (arguments.length >= 1) p[0] = x;
    if (arguments.length >= 2) p[1] = y;
    if (arguments.length >= 3) p[2] = z;
    if (arguments.length >= 4) p[3] = w;
    return p;
  };

  /** ---------------------------------------------------------------------
   * @return Float32Array A new 4-component point that has the same values as the input argument
   */
  this.createFrom = function (from) {
    var p = new Float32Array(4);
    p[0] = from[0];
    p[1] = from[1];
    p[2] = from[2];
    p[3] = from[3];
    return p;
  };

  /** ---------------------------------------------------------------------
   * to = from (copy the 2nd argument point to the first argument)
   */
  this.copy = function (to, from) {
    to[0] = from[0];
    to[1] = from[1];
    to[2] = from[2];
    to[3] = from[3];
  };

  /** ---------------------------------------------------------------------
   * @return Number The distance between 2 points
   */
  this.distanceBetween = function (p1, p2) {
    var dx = p1[0] - p2[0];
    var dy = p1[1] - p2[1];
    var dz = p1[2] - p2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  /** ---------------------------------------------------------------------
   * Normalize the point by dividing by its homogeneous coordinate w
   */
  this.normalize = function (p) {
    if (p[3] !== 0) {
      p[0] = p[0] / p[3];
      p[1] = p[1] / p[3];
      p[2] = p[2] / p[3];
      p[3] = 1;
    }
  };

  /** ---------------------------------------------------------------------
   * Print the vector on the console.
   */
  this.print = function (name, p) {
    var maximum = Math.max(p[0], p[1], p[2], p[3]);
    var order = Math.floor(Math.log(maximum) / Math.LN10 + 0.000000001);
    var digits = (order <= 0) ? 5 : (order > 5) ? 0 : (5 - order);

    console.log("Point4: " + name + ": "
        + p[0].toFixed(digits) + " "
        + p[1].toFixed(digits) + " "
        + p[2].toFixed(digits) + " "
        + p[3].toFixed(digits));
  };
};