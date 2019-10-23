const chatService = function() {
    return {
        init: function() {
            console.log("Lets begin the show!")
        },
        sendMessage: function() {

        },
        onMessageReceived: function() {
            
        }
    }
}();

$(document).ready(function() {
    chatService.init();
});