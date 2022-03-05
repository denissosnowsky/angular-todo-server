"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterByImportance = void 0;
const filterByImportance = (important, todos) => {
    switch (important) {
        case 'high':
            todos.filter((item) => item.important === 'high');
            break;
        case 'low':
            todos.filter((item) => item.important === 'low');
            break;
        case 'normal':
            todos.filter((item) => item.important === 'normal');
            break;
        case 'none':
            todos.filter((item) => item.important === '');
            break;
    }
};
exports.filterByImportance = filterByImportance;
//# sourceMappingURL=filterByImportance.js.map