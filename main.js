// TODO: button validation

// ----- Setup -----
prependIdeas(getIdeas());

// ----- Classes -----
function Idea(inputs) {
  this.title = inputs.title;
  this.body = inputs.body;
  this.id = inputs.id;
  this.quality = "swill";
}

// ----- Events Listeners -----
$('.save-button').on('click', saveIdea);
$('.search-bar').on('keyup', searchIdeas)
$('.card-container').on('click', '.delete', deleteIdea)
                    .on('click', '.up-vote', upVote)
                    .on('click', '.down-vote', downVote)
                    .on('focusout', '.title', updateTitle)
                    .on('focusout', '.body', updateBody)
                    .on('keyup', enterKeyBlur);

// ----- Event Functions -----
function saveIdea() {
  var idea = new Idea(getInputs());
  storeIdea(pushToIdeas(idea));
  prependIdeas(getIdeas());
  clearInputs();
}

function enterKeyBlur(e) {
  if (e.which === 13) {
    $(e.target).blur();
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

function downVote() {
  var ideas = getIdeas();
  var index = getIdeaIndex($(this).parents('.idea-card').prop('id'));
  var idea = ideas[index];
  idea.quality = downQuality(idea.quality);
  ideas[index] = idea;
  storeIdea(ideas);
  $(this).parents('.idea-card').replaceWith(buildIdeaElement(idea));
}

function updateTitle() {
  var ideas = getIdeas();
  var index = getIdeaIndex($(this).parents('.idea-card').prop('id'));
  var idea = ideas[index];
  idea.title = $(this).text();
  ideas[index] = idea;
  storeIdea(ideas);
  $(this).parent().replaceWith(buildIdeaElement(idea));
}

function updateBody() {
  var ideas = getIdeas();
  var index = getIdeaIndex($(this).parents('.idea-card').prop('id'));
  var idea = ideas[index];
  idea.body = $(this).text();
  ideas[index] = idea;
  storeIdea(ideas);
  $(this).parent().replaceWith(buildIdeaElement(idea));
}

function searchIdeas() {
  var searchValue = $(this).val().toLowerCase();
  if (searchValue !== '') {
    prependIdeas(getFilteredIdeas(searchValue));
  } else {
    prependIdeas(getIdeas());
  }
}

// ----- Functions -----
function prependIdeas(ideas) {
  $('.card-container').html('');
  ideas.forEach(function(idea) {
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
            <h2 contenteditable="true" class="title">${idea.title}</h2>
            <p contenteditable="true" class="body">${idea.body}</p>
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
      return 'plausible';
    case 'plausible':
      return 'genius';
    case 'genius':
      return 'genius';
    default:
      return quality;
  }
}

function downQuality(quality) {
  switch (quality) {
    case 'swill':
      return 'swill';
    case 'plausible':
      return 'swill';
    case 'genius':
      return 'plausible';
    default:
      return quality;
  }
}

function getFilteredIdeas(searchValue) {
  return getIdeas().filter(function(idea) {
    return idea.title.toLowerCase().indexOf(searchValue) !== -1 ||
           idea.body.toLowerCase().indexOf(searchValue) !== -1;
  });
}
