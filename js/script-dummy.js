$(document).ready(function() {
    chatService.fetchMessages();

    
    $('#message-form').submit(function(e) {    
        e.preventDefault(); 
        let message = $('#input-text').val(); 

        let text = { 
            username: "oluyemi",
            message 
        } 

        $('.old-chats').remove();

        chatService.sendMessage(text);

        chatService.onMessageReceived();
        
        $('#message-form').trigger('reset');
    });
});