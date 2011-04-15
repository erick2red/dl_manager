$(function(){
    var logout = function() {
        //cleaning
        delete window.localStorage.user_id;
        delete window.localStorage.user;

        alert('Login out');

        //debug
        $('body div.main p').remove();
        $('body div.main').append('<p>User: ' + window.localStorage.user + '</p>');
    };
    
	if(window.localStorage.length != 0 && window.localStorage.user_id) {
        //username is in window.localStorage.user
        //password is in window.localStorage.pass
        //setting submit to logout
        $('header form: input:submit').val('LogOut');

        $('div.login-box input').hide();
        $('div.pass-box input').hide();
        
        $('header form').submit(logout);
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
                        } else {
                            //show notification
                            console.log('Here');
                            $().toastmessage('showToast', {
                               text: 'Wrong user/pass. Please try again.',
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
    
    
    $('body div.main').append('<p>User: ' + window.localStorage.user + '</p>');
});