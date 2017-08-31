/**
 * Created by kefa on 2017/8/8.
 */

(function(window){

    var filters = {
        completed: function(todoList){
            return todoList.filter(function(todo){
                return todo.completed;
            })
        },
        active: function(todoList){
            return todoList.filter(function(todo){
                return !todo.completed;
            })
        }
    };
    window.app = new Vue({
        el: ".todos",
        data: {
            todoList: store.get("todoList") || [],
            text: '',
            todo: {},
            confirm: null,
            detail: null,
            isEditing: false,
            alarmList: [],
            isPlayingMusic: false
        },
        watch: {
            todoList: {
                deep: true,
                handler: function(){
                    store.set("todoList", this.todoList);
                }
            }
        },
        computed: {
            filteredTodoList: function(){
                return filters.active(this.todoList).concat(filters.completed(this.todoList));
            }
        },
        methods: {
            submit: function(){
                if(!this.text){
                    return;
                }
                this.todoList.unshift({
                    content: this.text,
                    completed: false,
                    detail: '',
                    time: '',
                    timer: null,
                    off: false
                });
                this.text = '';
            },
            remove: function(todo){
                this.confirm = todo;
            },
            yes: function(){
                var index = this.todoList.indexOf(this.confirm);
                this.todoList.splice(index, 1);
                this.confirm = null;
            },
            no: function(){
                this.confirm = null;
            },
            info: function(todo){
                this.detail = todo;
                this.todo = {
                    content: todo.content,
                    detail: todo.detail,
                    time: todo.time
                }
            },
            edit: function(){
                this.isEditing = true;
            },
            doneEdit: function(){
                this.isEditing = false;
            },
            update: function(){
                this.detail.content = this.todo.content;
                this.detail.detail = this.todo.detail;
                this.detail.time = this.todo.time;
                var index = this.alarmList.indexOf(this.detail);
                if(index == -1){
                    this.alarmList.push(this.detail);
                }
                this.alarm();
            },
            mask: function(){
                this.detail = null;
                this.isEditing = false;
            },
            alarm: function(){
                this.alarmList.forEach(function(alarm){
                    var that = this;
                    console.log(alarm.off);
                    if(!alarm.off){
                        var tarTime = new Date(alarm.time).getTime();
                        alarm.timer = setInterval(function(){
                            var curTime = new Date().getTime();
                            if(tarTime - curTime <= 0){
                                alarm.off = true;
                                // that.isPlayingMusic = true;
                                clearInterval(alarm.timer);
                            }
                        }, 1000)
                    }

                });
                /*if(!todo.time){
                    return;
                }
                var that = this;
                var tarTime = new Date(todo.time).getTime();
                todo.timer = setInterval(function(){
                    var curTime = new Date().getTime();
                   // console.log(curTime);
                    if(tarTime - curTime <= 0){
                        todo.off = false;
                        that.off = false;
                        clearInterval(todo.timer);
                    }
                }, 1000)*/
            },
            iKnow: function(todo){
                todo.off = false;
            }
        },
        directives: {
            "to-focus": function(el, binding){
                if(binding.value){
                    el.focus();
                }
            },
            "play": function(el, binding){
                //console.log(el, binding);
                if(binding.value){
                    el.play();
                }
            }
        }
    })
})(window);


