"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByCompletence = void 0;
const filterByCompletence = (complete, todos) => {
    switch (complete) {
        case 'complete':
            todos.filter((item) => item.completed);
            break;
        case 'uncomplete':
            todos.filter((item) => !item.completed);
            break;
    }
};
exports.filterByCompletence = filterByCompletence;
//# sourceMappingURL=filterByCompletence.js.map