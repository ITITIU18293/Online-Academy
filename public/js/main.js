
$(document).ready(function () {
  $('.selected').click(function () {
    let optionsContainer = $(this).parent().children()[0];
    optionsContainer.classList.toggle("active");
  });
});

$(document).ready(function() {
  $('#searchInput').keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      let action = '/courses/search?dataSearch=' + $(this).val()
      window.location.href = action;
    }
  });

});
