"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoSchema = exports.Todo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const types_1 = require("../../../types/types");
let Todo = class Todo {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Todo.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Todo.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Todo.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Todo.prototype, "completed", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        type: String,
        enum: [
            types_1.ImportantEnum.NONE,
            types_1.ImportantEnum.HIGH,
            types_1.ImportantEnum.NORMAL,
            types_1.ImportantEnum.LOW,
        ],
        default: types_1.ImportantEnum.NONE,
    })),
    __metadata("design:type", String)
], Todo.prototype, "important", void 0);
Todo = __decorate([
    (0, mongoose_1.Schema)()
], Todo);
exports.Todo = Todo;
exports.TodoSchema = mongoose_1.SchemaFactory.createForClass(Todo);
//# sourceMappingURL=todo.schema.js.map