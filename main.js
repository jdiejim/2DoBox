// BUG: duplicates first when saved; But returns to normal after refresh

// ----- Setup -----
// TODO: remove global function
var ideaArray = []

prependIdeas()

// ----- Classes -----
function Idea(inputs) {
  this.title = inputs.title;
  this.body = inputs.body;
  this.id = inputs.id;
  this.quality = "swill";
}

// ----- Events Listeners -----
$('.save-button').on('click', saveIdea);
$('#title', '.save-button').on('keyup', enterKey);
$('.search-bar').on('keyup', searchIdeas)
$('.card-container').on('click', '.delete', deleteIdea)
                    .on('click', '.up-vote', upVote)
                    .on('click', '.down-vote', downVote)
                    .on('blur', 'h2', editableTitle)
                    .on('blur', 'p', editableBody);

// ----- Event Functions -----
function saveIdea() {
  var idea = new Idea(getInputs());
  storeIdea(pushToIdeas(idea));
  prependIdeas();
  clearInputs();
}

// BUG: Fix functionality
function enterKey() {
  if (event.keyCode == 13) {
    $('.save-button').click()
  }
}

function deleteIdea() {
  storeIdea(removeFromIdeas($(this).parent().prop('id')))
  $(this).parent().remove()
}

function upVote() {
  var ideas = getIdeas();
  var index = getIdeaIndex($(this).parents('.idea-card').prop('id'));
  var idea = ideas[index];
  idea.quality = upQuality(idea.quality);
  ideas[index] = idea;
  storeIdea(ideas);
  $(this).parents('.idea-card').replaceWith(buildIdeaElement(idea));
}

// TODO: change tag to class to target correctly
// TODO: elminiate thisButton variable
function downVote() {
  var rating = ($(this).siblings("p").children(".rating"))
  var thisButton = $(this)
  switch (rating.text()) {
    case 'genius':
    rating.text('plausible')
    updateArrayQuality(thisButton, rating)
    break;
    case 'plausible':
    rating.text('swill')
    updateArrayQuality(thisButton, rating)
    break;
    case 'swill':
    break
  }
}

// FIXME: functionality
function editableTitle() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var h2Text = $(this).text()
  ideaArray.forEach(function(idea) {
    if (cardID == idea.id) {
      idea.title = h2Text
    }
  })
  storeIdea()
}

// FIXME: functionality
function editableBody() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var h2Body = $(this).text()
  ideaArray.forEach(function(idea) {
    if (cardID == idea.id) {
      idea.body = h2Body
    }
  })
  storeIdea()
}

// TODO: separate functionality into individual functions
function searchIdeas() {
  var searchText = $('.search-bar').val().toLowerCase()
  ideaArray.forEach( function(idea, index) {
    idea.title = idea.title.toLowerCase()
    idea.body = idea.body.toLowerCase()
  })
  var searchResultsNeg = ideaArray.filter(function(idea) {
    return idea.title.indexOf(searchText) == -1 &&
    idea.body.indexOf(searchText) == -1 &&
    idea.quality.indexOf(searchText) == -1
  })
  var searchResults = ideaArray.filter(function(idea) {
    return idea.title.indexOf(searchText) != -1 ||
    idea.body.indexOf(searchText) != -1 ||
    idea.quality.indexOf(searchText) != -1
  })
  searchResultsNeg.forEach(function (idea, index) {
    $('#'+idea.id).hide()
  })
  searchResults.forEach(function (idea, index) {
    $('#'+idea.id).show()
  })
}

// ----- Functions -----
function prependIdeas() {
  $('.card-container').html('');
  getIdeas().forEach(function(idea) {
    $('.card-container').prepend(buildIdeaElement(idea));
  });
}

function getInputs() {
  return {  title: $('#title').val(),
            body: $('#body').val(),
            id: Date.now() };
}

function pushToIdeas(idea) {
  var ideas = getIdeas();
  ideas.push(idea);
  return ideas;
}

function getIdeaIndex(id) {
  var ideas = getIdeas();
  return ideas.map(getIdeaId).indexOf(parseInt(id));
}

function getIdeaId(idea) {
  return idea.id;
}

function removeFromIdeas(id) {
  var ideas = getIdeas();
  ideas.splice(getIdeaIndex(id), 1);
  return ideas;
}

function buildIdeaElement(idea) {
  return `<article class="idea-card" id="${idea.id}">
            <button type="button" class="delete"></button>
            <h2 contenteditable="true">${idea.title}</h2>
            <p contenteditable="true">${idea.body}</p>
            <div class="quality-container">
              <button type="button" class="up-vote"></button>
              <button type="button" class="down-vote"></button>
              <p class="idea-quality">
                <span class="quality-font">quality: </span>
                <span class="rating">${idea.quality}</span>
              </p>
              </div>
          </article>`
}

function clearInputs() {
  $('#title').val('')
  $('#body').val('')
}

function storeIdea(array) {
  localStorage.setItem('ideas', JSON.stringify(array));
}

function getIdeas() {
  try {
    JSON.parse(localStorage.getItem('ideas'));
  }
  catch(err) {
    storeIdea([]);
  }
  return JSON.parse(localStorage.getItem('ideas'));
}

function upQuality(quality) {
  switch (quality) {
    case 'swill':
      return 'palusible';
    case 'palusible':
      return 'genius';
    case 'genius':
      return 'genius';
    default:
      return 'swill';
  }
}
