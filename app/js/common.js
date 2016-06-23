"use strict";
var videoId,videoObj,videoSlider;
function youtube(obj){
	$(obj).each(function() {
		// Зная идентификатор видео на YouTube, легко можно найти его миниатюру
		$(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

		// Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
		$(this).append($('<div/>', {'class': 'play'}));

		$(document).delegate('#'+this.id, 'click', function() {
			// создаем iframe со включенной опцией autoplay
				videoSlider = $(this).hasClass('my-video') ? 0 : 1;
				videoId = videoSlider ? 'video' + this.id : undefined;
				var iframe_url = "https://www.youtube.com/embed/" + this.id + "?autoplay=1&playerapiid=ytplayer&enablejsapi=1";
				if ($(this).data('params')) iframe_url+='&'+$(this).data('params');

				// Высота и ширина iframe должны быть такими же, как и у родительского блока
				var iframe = $('<iframe/>', {
					'frameborder': '0',
					'src': iframe_url,
					'width': $(this).width(),
					'height': $(this).height(),
					'id': videoId,
					'name': 'video' + this.id,
				});
				videoObj = $(this);
				// Заменяем миниатюру HTML5 плеером с YouTube
				$(this).replaceWith(iframe);
		});
	});
}

$(function() {

	//SVG Fallback
	if(!Modernizr.svg) {
		$("img[src*='svg']").attr("src", function() {
			return $(this).attr("src").replace(".svg", ".png");
		});
	};

	//E-mail Ajax Send
	//Documentation & Example: https://github.com/agragregra/uniMail
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});
	youtube('.my-video');



	var testimonials = $('#testimonials').lightSlider({
		item:1,
		slideMargin:0,
		loop:true,
		pager: false,
		enableDrag: true,
		enableTouch: true,
		freeMove: false,
		addClass: 'video-slider',
		onSliderLoad: function(el){
			youtube('#testimonials .youtube');
		},
		onAfterSlide: function(el){
			console.log(videoId);
			if(videoId != undefined){
				$('#' + videoId).replaceWith(videoObj);
			}
		}
	});

	$(".loader").addClass('loader-hidden');

	$("[name=send]").click(function () {
		$(":input.error").removeClass('error');
		$(".allert").remove();

		var error;
		var btn = $(this);
		var ref = btn.closest('form').find('[required]');
		var msg = btn.closest('form').find('input, textarea');
		var send_btn = btn.closest('form').find('[name=send]');
		var send_options = btn.closest('form').find('[name=campaign_token]');
		var user_name = btn.closest('form').find('[name=name]').val();
		$(ref).each(function() {
			if ($(this).val() == '') {
				var errorfield = $(this);
				$(this).addClass('error').parent('.field').append('<div class="allert"><span>Заполните это поле</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
				error = 1;
				$(":input.error:first").focus();
				return;
			} else {
				var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
				if ($(this).attr("type") == 'email') {
					if(!pattern.test($(this).val())) {
						$("[name=email]").val('');
						$(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный e-mail</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
						error = 1;
						$(":input.error:first").focus();
					}
				}
				var patterntel = /^()[0-9]{9,18}/i;
				if ( $(this).attr("type") == 'tel') {
					if(!patterntel.test($(this).val())) {
						$("[name=phone]").val('');
						$(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный номер телефона</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
						error = 1;
						$(":input.error:first").focus();
					}
				}
			}
		});
		if(!(error==1)) {
			$(send_btn).each(function() {
				$(this).attr('disabled', true);
			});
			$(send_options).each(function() {
				if ($(this).val() == '') {
					$.ajax({
						type: 'POST',
						url: 'mail.php',
						data: msg,
						success: function() {
							$('form').trigger("reset");
							setTimeout(function(){  $("[name=send]").removeAttr("disabled"); }, 1000);
							// Настройки модального окна после удачной отправки
							$("#success-popup span").html(user_name);
							$("#success-popup-button").click();
						},
						error: function(xhr, str) {
							alert('Возникла ошибка: ' + xhr.responseCode);
						}
					});
				} else {
					$.ajax({
						type: 'POST',
						url: 'mail.php',
						data: msg,
						success:
							$.ajax({
								type: 'POST',
								url: 'https://app.getresponse.com/add_subscriber.html',
								data: msg,
								statusCode: {0:function() {
									$('form').trigger("reset");
									setTimeout(function(){  $("[name=send]").removeAttr("disabled"); }, 1000);

									// Настройки модального окна после удачной отправки
									$("#success-popup span").html(user_name);
									$("#success-popup-button").click();

								}}
							}),
						error:  function(xhr, str) {
							alert('Возникла ошибка: ' + xhr.responseCode);
						}
					});
				}
			});
		}
		return false;
	});

	$('.modal').magnificPopup({
		type: 'iframe',
		mainClass: 'my-modal'
		// other options
	});
	$('.popup,#success-popup-button').magnificPopup({
		type: 'inline',
		closeBtnInside:true,
		mainClass: 'my-form-modal'
		// other options
	});

	var form_subject;
	$('.portfels__item__button').on("click",function () {
		form_subject = $(this).data('form-subject');
		$("#form-popup [name=form_subject]").val(form_subject);
		$("#form-popup h2").html(form_subject);
	});
	$(".scroll2id").mPageScroll2id();
	

	$(document).on('keypress',function(e){
		console.log(e.charCode);
	});
});

