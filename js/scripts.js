var pokemonRepository = (function() {
    var repository = [];
    var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  
    function add(pokemon) {
      repository.push(pokemon);
    }
  
    function getAll() {
      return repository;
    }
  
    function addListItem(pokemon) {
      var $ulItem = $('.grid-list');
      var $listItem = $('<li></li>');
      var $button = $('<button></button>');
  
      $button.text(pokemon.name);
      $listItem.addClass('col-sm-4');
      $button.addClass('pokemon-button');
      $button.appendTo($listItem);
      $listItem.appendTo($ulItem);
      addEventListenerButton($button, pokemon);
    }
  
    function showDetails(pokemon) {
      pokemonRepository.loadDetails(pokemon).then(function() {
        console.log(pokemon);
        showModal(pokemon);
      });
    }
  
    function addEventListenerButton(button, pokemon) {
      button.click(function(event) {
        showDetails(pokemon);
      });
    }
  
    function loadList() {
      return $.ajax(apiUrl, {dataType: 'json'})
        .then(function(response) {
          $.each(response.results, function(i, item){
            var pokemon = {
              name: item.name,
              url: item.url
            };
            add(pokemon);
          });
        })
        .catch(function(e) {
          console.error(e);
        });
    }
  
    function loadDetails(item) {
      var url = item.url;
      return $.ajax(url, {dataType: 'json'})
        .then(function(json) {
          item.imageUrl = json.sprites.front_default;
          item.height = json.height;
          item.types = Object.keys(json.types);
        });
    }
  
    function showModal(details) {
      var $modalContainer = $("#modal-container");
      $modalContainer.text("");
  
      var $modal = $('<div></div>');
      $modal.addClass("modal");
  
      var $closeButton = $('<button></button>');
      $closeButton.addClass("modal-close");
      $closeButton.text("X");
      $closeButton.click(function(){
        hideModal();
      });
  
      var $titleContent = $('<h1></h1>');
      $titleContent.text(details.name);
  
      var $content = $('<p></p>');
      $content.text("Height: " + details.height);
  
      var $img = $('<img/>');
      $img.attr('src', details.imageUrl);
      $img.addClass("pokemon-image");
  
      $closeButton.appendTo($modal);
      $titleContent.appendTo($modal);
      $img.appendTo($modal);
      $content.appendTo($modal);
      $modal.appendTo($modalContainer);
  
      $modalContainer.addClass("is-visible");
  
      $modalContainer.click(function(e){
        var target = e.target;
        if (target === $modalContainer) {
          hideModal();
        }
      });
    }
  
    function hideModal() {
      var $modalContainer = $('#modal-container');
      $modalContainer.removeClass("is-visible");
    }
  
    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showModal: showModal
    };
  })();
  
  pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });
  