"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt = require("bcryptjs");
const hashPassword = (pass) => bcrypt.hash(pass, Number(process.env.SALT));
exports.hashPassword = hashPassword;
const comparePassword = (bodyPass, hashedPass) => bcrypt.compare(bodyPass, hashedPass);
exports.comparePassword = comparePassword;
//# sourceMappingURL=password-utils.js.map