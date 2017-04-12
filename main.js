// TODO: ask if filter should be label

// ----- Setup -----
prependTodos(getTodos());
validateSaveButton();

// ----- Classes -----
function Todo(inputs) {
  this.title = inputs.title;
  this.task = inputs.task;
  this.id = inputs.id;
  this.importance = "Normal";
  this.level = 2;
}

// ----- Events Listeners -----
$('.save-button').on('click', saveTodo);
$('.save-button').on('keyup', saveTodo);
$('.inputs').on('keyup', validateSaveButton);
$('.search-bar').on('keyup', searchTodos);
$('.importance').on('click', '.importance-btn', filterByImportance);
$('.card-container').on('click', '.delete', deleteTodo)
                    .on('click', '.up-vote', upVote)
                    .on('click', '.down-vote', downVote)
                    .on('focusout', '.title', updateTitle)
                    .on('focusout', '.task', updateTask)
                    .on('keyup', enterKeyBlur);

// ----- Event Functions -----
function saveTodo() {
  var todo = new Todo(getInputs());
  storeTodo(pushToTodos(todo));
  prependTodos(getTodos());
  clearInputs();
}


function deleteTodo() {
  storeTodo(removeFromTodos($(this).parent().prop('id')))
  $(this).parent().remove()
}
// TODO: refactor upvote
// TODO: refactor upQuality
function upVote() {
  var todos = getTodos();
  var index = getTodoIndex($(this).parents('.todo-card').prop('id'));
  var todo = todos[index];
  if (todo.level < 4) {
    todo.level += 1;
  }
  todo.importance = upQuality(todo.level);
  todos[index] = todo;
  storeTodo(todos);
  $(this).parents('.todo-card').replaceWith(buildTodoElement(todo));
}
// TODO: refactor downvote
// TODO: refactor upQuality
function downVote() {
  var todos = getTodos();
  var index = getTodoIndex($(this).parents('.todo-card').prop('id'));
  var todo = todos[index];
  if (todo.level > 0) {
    todo.level -= 1;
  }
  todo.importance = upQuality(todo.level);
  todos[index] = todo;
  storeTodo(todos);
  $(this).parents('.todo-card').replaceWith(buildTodoElement(todo));
}

function enterKeyBlur(e) {
  if (e.which === 13) {
    $(e.target).blur();
  }
}

function updateTitle() {
  var todos = getTodos();
  var index = getTodoIndex($(this).parents('.todo-card').prop('id'));
  var todo = todos[index];
  todo.title = $(this).text();
  todos[index] = todo;
  storeTodo(todos);
  $(this).parent().replaceWith(buildTodoElement(todo));
}

function updateTask() {
  var todos = getTodos();
  var index = getTodoIndex($(this).parents('.todo-card').prop('id'));
  var todo = todos[index];
  todo.task = $(this).text();
  todos[index] = todo;
  storeTodo(todos);
  $(this).parent().replaceWith(buildTodoElement(todo));
}

function searchTodos() {
  var searchValue = $(this).val().toLowerCase();
  if (searchValue !== '') {
    prependTodos(getFilteredTodos(searchValue));
  } else {
    prependTodos(getTodos());
  }
}

// ----- Functions -----
function getTodos() {
  if (!JSON.parse(localStorage.getItem('todos'))) {
    storeTodo([]);
  }
  return JSON.parse(localStorage.getItem('todos'));
}

function prependTodos(todos) {
  $('.card-container').html('');
  todos.forEach(function(todo) {
    $('.card-container').prepend(buildTodoElement(todo));
  });
}

function getInputs() {
  return {  title: $('#title').val(),
            task: $('#task').val(),
            id: Date.now() };
}

function pushToTodos(todo) {
  var todos = getTodos();
  todos.push(todo);
  return todos;
}

function getTodoIndex(id) {
  var todos = getTodos();
  return todos.map(getTodoId).indexOf(parseInt(id));
}

function getTodoId(todo) {
  return todo.id;
}

function removeFromTodos(id) {
  var todos = getTodos();
  todos.splice(getTodoIndex(id), 1);
  return todos;
}

function buildTodoElement(todo) {
  return `<article class="todo-card" id="${todo.id}">
            <button type="button" class="delete"></button>
            <h2 contenteditable="true" class="title">${todo.title}</h2>
            <p contenteditable="true" class="task">${todo.task}</p>
            <div class="importance-container">
              <button type="button" class="up-vote"></button>
              <button type="button" class="down-vote"></button>
              <p class="todo-importance">
                <span class="importance-font">importance: </span>
                <span class="rating">${todo.importance}</span>
              </p>
              </div>
          </article>`
}

function clearInputs() {
  $('#title').val('')
  $('#task').val('')
}

function storeTodo(array) {
  localStorage.setItem('todos', JSON.stringify(array));
}

function upQuality(level) {
  var levels = ['None', 'Low', 'Normal', 'High', 'Critical'];
  return levels[level];
}

function getFilteredTodos(searchValue) {
  return getTodos().filter(function(todo) {
    return todo.title.toLowerCase().indexOf(searchValue) !== -1 ||
           todo.task.toLowerCase().indexOf(searchValue) !== -1;
  });
}

function validateSaveButton() {
  if ($('#title').val() !== "" && $('#task').val() !== "") {
    $('.save-button').prop('disabled', false);
  } else {
    $('.save-button').prop('disabled', true);
  }
}

function getFilteredByImportance(importance) {
  return getTodos().filter(function(todo) {
    return todo.importance === importance;
  });
}

function filterByImportance() {
  var importance = $(this).prop('id');
  if (importance !== 'Any') {
    prependTodos(getFilteredByImportance(importance));
  } else {
    prependTodos(getTodos());
  }
}
