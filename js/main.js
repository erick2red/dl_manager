$(function(){
    //styling
    $('input:submit').button();
    $('div.new-url-ok')
        .button({
            text: false,
            icons: {
                primary: 'ui-icon-circle-check'
            }
        })
        .click(function(){
            n_url = $('input.new-url').val();
            if(/^([a-z]([a-z]|\d|\+|-|\.)*):(\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?((\[(|(v[\da-f]{1,}\.(([a-z]|\d|-|\.|_|~)|[!\$&'\(\)\*\+,;=]|:)+))\])|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=])*)(:\d*)?)(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*|(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)|((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)){0})(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(n_url)) {
                //calling ajax
                $.ajax({
                    url: 'cgi/handler.php',
                    type: 'POST',
                    data: {method: 'new_url', params: {user_id: window.localStorage.user_id, url: n_url}},
                    dataType: 'json',
                    success: function(data, textStatus, jqXHR){
                        if(data) {
                            $('div.new-url-dialog').slideUp('slow');
                            update_urls_table();
                        } else {
                            //let see
                        }
                    }
                });
                $('input.new-url').val("");
            } else {
                $('body').toastmessage('showToast', {
                   text: 'Invalid Url',
                   sticky: false,
                   position: 'bottom-right',
                   type: 'error',
                   stayTime: 2000
                });
                $('input.new-url').val("");
            }            
        })
        .next().button({
            text: false,
            icons: {
                primary: 'ui-icon-circle-close'
            }
        })
        .click(function(){
            $('input.new-url').val("");
            $('div.new-url-dialog').slideUp('slow');
        });    

    //setting button
    $("div.new-url-btn")
        .button()
        .click(function() {
           $('div.new-url-dialog').slideDown('slow');
        })
        .next()
        .button({
            text: false,
            icons: {
                primary: 'ui-icon-document'
            }
        })
        .click(function() {
            alert( "This will implement the import from file" );
        })
        .parent()
        .buttonset();
                    
    var update_urls_table = function(){
        $('div.main table').show();
        $.ajax({
            url: 'cgi/handler.php',
            type: 'POST',
            data: {method: 'fetch_urls', params: {user_id: window.localStorage.user_id}},
            dataType: 'json',
            success: function(data, textStatus, jqXHR){
                console.log('fetch_urls return');
                console.log(data);
                rate = 0;
                total_size = 0;
                $('table>tbody>tr').remove();
                $('table>tfoot>tr').remove();
                for(i in data) {
					address = data[i].status == 'done' ? data[i].address.substr(data[i].address.lastIndexOf('/') + 1).link(escape(data[i].address)) : '-';
                    $('table>tbody').append('<tr><td>' + data[i].url + '</td><td>' + data[i].status + '</td><td>' + address + '</td><td><div class="btn-remove" id="url_' + data[i].url_id + '">Remove</div></td></tr>')
                    $('table>tbody>tr:last>td:first').ellipsis({size: 45, expand: false});
                    $('table>tbody>tr:last>td:has(a) a').ellipsis({size: 40, expand: false});
                    //adding remove button
                    $('td>div#url_' + data[i].url_id)
                        .addClass('ui-icon ui-icon-circle-close')
                        .parent()
                        .click(function(){
                            $.ajax({
                                url: 'cgi/handler.php',
                                type: 'POST',
                                data: {method: 'remove_url', params: {url_id: $('div', $(this)).attr('id').substr(4)}},
                                dataType: 'json',
                                success: function(data, textStatus, jqXHR){
                                    if(data) {
                                        update_urls_table();
                                    }
                                }
                            });
                        })
                        .css('padding-left', '42px');
                    data[i].status == 'done' && rate++; total_size += data[i].size;
                }
                $('table').append('<tfoot><td></td><td>'+ rate + '/' + data.length + '</td><td>' + total_size + 'MB</td><td></td></tfoot>');
                
                //setting download handler
                $('div.main table tbody td:nth-child(3)').click(function(){
                    //TODO add real download handler
                    $('body').toastmessage('showToast', {
                       text: 'Downloading ' + $(this).html(),
                       sticky: false,
                       position: 'bottom-right',
                       type: 'success',
                       stayTime: 2000
                    });
                });

            }
        });
    }
    
    var logout = function() {
        //cleaning
        delete window.localStorage.user_id;
        delete window.localStorage.user;

        $('body').toastmessage('showToast', {
           text: 'Login Out',
           sticky: false,
           position: 'bottom-right',
           type: 'success',
           stayTime: 2000
        });

        $('div.main table').hide();
    };
    
	if(window.localStorage.length != 0 && window.localStorage.user_id) {
        //username is in window.localStorage.user
        //password is in window.localStorage.pass
        //setting submit to logout
        $('header form: input:submit').val('LogOut');
        $('div.new-url-btn')
            .button('option', 'disabled', false)
            .next()
            .button('option', 'disabled', false);

        $('div.login-box input').hide();
        $('div.pass-box input').hide();
        
        $('header form').submit(logout);
        
        $('body div.main table').show();
        
        update_urls_table();
        setInterval(update_urls_table, 300000);
        
	} else {
        //handling submit of the form
        $('div.new-url-btn, div.new-url-btn')
            .button('option', 'disabled', true)
            .next()
            .button('option', 'disabled', true);
        $('div.login-box input').show();
        $('div.pass-box input').show();

        $('header form').submit(function() {
            if($('div.login-box input').val() != "" && $('div.pass-box input').val() != "") {
                //autheticating

                $.ajax({
                    url: 'cgi/handler.php',
                    type: 'POST',
                    data: {method: 'authenticate_user', params: {user: $('div.login-box input').val(), pass: $('div.pass-box input').val()}},
                    dataType: 'json',
                    success: function(data, textStatus, jqXHR){
                        if(data != null) {
                            window.localStorage.user_id = data;
                            window.localStorage.user = $('div.login-box input').val();

                            $('div.login-box input').hide();
                            $('div.pass-box input').hide();
                            $('header form: input:submit').val('LogOut');
                            
                            $('header form').unbind('submit');
                            $('header form').submit(logout);

                            $('div.new-url-btn')
                                .button('option', 'disabled', false)
                                .next()
                                .button('option', 'disabled', false);                            
                            //fetching resuts
                            update_urls_table();
                            setInterval(update_urls_table, 300000);
                            
                        } else {
                            //show notification
                            console.log('Here');
                            $('body').toastmessage('showToast', {
                               text: 'Wrong user/pass.' + "<br/>" + 'Please try again.',
                               sticky: false,
                               position: 'bottom-right',
                               type: 'error',
                               stayTime: 2000
                            });

                            $('div.login-box input').val('');
                            $('div.pass-box input').val('');

                        }
                    }
                });
            }
            return false;
        });        
    }
});