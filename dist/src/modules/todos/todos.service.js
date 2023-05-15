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
var TodosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
const todos_repository_1 = require("./todos.repository");
let TodosService = TodosService_1 = class TodosService {
    constructor(todosRepository) {
        this.todosRepository = todosRepository;
        this.isDatabaseInited = false;
        this.logger = new common_1.Logger(TodosService_1.name);
        this.getDBTodosAfterInitialization = async (userId, todosCount, limit, skip, complete, important) => {
            this.isDatabaseInited = true;
            return {
                todos: await this.todosRepository.findTodos(userId, limit, skip, complete, important),
                count: todosCount,
            };
        };
        this.initializeDatabase = async (userId, todosCount, limit, skip, complete, important) => {
            if (todosCount) {
                return this.getDBTodosAfterInitialization(userId, todosCount, limit, skip, complete, important);
            }
            return {
                todos: [],
                count: 0,
            };
        };
    }
    async createTodo(todo) {
        this.logger.log('creating todo...');
        try {
            return this.todosRepository.createTodo(todo);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async findTodos(userId, limit, skip, complete, important) {
        this.logger.log('finding all todos...');
        try {
            if (this.isDatabaseInited) {
                return {
                    todos: await this.todosRepository.findTodos(userId, limit, skip, complete, important),
                    count: await this.todosRepository.getTodosCount(userId, complete, important),
                };
            }
            const todosCount = await this.todosRepository.getTodosCount(userId, complete, important);
            return this.initializeDatabase(userId, todosCount, limit, skip, complete, important);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async deleteTodo(userId, ids) {
        this.logger.log('deleting todo...');
        try {
            await this.todosRepository.deleteTodo(userId, ids);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async completeTodo(userId, id) {
        this.logger.log('completing todo...');
        try {
            await this.todosRepository.completeTodo(userId, id);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async changeTodo(userId, id, text, priority) {
        this.logger.log('changing todo...');
        try {
            await this.todosRepository.changeTodo(userId, id, text, priority);
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
    async getTodoCursor(userId) {
        this.logger.log('getting cursor...');
        try {
            const res = await this.todosRepository.getTodoCursor(userId);
            if (res[0]) {
                return res[0].id;
            }
            else {
                return 0;
            }
        }
        catch (_a) {
            throw new common_1.InternalServerErrorException();
        }
    }
};
TodosService = TodosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [todos_repository_1.TodosRepository])
], TodosService);
exports.TodosService = TodosService;
//# sourceMappingURL=todos.service.js.map