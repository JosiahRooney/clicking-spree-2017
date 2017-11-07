/* global window:true jQuery:true */
((window, $) => {
  $(() => {
    $('.ripple').on('click', function (event) {
      event.preventDefault();
      const $div = $('<div/>');
      const btnOffset = $(this).offset();
      const xPos = event.pageX - btnOffset.left;
      const yPos = event.pageY - btnOffset.top;

      $div.addClass('ripple-effect');
      const $ripple = $('.ripple-effect');

      $ripple.css('height', $(this).height());
      $ripple.css('width', $(this).height());
      $div
        .css({
          top: yPos - ($ripple.height() / 2),
          left: xPos - ($ripple.width() / 2),
          background: $(this).data('ripple-color'),
        })
        .appendTo($(this));

      window.setTimeout(() => {
        $div.remove();
      }, 2000);
    });
  });
})(window, jQuery);
