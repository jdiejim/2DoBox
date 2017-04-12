// ----- Setup -----
prependNthsTodos(getPendingTodos(), 10);
updateCountTodos();
validateSaveButton();

// ----- Classes -----
function Todo(inputs) {
  this.title = inputs.title;
  this.task = inputs.task;
  this.id = inputs.id;
  this.importance = "Normal";
  this.level = 2;
  this.completed = false;
}

// ----- Events Listeners -----
$('.inputs').on('keyup', validateSaveButton);
$('.save-button').on('click', saveTodo);
$('.save-button').on('keyup', saveTodo);
$('.inputFilter').on('keyup', filterTodos);
$('.importance').on('click', '.importance-btn', filterByImportance);
$('.completed-btn').on('click', showCompletedTodos);
$('.show-more-btn').on('click', showMoreTodos)
$('.todo-container').on('click', '.delete', deleteTodo)
                    .on('click', '.up-vote', upVote)
                    .on('click', '.down-vote', downVote)
                    .on('focusout', '.title', updateTitle)
                    .on('focusout', '.task', updateTask)
                    .on('keyup', enterKeyBlur)
                    .on('click', '#completed-btn', markedTodo);

// ----- Event Functions -----
function saveTodo(e) {
  e.preventDefault();
  var todo = new Todo(getInputs());
  storeTodo(pushToTodos(todo));
  prependNthsTodos(getPendingTodos(), 10);
  updateCountTodos();
  clearInputs();
  validateSaveButton();
}

function deleteTodo() {
  storeTodo(removeFromTodos($(this).parent().prop('id')))
  $(this).parent().remove()
}

function upVote() {
  var todos = getTodos();
  var index = getTodoIndex($(this).parents('.todo-card').prop('id'));
  var todo = todos[index];
  if (todo.level < 4) { todo.level += 1; }
  todo.importance = updateImportance(todo.level);
  todos[index] = todo;
  storeTodo(todos);
  $(this).parents('.todo-card').replaceWith(buildTodoElement(todo));
}

function downVote() {
  var todos = getTodos();
  var index = getTodoIndex($(this).parents('.todo-card').prop('id'));
  var todo = todos[index];
  if (todo.level > 0) { todo.level -= 1; }
  todo.importance = updateImportance(todo.level);
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
  $(this).parents('.todo-card').replaceWith(buildTodoElement(todo));
}

function updateTask() {
  var todos = getTodos();
  var index = getTodoIndex($(this).parents('.todo-card').prop('id'));
  var todo = todos[index];
  todo.task = $(this).text();
  todos[index] = todo;
  storeTodo(todos);
  $(this).parents('.todo-card').replaceWith(buildTodoElement(todo));
}

function filterTodos() {
  var filterValue = $(this).val().toLowerCase();
  if (filterValue !== '') {
    prependTodos(getFilteredTodos(filterValue));
  } else {
    prependTodos(getTodos());
  }
}

function filterByImportance() {
  var importance = $(this).prop('id');
  if (importance !== 'Any') {
    prependTodos(getFilteredByImportance(importance));
  } else {
    prependTodos(getPendingTodos());
  }
}

function markedTodo() {
  if ($(this).prop('class') === '') {
    completeTask($(this));
  } else {
    redoTask($(this));
  }
  updateCountTodos();
}

function showMoreTodos() {
  if ($(this).text() === 'Show more TODOs ...') {
    $(this).text('Show less TODOs ...');
    prependTodos(getPendingTodos());
  } else {
    $(this).text('Show more TODOs ...');
    prependNthsTodos(getPendingTodos(), 10);
  }
}

function showCompletedTodos() {
  if ($(this).text() === 'Completed') {
    $(this).text('Pending');
    prependTodos(getPendingTodos().concat(getCompletedTodos()));
  } else {
    $(this).text('Completed');
    prependTodos(getPendingTodos());
  }
}

// ----- Get Functions -----
function getInputs() {
  return {  title: $('#inputTitle').val(),
  task: $('#inputTask').val(),
  id: Date.now() };
}

function getTodos() {
  if (!JSON.parse(localStorage.getItem('todos'))) {
    storeTodo([]);
  }
  return JSON.parse(localStorage.getItem('todos'));
}

function getPendingTodos() {
  return getTodos().filter(function(todo) {
    return todo.completed === false;
  });
}

function getCompletedTodos() {
  return getTodos().filter(function(todo) {
    return todo.completed;
  });
}

function getFilteredTodos(filterValue) {
  return getPendingTodos().filter(function(todo) {
    return todo.title.toLowerCase().indexOf(filterValue) !== -1 ||
           todo.task.toLowerCase().indexOf(filterValue) !== -1;
  });
}

function getFilteredByImportance(importance) {
  return getPendingTodos().filter(function(todo) {
    return todo.importance === importance;
  });
}

function getTodoId(todo) {
  return todo.id;
}

function getTodoIndex(id) {
  var todos = getTodos();
  return todos.map(getTodoId).indexOf(parseInt(id));
}

// ----- Prepend Functions -----
function prependTodos(todos) {
  $('.todo-container').html('');
  todos.forEach(function(todo) {
    $('.todo-container').prepend(buildTodoElement(todo));
  });
}

function prependNthsTodos(todos, num) {
  $('.todo-container').html('');
  var start = todos.length - num;
  if (start > 0) {
    for (var i = start; i < todos.length; i++) {
      $('.todo-container').prepend(buildTodoElement(todos[i]));
    }
  } else {
    prependTodos(todos);
  }
}

function buildTodoElement(todo) {
  var state = '';
  if (todo.completed) {
    state = 'completed';
  }
  return `<article class="todo-card ${state + '-card'}" id="${todo.id}">
            <button id="completed-btn" type="button" class="${state}"></button>
            <section class="card-content">
            <h2 contenteditable="true" class="title">${todo.title}</h2>
            <p contenteditable="true" class="task">${todo.task}</p>
            <div class="importance-container">
              <button type="button" class="up-vote"></button>
              <button type="button" class="down-vote"></button>
              <p class="importance-font">priority: </p>
              <p class="rating">${todo.importance}</p>
            </div>
            </section>
            <button type="button" class="delete"></button>
          </article>`
}

// ----- Add/Remove ToDo Functions -----
function storeTodo(array) {
  localStorage.setItem('todos', JSON.stringify(array));
}

function pushToTodos(todo) {
  var todos = getTodos();
  todos.push(todo);
  return todos;
}

function removeFromTodos(id) {
  var todos = getTodos();
  todos.splice(getTodoIndex(id), 1);
  return todos;
}

// ----- DOM Element Functions -----
function validateSaveButton() {
  var maxLength = 120;
  if ($('#inputTitle').val() !== "" && $('#inputTask').val() !== "" && $('#inputTitle').val().length < maxLength && $('#inputTask').val().length < maxLength) {
    $('.save-button').prop('disabled', false);
    $('.char-erro-msg').text(charErrorMessage($('#inputTitle').val().length, $('#inputTask').val().length, maxLength));
  } else {
    $('.save-button').prop('disabled', true);
    $('.char-erro-msg').text(charErrorMessage($('#inputTitle').val().length, $('#inputTask').val().length, maxLength));
  }
}

function charErrorMessage(num1, num2,  limit) {
  if (num1 > limit || num2 > limit) {
    return 'Reached character limit of 120';
  } else {
    return '';
  }
}

function clearInputs() {
  $('#inputTitle').val('')
  $('#inputTask').val('')
}

function updateCountTodos() {
  $('.todos-count').text('Pending: ' + getPendingTodos().length);
}

function updateImportance(level) {
  var levels = ['None', 'Low', 'Normal', 'High', 'Critical'];
  return levels[level];
}

// ----- Marking Functions -----
function completeTask($btn) {
  var todos = getTodos();
  var index = getTodoIndex($btn.parents('.todo-card').prop('id'));
  var todo = todos[index];
  todo.completed = true;
  todos[index] = todo;
  storeTodo(todos);
  $btn.parent().replaceWith(buildTodoElement(todo));
}

function redoTask($btn) {
  var todos = getTodos();
  var index = getTodoIndex($btn.parents('.todo-card').prop('id'));
  var todo = todos[index];
  todo.completed = false;
  console.log(todo.completed);
  todos[index] = todo;
  storeTodo(todos);
  $btn.parent().replaceWith(buildTodoElement(todo));
}
