$(function() {

    var legendas = {
        init: function() {
            this.header();
            this.slider();
            this.search();
            this.tabs();
            this.pagination();
            this.file_upload();
            this.edit_field();

            this.menu_page();
            this.download_page();

            $(document).click(function(e) {
                if($(e.target).parents('.menu').length === 0) {
                    $('.container > header .menu .dropdown').hide('slow');
                }

                if($(e.target).parents('.searchbar').length === 0) {
                    $('.search_drop_down').hide('slow');
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
                        var string = '', string_content = '';

                        $.each(data, function(index, value) {
                            string_content += '<button>' + value + '</button>';
                        });

                        if(searchbar.find('.search_drop_down').length === 0) {
                            string = '<div class="search_drop_down">';
                            string += string_content;
                            string +='</div>'
                            searchbar.append(string);
                        } else {
                            searchbar.find('.search_drop_down').show('slow').html(string_content);
                        }
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

                slider.parent().siblings('.slider_left, .slider_right').click(function(e) {
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

                    e.preventDefault();
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
                    $(this).on('click', 'nav a', function(e) {
                        var that     = $(this),
                            contents = that.parent().siblings();
                            index    = that.index();

                        if(!that.hasClass('active')){
                            that.siblings('.active').removeClass('active');
                            that.addClass('active');

                            contents.children('div:visible').hide();
                            $(contents.children('div')[index]).show();
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
                        siblings   = pagination.siblings(),
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
        },




    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// EDIT FIELD
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */

      edit_field: function() {
        var item_edit = $('.js_edit_field'),

            update_number = function(target) {
                var parent = target.parents('.dates'),
                    value = target.val(),
                    a, b, c;

                if(target.val() === '') {
                    value = target.prop('placeholder');
                }
                target.parent().html('<span>' + value + '</span> minutos');

                a     = parent.children('div:eq(3)').find('div span').html(),
                b     = parent.children('div:eq(4)').find('div span').html(),
                c     = parent.children('div:eq(5)').find('div span').html();
                parent.siblings('figure').find('b').html(Math.round(b / a * 70  +  c / a * 30));
            };


        if(item_edit.length > 0) {
            item_edit.click(function(e) {
                var that  = $(this),
                    value = that.find('span').html();

                if(value) {
                    that.html('<input type="text" placeholder="' + value + '" />');
                    that.find('input').focus();
                }

                e.preventDefault();
            });

            item_edit.on('blur', 'input', function() { update_number($(this)); });

            item_edit.on('keyup', 'input', function(e) {
                if(this.value !== this.value.replace(/[^0-9\.]/g, '')) {
                    this.value = this.value.replace(/[^0-9\.]/g, '');
                } else if(this.value > 1000) {
                    this.value = 1000;
                }

                if(e.which === 13) {
                     update_number($(this));
                }
            });
        }
      },



    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// PAGES
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */
        menu_page: function() {
            if($('.js_datepicker').length > 0) {
                $('.js_datepicker').find('input').datepicker({ dateFormat: "dd.mm.yy" });

                $('.js_datepicker').click(function() {
                    $(this).find('input').datepicker('show');
                });
            }
        },
        
        download_page: function() {
            if($('.js_more_less').length > 0) {
                $('.js_more_less').click(function(e) {
                    var that = $(this),
                        parent = that.parents('.first');

                    if(that.hasClass('active')) {
                        that.removeClass('active');
                        that.find('button').html('LEIA MAIS');
                        parent.css({'height': '400px'});
                    } else {
                        that.addClass('active');
                        that.find('button').html('LEIA MENOS');
                        parent.css({'height': 'auto'});
                    }
                    e.preventDefault();
                });
            }
        }
    }








    /*
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      ///////////// EXECUTION
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    */

    legendas.init();

});