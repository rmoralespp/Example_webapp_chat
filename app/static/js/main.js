/**
 * Created by Rolando.Morales on 10/01/2017.
 */

var io = io.connect('localhost',{port: 3000});

$(function(){

    var login =function(e){
        e.preventDefault();
        var username=$('#id_username').val();
        var password=$('#id_password').val();
        var token=$("input[name='csrfmiddlewaretoken']").val();
        if(username!="" && password!=""){
            $.ajax({
            url:'/login',
            type: "POST",
            data:{
                 username:username,
                 password:password,
                 csrfmiddlewaretoken : token
            },
            success: function(data){
                io.emit('join',data);
            }
        });
        }

    };

    var logout =function(e){
        e.preventDefault();
        $.ajax({
            url:'/logout',
            type: "GET",
            data:{},
            success: function(data){
                io.emit('logout',data);
            }
        });
    };

    var joined = function(data){
        $('#lista_usuarios li').each(function(i,item){
            if($(item).attr('id') == data.user.id){
                $(item).find('.user_line').addClass('user_conected');
            }
        });
    };

    var leave = function(data){
        $('#lista_usuarios li').each(function(i,item){
            if($(item).attr('id') == data.user.id){
                $(item).find('.user_line').removeClass('user_conected');
            }
        });
    };

    var leave_me = function(data){
          window.location.href = data.url;
    };

    var join_me = function(data){
        window.location.href = data.url;
    };

    var capture_message = function(data){

        if($('.nav_user').attr('id') == data.to){
            $('section *').show();
            $('section ul li').removeClass('active');
            var control=false;
            $('section .tab-content div').each(function(i,item){
                if ($(item).attr('id') == data.from_username){
                    $(item).append($('<p class="sms_user_second">'+data.text+'</p>'));
                    control=true
                }
            });
            if(control == false){

                var a=$('<a data-toggle="tab"></a>').attr('href','#'+data.from_username).text(data.from_username);
                var li=$('<li class="active"></li>').attr('id',data.from).append(a);
                $('section > ul').append(li);
                var area_texto=$('<div class="tab-pane fade in active"><p class="sms_user_second">'+data.text+'</p></div>').attr('id',data.from_username);
                $('section > .tab-content').append(area_texto);
                a.click();
           }
            else {

                $('section ul li').each(function(i,item){
                    if ($(item).attr('id') == data.from){
                        $(item).addClass('active');
                    }
                });
            }
        }
    };

    var emit_message = function(){
        var text=$('#input_chat').val();
        $('#input_chat').val("");
        var id_to=null;
        var id_from=null;
         var from_username=null;
        if(text !=""){
            $('section ul li').each(function(i,item){
                if ($(item).hasClass('active')){
                    id_to=$(item).attr('id');
                    id_from=$('.nav_user').attr('id');
                    from_username=$('.nav_user a').attr('id');
                }
            });

            $('section .tab-content div').each(function(i,item){
                if ($(item).hasClass('active')){
                    $(item).append($('<p class="sms_user_first">'+text+'</p>'));
                    io.emit('emit_message',{from:id_from,to:id_to,text:text,from_username:from_username})
                }
            });
          }

    };

    var aside_user_tab = function(e){
        $('section *').show();
         e.preventDefault();
         var id=$(this).attr('id');
         var username=$(this).find('.user_username').text();
         var control=false;
         $('section ul li').removeClass('active');
         $('section ul li').each(function(i,item){
             if ($(item).attr('id') == id){
                 control=true;
                 $(item).addClass('active');
             }
         });
         if(control == false){
             var a=$('<a data-toggle="tab"></a>').attr('href','#'+username).text(username);
             var li=$('<li class="active"></li>').attr('id',id).append(a);
             $('section > ul').append(li);
             var area_texto=$('<div class="tab-pane fade in active"></div>').attr('id',username);
             $('section > .tab-content').append(area_texto);
        }

    };



    var start= function(){
        //IO
        io.on('joined',joined);
        io.on('join_me',join_me);
        io.on('leave',leave);
        io.on('leave_me',leave_me);
        io.on('capture_message',capture_message);

        //Eventos

        $('#btn_login').click(login);
        $('#btn_logout').click(logout);
        $('aside ul li').click(aside_user_tab);
        $('#btn_input_chat').click(emit_message);



    };
    start();


});