$(function(){
    //styling
    $('input:submit').css('padding', '4px 8px 4px 8px');
    
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
                for(i in data) {
                    $('table>tbody').append('<tr><td>' + data[i].url + '</td><td>' + data[i].url_id + '</td><td>' + data[i].status + '</td><td>' + data[i].address + '</td></tr>')
                    data[i].status == 'done' && rate++; total_size += data[i].size;
                }
                $('table').append('<tfoot><td></td><td>' + data.length + '</td><td>' + rate + '/' + data.length + '</td><td>' + total_size + 'MB</td></tfoot>');
                
                //setting download handler
                $('div.main table td:nth-child(4)').click(function(){
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

        $('div.login-box input').hide();
        $('div.pass-box input').hide();
        
        $('header form').submit(logout);
        
        $('body div.main table').show();
        
        update_urls_table();
	} else {
        //handling submit of the form
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
                            
                            //fetching resuts
                            update_urls_table();
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