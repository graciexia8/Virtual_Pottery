/**
 * Learn_webgl_matrix.js, By Wayne Brown, Spring 2015
 *
 * Learn_webgl_matrix is a set of functions that perform standard operations
 * on 4x4 transformation matrices.
 *
 * The 4x4 matrices are stored in column-major order using an array of 32-bit
 * floating point numbers, which is the format required by WebGL programs.
 *
 * The functions do not create new objects because in real-time graphics,
 * creating new objects slows things down.
 *
 * Function parameters are ordered in the same order an equivalent
 * assignment statements. For example, R = A*B, has parameters (R, A, B).
 * All matrix parameters use capital letters.
 *
 * The functions are defined inside an object to prevent pollution of
 * JavaScript's global address space. The functions contain no validation
 * of parameters, which makes them more efficient at run-time.
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

// Do not perform code-formatting on this code. It destroys the matrix formatting.
//@formatter:off


/**
 * @constructor Create an instance of the Learn_webgl_matrix class
 */
var Learn_webgl_matrix = function () {

  var self = this;

  /** -----------------------------------------------------------------
   * @return Float32Array returns an uninitialized matrix.
   */
  self.create = function () {
    return new Float32Array(16);
  };

  // Temporary matrices and vectors for calculations. They are reused to
  // prevent new objects from being constantly re-created and then garbage
  // collected.
  var T1, T2, V, v3, P, p4, axis_of_rotation, u, v, n, center, eye, up;

  T1 = self.create();
  T2 = self.create();
  V = new Learn_webgl_vector3();
  v3 = V.create();
  P = new Learn_webgl_point4();
  p4 = P.create();
  axis_of_rotation = V.create();
  u = V.create();
  v = V.create();
  n = V.create();
  center = V.create();
  eye = V.create();
  up = V.create();

  this.hi = "hi";
  /** -----------------------------------------------------------------
   * M = I (identity Matrix)
   */
  self.setIdentity = function (M) {
    M[0] = 1;  M[4] = 0;  M[8] = 0;  M[12] = 0;
    M[1] = 0;  M[5] = 1;  M[9] = 0;  M[13] = 0;
    M[2] = 0;  M[6] = 0;  M[10] = 1; M[14] = 0;
    M[3] = 0;  M[7] = 0;  M[11] = 0; M[15] = 1;
  };

  /** -----------------------------------------------------------------
   * @return number Convert the input angle in degrees to radians
   */
  self.toRadians = function (angleInDegrees) {
    return angleInDegrees * 0.017453292519943295;  // Math.PI / 180
  };

  /** -----------------------------------------------------------------
   * @return number Convert the input angle in radians to degrees
   */
  self.toDegrees = function (angleInRadians) {
    return angleInRadians * 57.29577951308232;  // 180 / Math.PI
  };

  /** -----------------------------------------------------------------
   * To = From (an element-by-element copy)
   * @return To (a 16 element Float32Array)
   */
  self.copy = function (To, From) {
    var j;
    for (j = 0; j < 16; j += 1) {
      To[j] = From[j];
    }
    return To;
  };

  /** -----------------------------------------------------------------
   * R = A * B (Matrix Multiplication); NOTE: order matters!
   */
  self.multiply = function (R, A, B) {

    // A and B can't change during the operation.
    // If R is the same as A and/or B, Make copies of A and B
    // The comparison must use ==, not ===. We are comparing for identical
    // objects, not if two objects might have the same values.
    if (A == R) {
      A = self.copy(T1, A);
    }
    if (B == R) {
      B = self.copy(T2, B);
    }

    R[0]  = A[0] * B[0]  + A[4] * B[1]  + A[8]  * B[2]  + A[12] * B[3];
    R[1]  = A[1] * B[0]  + A[5] * B[1]  + A[9]  * B[2]  + A[13] * B[3];
    R[2]  = A[2] * B[0]  + A[6] * B[1]  + A[10] * B[2]  + A[14] * B[3];
    R[3]  = A[3] * B[0]  + A[7] * B[1]  + A[11] * B[2]  + A[15] * B[3];

    R[4]  = A[0] * B[4]  + A[4] * B[5]  + A[8]  * B[6]  + A[12] * B[7];
    R[5]  = A[1] * B[4]  + A[5] * B[5]  + A[9]  * B[6]  + A[13] * B[7];
    R[6]  = A[2] * B[4]  + A[6] * B[5]  + A[10] * B[6]  + A[14] * B[7];
    R[7]  = A[3] * B[4]  + A[7] * B[5]  + A[11] * B[6]  + A[15] * B[7];

    R[8]  = A[0] * B[8]  + A[4] * B[9]  + A[8]  * B[10] + A[12] * B[11];
    R[9]  = A[1] * B[8]  + A[5] * B[9]  + A[9]  * B[10] + A[13] * B[11];
    R[10] = A[2] * B[8]  + A[6] * B[9]  + A[10] * B[10] + A[14] * B[11];
    R[11] = A[3] * B[8]  + A[7] * B[9]  + A[11] * B[10] + A[15] * B[11];

    R[12] = A[0] * B[12] + A[4] * B[13] + A[8]  * B[14] + A[12] * B[15];
    R[13] = A[1] * B[12] + A[5] * B[13] + A[9]  * B[14] + A[13] * B[15];
    R[14] = A[2] * B[12] + A[6] * B[13] + A[10] * B[14] + A[14] * B[15];
    R[15] = A[3] * B[12] + A[7] * B[13] + A[11] * B[14] + A[15] * B[15];
  };

  /** -----------------------------------------------------------------
   * R = A * B * C * D ... (Matrix Multiplication); NOTE: order matters!
   */
  self.multiplySeries = function () {
    if (arguments.length >= 3) {
      self.multiply(arguments[0], arguments[1], arguments[2]);
      var j;
      for (j = 3; j < arguments.length; j += 1) {
        self.multiply(arguments[0], arguments[0], arguments[j]);
      }
    }
  };

  /** -----------------------------------------------------------------
   * r = M * v (M is a 4x4 matrix, v is a 3-component vector)
   */
  self.multiplyV3 = function (r, M, v) {

    // v can't change during the operation. If r and v are the same, make a copy of v
    if (r == v) {
      v = V.copy(v3, v);
    }

    r[0] = M[0] * v[0] + M[4] * v[1] + M[8]  * v[2];
    r[1] = M[1] * v[0] + M[5] * v[1] + M[9]  * v[2];
    r[2] = M[2] * v[0] + M[6] * v[1] + M[10] * v[2];
  };

  /** -----------------------------------------------------------------
   * r = M * p (M is a 4x4 matrix, p is a 4-component point)
   */
  self.multiplyP4 = function (r, M, p) {

    // p can't change during the operation, so make a copy of p.
    P.copy(p4, p);

    r[0] = M[0] * p4[0] + M[4] * p4[1] + M[8]  * p4[2] + M[12] * p4[3];
    r[1] = M[1] * p4[0] + M[5] * p4[1] + M[9]  * p4[2] + M[13] * p4[3];
    r[2] = M[2] * p4[0] + M[6] * p4[1] + M[10] * p4[2] + M[14] * p4[3];
    r[3] = M[3] * p4[0] + M[7] * p4[1] + M[11] * p4[2] + M[15] * p4[3];
  };

  /** -----------------------------------------------------------------
   * Console.log(name, M)
   */
  self.print = function (name, M) {
    var fieldSize = 11;
    var numText;
    var row, offset, rowText, number;
    console.log(name + ":");
    for (row = 0; row < 4; row += 1) {
      rowText = "";
      for (offset = 0; offset < 16; offset += 4) {
        number = Number(M[row + offset]);
        numText = number.toFixed(4);
        rowText += new Array(fieldSize - numText.length).join(" ") + numText;
      }
      console.log(rowText);
    }
  };

  /** -----------------------------------------------------------------
   * M = M' (transpose the matrix)
   */
  self.transpose = function (M) {
    var t;

    // The diagonal values don't move; 6 non-diagonal elements are swapped.
    t = M[1];  M[1]  = M[4];  M[4]  = t;
    t = M[2];  M[2]  = M[8];  M[8]  = t;
    t = M[3];  M[3]  = M[12]; M[12] = t;
    t = M[6];  M[6]  = M[9];  M[9]  = t;
    t = M[7];  M[7]  = M[13]; M[13] = t;
    t = M[11]; M[11] = M[14]; M[14] = t;
  };

  /** -----------------------------------------------------------------
   * Inv = M(-1) (Inv is set to the inverse of M)
   *
   */
  self.inverse = function (Inv, M) {
    /* Structure of matrix
         0   1   2   3
        ______________
     0 | 0   4   8  12
     1 | 1   5   9  13
     2 | 2   6  10  14
     3 | 3   7  11  15
    */

    // Factored out common terms
    var t9_14_13_10 = M[9] * M[14] - M[13] * M[10];
    var t13_6_5_14  = M[13] * M[6] - M[5] * M[14];
    var t5_10_9_6   = M[5] * M[10] - M[9] * M[6];
    var t12_10_8_14 = M[12] * M[10] - M[8] * M[14];
    var t4_14_12_6  = M[4] * M[14] - M[12] * M[6];
    var t8_6_4_10   = M[8] * M[6] - M[4] * M[10];
    var t8_13_12_9  = M[8] * M[13] - M[12] * M[9];
    var t12_5_4_13  = M[12] * M[5] - M[4] * M[13];
    var t4_9_8_5    = M[4] * M[9] - M[8] * M[5];
    var t1_14_13_2  = M[1] * M[14] - M[13] * M[2];
    var t9_2_1_10   = M[9] * M[2] - M[1] * M[10];
    var t12_2_0_14  = M[12] * M[2] - M[0] * M[14];
    var t0_10_8_2   = M[0] * M[10] - M[8] * M[2];
    var t0_13_12_1  = M[0] * M[13] - M[12] * M[1];
    var t8_1_0_9    = M[8] * M[1] - M[0] * M[9];
    var t1_6_5_2    = M[1] * M[6] - M[5] * M[2];
    var t4_2_0_6    = M[4] * M[2] - M[0] * M[6];
    var t0_5_4_1    = M[0] * M[5] - M[4] * M[1];

    Inv[0] = M[7] * t9_14_13_10 + M[11] * t13_6_5_14 + M[15] * t5_10_9_6;
    Inv[4] = M[7] * t12_10_8_14 + M[11] * t4_14_12_6 + M[15] * t8_6_4_10;
    Inv[8] = M[7] * t8_13_12_9 + M[11] * t12_5_4_13 + M[15] * t4_9_8_5;
    Inv[12] = M[6] * -t8_13_12_9 + M[10] * -t12_5_4_13 + M[14] * -t4_9_8_5;
    Inv[1] = M[3] * -t9_14_13_10 + M[11] * t1_14_13_2 + M[15] * t9_2_1_10;
    Inv[5] = M[3] * -t12_10_8_14 + M[11] * t12_2_0_14 + M[15] * t0_10_8_2;
    Inv[9] = M[3] * -t8_13_12_9 + M[11] * t0_13_12_1 + M[15] * t8_1_0_9;
    Inv[13] = M[2] * t8_13_12_9 + M[10] * -t0_13_12_1 + M[14] * -t8_1_0_9;
    Inv[2] = M[3] * -t13_6_5_14 + M[7] * -t1_14_13_2 + M[15] * t1_6_5_2;
    Inv[6] = M[3] * -t4_14_12_6 + M[7] * -t12_2_0_14 + M[15] * t4_2_0_6;
    Inv[10] = M[3] * -t12_5_4_13 + M[7] * -t0_13_12_1 + M[15] * t0_5_4_1;
    Inv[14] = M[2] * t12_5_4_13 + M[6] * t0_13_12_1 + M[14] * -t0_5_4_1;
    Inv[3] = M[3] * -t5_10_9_6 + M[7] * -t9_2_1_10 + M[11] * -t1_6_5_2;
    Inv[7] = M[3] * -t8_6_4_10 + M[7] * -t0_10_8_2 + M[11] * -t4_2_0_6;
    Inv[11] = M[3] * -t4_9_8_5 + M[7] * -t8_1_0_9 + M[11] * -t0_5_4_1;
    Inv[15] = M[2] * t4_9_8_5 + M[6] * t8_1_0_9 + M[10] * t0_5_4_1;

    var det;
    det =
        M[3]  * (M[6] * -t8_13_12_9 + M[10] * -t12_5_4_13 + M[14] * -t4_9_8_5) +
        M[7]  * (M[2] * t8_13_12_9  + M[10] * -t0_13_12_1 + M[14] * -t8_1_0_9) +
        M[11] * (M[2] * t12_5_4_13  + M[6] * t0_13_12_1   + M[14] * -t0_5_4_1) +
        M[15] * (M[2] * t4_9_8_5    + M[6] * t8_1_0_9     + M[10] * t0_5_4_1);

    if (det !== 0) {
      var j;
      var scale = 1 / det;
      for (j = 0; j < 16; j += 1) {
        Inv[j] = Inv[j] * scale;
      }
    }
  };

  /** -----------------------------------------------------------------
   * Create an orthographic projection matrix.
   * @param left   Number Farthest left on the x-axis
   * @param right  Number Farthest right on the x-axis
   * @param bottom Number Farthest down on the y-axis
   * @param top    Number Farthest up on the y-axis
   * @param near   Number Distance to the near clipping plane along the -Z axis
   * @param far    Number Distance to the far clipping plane along the -Z axis
   * @return Float32Array The orthographic transformation matrix
   */
  self.createOrthographic = function (left, right, bottom, top, near, far) {

    var M = this.create();

    // Make sure there is no division by zero
    if (left === right || bottom === top || near === far) {
      console.log("Invalid createOrthographic parameters");
      self.setIdentity(M);
      return M;
    }

    var widthRatio  = 1.0 / (right - left);
    var heightRatio = 1.0 / (top - bottom);
    var depthRatio  = 1.0 / (far - near);

    var sx = 2 * widthRatio;
    var sy = 2 * heightRatio;
    var sz = -2 * depthRatio;

    var tx = -(right + left) * widthRatio;
    var ty = -(top + bottom) * heightRatio;
    var tz = -(far + near) * depthRatio;

    M[0] = sx;  M[4] = 0;   M[8] = 0;   M[12] = tx;
    M[1] = 0;   M[5] = sy;  M[9] = 0;   M[13] = ty;
    M[2] = 0;   M[6] = 0;   M[10] = sz; M[14] = tz;
    M[3] = 0;   M[7] = 0;   M[11] = 0;  M[15] = 1;

    return M;
  };

  /** -----------------------------------------------------------------
   * Set a perspective projection matrix based on limits of a frustum.
   * @param left   Number Farthest left on the x-axis
   * @param right  Number Farthest right on the x-axis
   * @param bottom Number Farthest down on the y-axis
   * @param top    Number Farthest up on the y-axis
   * @param near   Number Distance to the near clipping plane along the -Z axis
   * @param far    Number Distance to the far clipping plane along the -Z axis
   * @return Float32Array A perspective transformation matrix
   */
  self.createFrustum = function (left, right, bottom, top, near, far) {

    var M = this.create();

    // Make sure there is no division by zero
    if (left === right || bottom === top || near === far) {
      console.log("Invalid createFrustum parameters");
      self.setIdentity(M);
    }
    if (near <= 0 || far <= 0) {
      console.log('For a perspective projection, the near and far distances must be positive');
      self.setIdentity(M);
    } else {

      var sx = 2 * near / (right - left);
      var sy = 2 * near / (top - bottom);

      var c2 = - (far + near) / (far - near);
      var c1 = 2 * near * far / (near - far);

      var tx = -near * (left + right) / (right - left);
      var ty = -near * (bottom + top) / (top - bottom);

      M[0] = sx; M[4] = 0;  M[8] = 0;    M[12] = tx;
      M[1] = 0;  M[5] = sy; M[9] = 0;    M[13] = ty;
      M[2] = 0;  M[6] = 0;  M[10] = c2;  M[14] = c1;
      M[3] = 0;  M[7] = 0;  M[11] = -1;  M[15] = 0;
    }

    return M;
  };

  /** -----------------------------------------------------------------
   * Set a perspective projection matrix based on limits of a frustum.
   * @param left   Number Farthest left on the x-axis
   * @param right  Number Farthest right on the x-axis
   * @param bottom Number Farthest down on the y-axis
   * @param top    Number Farthest up on the y-axis
   * @param near   Number Distance to the near clipping plane along the -Z axis
   * @param far    Number Distance to the far clipping plane along the -Z axis
   * @return Float32Array A perspective transformation matrix
   */
  self.createFrustumTextbook = function (left, right, bottom, top, near, far) {

    var M = this.create();

    // Make sure there is no division by zero
    if (left === right || bottom === top || near === far) {
      console.log("Invalid createFrustum parameters");
      self.setIdentity(M);
    }
    if (near <= 0 || far <= 0) {
      console.log('For a perspective projection, the near and far distances must be positive');
      self.setIdentity(M);
    } else {

      var sx = 2 * near / (right - left);
      var sy = 2 * near / (top - bottom);

      var A = (right + left) / (right - left);
      var B = (top + bottom) / (top - bottom);

      var c1 = -2 * near * far / (far - near);
      var c2 = - (far + near) / (far - near);

      M[0] = sx; M[4] = 0;  M[8] = A;    M[12] = 0;
      M[1] = 0;  M[5] = sy; M[9] = B;    M[13] = 0;
      M[2] = 0;  M[6] = 0;  M[10] = c2;  M[14] = c1;
      M[3] = 0;  M[7] = 0;  M[11] = -1;  M[15] = 0;
    }

    return M;
  };

  /** -----------------------------------------------------------------
   * Create a perspective projection matrix using a field-of-view and an aspect ratio.
   * @param fovy  Number The angle between the upper and lower sides of the viewing frustum.
   * @param aspect Number The aspect ratio of the view window. (width/height).
   * @param near Number  Distance to the near clipping plane along the -Z axis.
   * @param far  Number  Distance to the far clipping plane along the -Z axis.
   * @return Float32Array The perspective transformation matrix.
   */
  self.createPerspective = function (fovy, aspect, near, far) {

    var M;

    if (fovy <= 0 || fovy >= 180 || aspect <= 0 || near >= far || near <= 0) {
      console.log('Invalid parameters to createPerspective');
      self.setIdentity(M);
    } else {
      var half_fovy = self.toRadians(fovy) / 2;

      var top = near * Math.tan(half_fovy);
      var bottom = -top;
      var right = top * aspect;
      var left = -right;

      M = self.createFrustum(left, right, bottom, top, near, far);
    }

    return M;
  };

  /** -----------------------------------------------------------------
   * Set the matrix for scaling.
   * @param M The matrix to set to a scaling matrix
   * @param sx The scale factor along the x-axis
   * @param sy The scale factor along the y-axis
   * @param sz The scale factor along the z-axis
   */
  self.scale = function (M, sx, sy, sz) {
    M[0] = sx;  M[4] = 0;   M[8] = 0;   M[12] = 0;
    M[1] = 0;   M[5] = sy;  M[9] = 0;   M[13] = 0;
    M[2] = 0;   M[6] = 0;   M[10] = sz; M[14] = 0;
    M[3] = 0;   M[7] = 0;   M[11] = 0;  M[15] = 1;
  };

  /** -----------------------------------------------------------------
   * Set the matrix for translation.
   * @param M The matrix to set to a translation matrix.
   * @param dx The X value of a translation.
   * @param dy The Y value of a translation.
   * @param dz The Z value of a translation.
   */
  self.translate = function (M, dx, dy, dz) {
    M[0] = 1;  M[4] = 0;  M[8]  = 0;  M[12] = dx;
    M[1] = 0;  M[5] = 1;  M[9]  = 0;  M[13] = dy;
    M[2] = 0;  M[6] = 0;  M[10] = 1;  M[14] = dz;
    M[3] = 0;  M[7] = 0;  M[11] = 0;  M[15] = 1;
  };

  /** -----------------------------------------------------------------
   * Set the matrix to a rotation matrix. The axis of rotation axis may not be normalized.
   * @paraM angle The angle of rotation (degrees)
   * @paraM x_axis The X coordinate of axis vector for rotation.
   * @paraM y_axis The Y coordinate of axis vector for rotation.
   * @paraM z_axis The Z coordinate of axis vector for rotation.
   */
  self.rotate = function (M, angle, x_axis, y_axis, z_axis) {
    var s, c, c1, xy, yz, zx, xs, ys, zs, ux, uy, uz;

    angle = self.toRadians(angle);

    s = Math.sin(angle);
    c = Math.cos(angle);

    if (x_axis !== 0 && y_axis === 0 && z_axis === 0) {
      // Rotation around the X axis
      if (x_axis < 0) {
        s = -s;
      }

      M[0] = 1;  M[4] = 0;  M[8]  = 0;  M[12] = 0;
      M[1] = 0;  M[5] = c;  M[9]  = -s; M[13] = 0;
      M[2] = 0;  M[6] = s;  M[10] = c;  M[14] = 0;
      M[3] = 0;  M[7] = 0;  M[11] = 0;  M[15] = 1;

    } else if (x_axis === 0 && y_axis !== 0 && z_axis === 0) {
      // Rotation around Y axis
      if (y_axis < 0) {
        s = -s;
      }

      M[0] = c;  M[4] = 0;  M[8]  = s;  M[12] = 0;
      M[1] = 0;  M[5] = 1;  M[9]  = 0;  M[13] = 0;
      M[2] = -s; M[6] = 0;  M[10] = c;  M[14] = 0;
      M[3] = 0;  M[7] = 0;  M[11] = 0;  M[15] = 1;

    } else if (x_axis === 0 && y_axis === 0 && z_axis !== 0) {
      // Rotation around Z axis
      if (z_axis < 0) {
        s = -s;
      }

      M[0] = c;  M[4] = -s;  M[8]  = 0;  M[12] = 0;
      M[1] = s;  M[5] = c;   M[9]  = 0;  M[13] = 0;
      M[2] = 0;  M[6] = 0;   M[10] = 1;  M[14] = 0;
      M[3] = 0;  M[7] = 0;   M[11] = 0;  M[15] = 1;

    } else {
      // Rotation around any arbitrary axis
      axis_of_rotation[0] = x_axis;
      axis_of_rotation[1] = y_axis;
      axis_of_rotation[2] = z_axis;
      V.normalize(axis_of_rotation);
      ux = axis_of_rotation[0];
      uy = axis_of_rotation[1];
      uz = axis_of_rotation[2];

      c1 = 1 - c;

      M[0] = c + ux * ux * c1;
      M[1] = uy * ux * c1 + uz * s;
      M[2] = uz * ux * c1 - uy * s;
      M[3] = 0;

      M[4] = ux * uy * c1 - uz * s;
      M[5] = c + uy * uy * c1;
      M[6] = uz * uy * c1 + ux * s;
      M[7] = 0;

      M[8] = ux * uz * c1 + uy * s;
      M[9] = uy * uz * c1 - ux * s;
      M[10] = c + uz * uz * c1;
      M[11] = 0;

      M[12] = 0;
      M[13] = 0;
      M[14] = 0;
      M[15] = 1;
    }
  };

  /** -----------------------------------------------------------------
   * Set a camera matrix.
   * @param M Float32Array The matrix to contain the camera transformation.
   * @param eye_x Number The x component of the eye point.
   * @param eye_y Number The y component of the eye point.
   * @param eye_z Number The z component of the eye point.
   * @param center_x Number The x component of a point being looked at.
   * @param center_y Number The y component of a point being looked at.
   * @param center_z Number The z component of a point being looked at.
   * @param up_dx Number The x component of a vector in the up direction.
   * @param up_dy Number The y component of a vector in the up direction.
   * @param up_dz Number The z component of a vector in the up direction.
   */
  self.lookAt = function (M, eye_x, eye_y, eye_z, center_x, center_y, center_z, up_dx, up_dy, up_dz) {

    // Local coordinate system for the camera:
    //   u maps to the x-axis
    //   v maps to the y-axis
    //   n maps to the z-axis

    V.set(center, center_x, center_y, center_z);
    V.set(eye, eye_x, eye_y, eye_z);
    V.set(up, up_dx, up_dy, up_dz);

    V.subtract(n, eye, center);  // n = eye - center
    V.normalize(n);

    V.crossProduct(u, up, n);
    V.normalize(u);

    V.crossProduct(v, n, u);
    V.normalize(v);

    var tx = - V.dotProduct(u,eye);
    var ty = - V.dotProduct(v,eye);
    var tz = - V.dotProduct(n,eye);

    // Set the camera matrix
    M[0] = u[0];  M[4] = u[1];  M[8]  = u[2];  M[12] = tx;
    M[1] = v[0];  M[5] = v[1];  M[9]  = v[2];  M[13] = ty;
    M[2] = n[0];  M[6] = n[1];  M[10] = n[2];  M[14] = tz;
    M[3] = 0;     M[7] = 0;     M[11] = 0;     M[15] = 1;
  };
};
