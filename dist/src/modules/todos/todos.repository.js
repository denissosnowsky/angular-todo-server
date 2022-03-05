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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosRepository = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const todo_schema_1 = require("./schemas/todo.schema");
const completeConvert_1 = require("../../utils/completeConvert");
let TodosRepository = class TodosRepository {
    constructor(todoModel, configService) {
        this.todoModel = todoModel;
        this.configService = configService;
        this.findTodosByCompelteAndImportant = async (userId, complete, important, limit, skip) => {
            return limit
                ? await this.todoModel
                    .find()
                    .where({
                    userId,
                    completed: (0, completeConvert_1.completeConvert)(complete),
                    important: important,
                })
                    .limit(limit)
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 })
                : await this.todoModel
                    .find()
                    .where({
                    userId,
                    completed: (0, completeConvert_1.completeConvert)(complete),
                    important: important,
                })
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 });
        };
        this.findTodosByComplete = async (userId, complete, limit, skip) => {
            return limit
                ? await this.todoModel
                    .find()
                    .where({
                    userId,
                    completed: (0, completeConvert_1.completeConvert)(complete),
                })
                    .limit(limit)
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 })
                : await this.todoModel
                    .find()
                    .where({
                    userId,
                    completed: (0, completeConvert_1.completeConvert)(complete),
                })
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 });
        };
        this.findTodosByImportant = async (userId, important, limit, skip) => {
            return limit
                ? await this.todoModel
                    .find()
                    .where({ userId, important: important })
                    .limit(limit)
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 })
                : await this.todoModel
                    .find()
                    .where({ userId, important: important })
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 });
        };
        this.findAllTodos = async (userId, limit, skip) => {
            return limit
                ? await this.todoModel
                    .find()
                    .where({ userId })
                    .limit(limit)
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 })
                : await this.todoModel
                    .find()
                    .where({ userId })
                    .skip(skip ? skip : 0)
                    .sort({ id: -1 });
        };
        this.getTodosCountByCompelteAndImportant = async (userId, complete, important) => {
            return await this.todoModel
                .where({
                userId,
                completed: (0, completeConvert_1.completeConvert)(complete),
                important: important,
            })
                .count();
        };
        this.getTodosCountByCompelte = async (userId, complete) => {
            return await this.todoModel
                .where({
                userId,
                completed: (0, completeConvert_1.completeConvert)(complete),
            })
                .count();
        };
        this.getTodosCountByImportant = async (userId, important) => {
            return await this.todoModel
                .where({
                userId,
                important: important,
            })
                .count();
        };
    }
    async findTodos(userId, limit, skip, complete, important) {
        let todos;
        if (complete && important) {
            todos = await this.findTodosByCompelteAndImportant(userId, complete, important, limit, skip);
        }
        if (complete && !important) {
            todos = await this.findTodosByComplete(userId, complete, limit, skip);
        }
        if (important && !complete) {
            todos = await this.findTodosByImportant(userId, important, limit, skip);
        }
        if (!important && !complete) {
            todos = await this.findAllTodos(userId, limit, skip);
        }
        return todos;
    }
    async createTodo(createTodoDao) {
        const createdTodo = new this.todoModel(Object.assign(Object.assign({}, createTodoDao), { completed: false }));
        return createdTodo.save();
    }
    async deleteTodo(userId, ids) {
        await this.todoModel.where({ userId }).deleteMany({ id: { $in: ids } });
    }
    async completeTodo(userId, id) {
        const todo = await this.todoModel.where({ userId }).findOne({ id });
        await this.todoModel
            .where({ userId })
            .findOneAndUpdate({ id }, { completed: !todo.completed });
    }
    async changeTodo(userId, id, text, priority) {
        await this.todoModel
            .where({ userId })
            .findOneAndUpdate({ id }, { title: text, important: priority });
    }
    async getTodoCursor(userId) {
        return this.todoModel.where({ userId }).find().sort({ id: -1 }).limit(1);
    }
    async getTodosCount(userId, complete, important) {
        let count;
        if (complete && important) {
            count = await this.getTodosCountByCompelteAndImportant(userId, complete, important);
        }
        if (complete && !important) {
            count = await this.getTodosCountByCompelte(userId, complete);
        }
        if (important && !complete) {
            count = await this.getTodosCountByImportant(userId, important);
        }
        if (!complete && !important) {
            count = await this.todoModel
                .where({
                userId,
            })
                .count();
        }
        return count;
    }
};
TodosRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(todo_schema_1.Todo.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        config_1.ConfigService])
], TodosRepository);
exports.TodosRepository = TodosRepository;
//# sourceMappingURL=todos.repository.js.map