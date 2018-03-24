var store_key = 'todo-vue';
var storage = {
    fetch() {
        return JSON.parse(localStorage.getItem(store_key) || '[]');
    },
    save(todos) {
        localStorage.setItem(store_key, JSON.stringify(todos));
    }
};
var filters = {
    all(todos) {
        return todos;
    },
    active(todos) {
        return todos.filter((todo) => {
            return !todo.completed;
        });
    },
    completed(todos) {
        return todos.filter((todo) => {
            return todo.completed;
        });
    },
   newTodos:[]
};
var app = new Vue({
    el: '.todoapp',
    data: {
        todos: storage.fetch(),
        newTodo: '',
        editedTodo: null,
        visibility: 'all'
    },
    watch: {
        'todos': {
            deep: true,
            handler: storage.save
        }
    },
    computed: {
        filteredTodos() {
            return filters[this.visibility](this.todos);
        },
        remaining() {
            return filters.active(this.todos).length;
        },
        allDone: {
            get() {
                return this.remaining === 0;
            },
            set(value) {
                this.todos.forEach((todo) => {
                    todo.completed = value;
                });
            }
        }
    },
    methods: {
        pluralize(word, count) {
            if (count === 0 || count === 1) {
                return word + '';
            }
            return word + 's';
        },
        addTodo() {
            let value = this.newTodo && this.newTodo.replace(/(^\s*)|(\s*$)/g, '');
            if (!value) {
                return;
            }
            this.todos.push({id: this.todos.length+1, title:this.newTodo, completed:false});
            this.newTodo = '';
        },
        deleteTodo(index) {
            this.todos.splice(index, 1);
        },
        editTodo(todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        },
        doneEdited(todo) {
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.replace(/(^\s*)|(\s*$)/g, '');
            if (!todo.title) {
                this.deleteTodo(todo.id);
            }
        },
        cancelEdit(todo) {
            todo.title = this.beforeEditCache;
            this.editedTodo = null;
        },
        removeCompleted() {
            this.todos = filters.active(this.todos);
        },
        toggleVisibility(type) {
            this.visibility = type;
        }
    },
    directives: {
        'todo-focus'(el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
    }
});