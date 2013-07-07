$(function() {

    var legendas = {
        init: function() {
            this.header();
            this.slider();
            this.search();
            this.tabs();
            this.pagination();
            this.file_upload();

            $(document).click(function(e) {
                if($(e.target).parents('.menu').length === 0) {
                    $('.container > header .menu .dropdown').hide('slow');
                }
            });
        },





    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// HEADER
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */

        header: function() {
            var menu      = $('.container > header .menu button'),
                login_box = $('.container > header .login_box');

            if(menu.length > 0) {
                menu.click(function(e) {
                    menu.siblings('.dropdown').toggle('slow');
                    e.preventDefault();
                });
            }

            if(login_box.length > 0) {
                login_box.siblings('.js_entrar').click(function(e) {
                    login_box.show('slow');
                    e.preventDefault();
                });

                login_box.find('.js_close').click(function(e) {
                    login_box.hide('slow');
                    e.preventDefault();
                });
            }
        }, /* END OF HEADER */




    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// SEARCH
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */

        search: function() {
            var searchbar = $('header .searchbar');

            searchbar.find('input[type="text"]').on('keyup', function() {
                var value = $(this).val();

                $.ajax({
                    url:        '/autocomplete',
                    type:       'GET',
                    dataType:   'json',
                    data:       {word: value},
                    success:    function(data) {
                        var string = '<div>';

                        $.each(data, function(index, value) {
                            string += '<button>' + value + '</button>';
                        });

                        string += '</div>';

                        searchbar.append(string);
                    },
                    error:      function() {
                        alert('The server is not responding. We apologize!');
                    }
                });

                return false;
            });

            searchbar.on('click', 'button', function(e) {
                searchbar.find('input[type="text"]').val($(this).html());
                searchbar.find('div').remove();

                e.preventDefault();
            })
        }, /* END OF SEARCH AUTOCOMPLETE */




    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// SLIDER
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */

        slider: function() {
            var s_w_width = $('.slider_wrapper').width(),
                slider    = $('.slider_wrapper .slider'),
                slider_w  = 0,
                item_w    = 0,
                btn_left  = slider.parent().siblings('.slider_left'),
                btn_right = slider.parent().siblings('.slider_right'),
                in_action = false;

            if(slider.length > 0) {
                item_w  = $(slider.children()[0]).outerWidth();
                slider_w = slider.children().length * item_w;
                slider.css('width', slider_w);

                slider.parent().siblings('.slider_left, .slider_right').click(function() {
                    var that = $(this);

                    if(!that.hasClass('inactive') && !in_action) {
                        in_action = true;

                        if(that.attr('class') === 'slider_left') {

                            slider.animate({'left': '+=' + s_w_width}, 500, function() {
                                btn_right.removeClass('inactive');
                                if(slider.css('left') ===  '0px') {
                                    that.addClass('inactive');
                                }
                                in_action = false;
                            });

                        } else {

                            slider.animate({'left': '-=' + s_w_width}, 500, function() {
                                btn_left.removeClass('inactive');
                                if(slider.css('left') ===  (0 - slider_w + s_w_width + 'px')) {
                                    that.addClass('inactive');
                                }
                                in_action = false;
                            });

                        }
                    }
                });
            }
        }, /* END OF SLIDER */




    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// TABS
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */
        tabs: function() {
            var tabs_wrapper = $('.js_tabs');

            if(tabs_wrapper.length > 0) {
                tabs_wrapper.each(function() {
                    var tab = $(this);

                    tab.on('click', 'nav a', function(e) {
                        var that  = $(this),
                            index = that.index();

                        if(!that.hasClass('active')){
                            that.siblings('.active').removeClass('active');
                            that.addClass('active');

                            tab.children('div').find('.gallery:visible').hide();
                            $(tab.children('div').children()[index]).show();
                        }

                        e.preventDefault();
                    });
                });
            }
        }, /* END OF TABS */




    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// PAGINATION
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */
        pagination: function() {
            var pag_wrapper = $('.pagination_wrapper');

            if(pag_wrapper.length > 0) {
                pag_wrapper.each(function() {
                    var pagination = $(this),
                        siblings   = pagination.siblings('.clearfix'),
                        buttons    = null,
                        index      = 0,
                        new_index  = 0,
                        string     = '',
                        i          = 2,
                        len        = siblings.length;

                    string = '  <div class="pagination"> \
                                    <button class="left"></button> \
                                    <button class="active">1</button>';
                    for(; i <= len; i++){
                        string +=  '<button>' + i + '</button>';
                    }
                    string +=      '<button class="right"></button > \
                                </div>';
                    pagination.append(string);
                    buttons = pagination.find('button');
                    index   = pagination.find('button.active').index() - 1;


                    pagination.on('click', 'button', function(e) {
                        var that  = $(this);

                        if(that.hasClass('active')) {
                            return false;
                        }

                        if(that.hasClass('left')) {
                            if(index === 0) {
                                return false;
                            }

                            new_index = index - 1;
                        } else if(that.hasClass('right')) {
                            if(index === (siblings.length - 1)) {
                                return false;
                            }

                            new_index = index + 1;
                        } else {
                            new_index = that.index() - 1;
                        }

                        $(buttons[index + 1]).removeClass('active');
                        $(siblings[index]).hide();

                        index = new_index;

                        $(siblings[index]).show();
                        $(buttons[index + 1]).addClass('active');

                        e.preventDefault();
                    });
                });
            }
        }, /* END OF PAGINATION */



    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// FILE UPLOAD
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */
        file_upload: function() {
            var parent = $('.file_upload'),
                input  = parent.find('input');

            input.before('<div class="fake_input"></div>');

            parent.on('mouseenter', function() {
                parent.mousemove(function(e) {
                    input.css({'top': e.pageY - parent.offset().top - 15, 'left': e.pageX - parent.offset().left - 50});
                });
            });
            parent.on('mouseleave', function() {
                parent.unbind('mousemove');
            });
            input.change(function() {
                parent.find('.fake_input').html(input.val());
            });
        }
        
    
    };







    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// EXECUTION
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */

    legendas.init();

});