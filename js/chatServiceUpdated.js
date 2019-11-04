const chatService = function() {

    $('#empty-chat').hide();
    $('#group-message-holder').hide();
    $('#loading-message-container').hide();
    $('#send-message-spinner').hide();


    let messageArray = [];
    
    return {
        initializeApp: function() {
            CometChat.init('YOUR_COMET_CHAT_APP_ID').then(
                () => {
                    console.log("Initialization completed successfully");
                    const username = prompt(`Welcome to our jQuery chat demo powered by CometChat. Login with the username superhero1 or superhero2 and test the chat out. To create your own user, copy this link 'https://prodocs.cometchat.com/reference#createuser' and paste into your address-bar`);
                    this.authLoginUser(username);
                },
                error => {
                    console.log("Initialization failed with error:", error);
                }
            )
        },
        authLoginUser: function(username) {
            let apiKey = "YOUR_COMET_CHAT_API_KEY";
            $('#loading-message-container').show();

            CometChat.login(username, apiKey).then(
                () => {
                    console.log("Login successfully");
                    this.getLoggedInUser();
                },
                error => {
                    alert("Whops. Something went wrong. This commonly happens when you enter a username that doesn't exist. Check the console for more information")
                    console.log("Login failed with error:", error.code);
                }
            )
        },
        getLoggedInUser: function() {
            CometChat.getLoggedinUser().then(
                user => {
                    $('#loggedInUsername').text(user.name);
                    $('#loggedInUserAvatar').attr("src", user.avatar)
                    $('#loggedInUID').val(user.uid);

                    $('#loading-message-container').hide();

                    this.fetchMessages();
                },
                error => {
                    console.log(error);
                }
            )
        },
        fetchMessages: function() {
            const messagesRequest = new CometChat.MessagesRequestBuilder()
            .setLimit(100)
            .build()
            messagesRequest.fetchPrevious().then(
                messages => {
                    messageArray = [...messageArray, ...messages];

                    if (messageArray.length < 1) {
                        $('#empty-chat').show();
                        $('#group-message-holder').hide();
                    } else {
                        $('#group-message-holder').show();
                    }

                    $.each(messageArray, function(index, value) {
                        let messageList;
                        let currentLoggedUID = $('#loggedInUID').val();
        
                        if (value.sender.uid != currentLoggedUID) {
                            messageList = `
                            <div class="received-chats old-chats">
                            <div class="received-chats-img">
                                <img src="${value.sender.avatar}" alt="Avatar" class="avatar">
                            </div>
        
                            <div class="received-msg">
                                <div class="received-msg-inbox">
                                    <p>
                                        <span id="message-sender-id">${value.sender.uid}</span><br />
                                        ${value.data.text}
                                    </p>
                                </div>
                            </div>
                        </div>                    
                            `
                        } else {
                            messageList = `
                            <div class="outgoing-chats old-chats">
                                <div class="outgoing-chats-msg">
                                    <p>${value.data.text}</p>
                                </div>
                                <div class="outgoing-chats-img">
                                    <img src="${value.sender.avatar}" alt="" class="avatar">
                                </div>
                            </div>
        `
                        }
        
                        $('#group-message-holder').append(messageList);
                    }); 
                    this.scrollToBottom();                   
                },
                error => {
                    console.log("Message fetching failed with error:", error);
                }
            )
        },
        sendMessage: function(){
            $('#send-message-spinner').show();
            let receiverID = "supergroup";
            let messageText = $('#input-text').val();
            let messageType = CometChat.MESSAGE_TYPE.TEXT;
            let receiverType = CometChat.RECEIVER_TYPE.GROUP;
    
            let textMessage = new CometChat.TextMessage(
                receiverID, messageText, messageType, receiverType
            );
    
            CometChat.sendMessage(textMessage).then(
                message => {
                    $('#message-form').trigger('reset');
                    messageArray = [...messageArray, message];

                    $.each(messageArray, function(index, value) {
                        let messageList;
                        let currentLoggedUID = $('#loggedInUID').val();
        
                        if (value.sender.uid != currentLoggedUID) {
                            messageList = `
                            <div class="received-chats old-chats">
                                <div class="received-chats-img">
                                    <img src="${value.sender.avatar}" alt="Avatar" class="avatar">
                                </div>
            
                                <div class="received-msg">
                                    <div class="received-msg-inbox">
                                        <p>
                                            <span id="message-sender-id">${value.sender.uid}</span><br />
                                            ${value.data.text}
                                        </p>
                                    </div>
                                </div>
                            </div>                    
                            `
                        } else {
                            messageList = `
                            <div class="outgoing-chats old-chats">
                                <div class="outgoing-chats-msg">
                                    <p>${value.data.text}</p>
                                </div>
                                <div class="outgoing-chats-img">
                                    <img src="${value.sender.avatar}" alt="" class="avatar">
                                </div>
                            </div>
        `
                        }
        
                        $('#group-message-holder').append(messageList);
                    });  

                    this.onMessageReceived();
                    this.scrollToBottom();

                },
                error => {
                    console.log("Message sending failed with error:", error);
                }
            );
        },
        onMessageReceived: function() {
            $('#empty-chat').hide();
            $('#group-message-holder').show();
            $('#send-message-spinner').hide();
            let listenerID = "UNIQUE_LISTENER_ID";

            CometChat.addMessageListener(
                listenerID,
                new CometChat.MessageListener({
                    onTextMessageReceived: textMessage => {
                        messageArray = [...messageArray, textMessage];

                        $('.old-chats').remove();

                        $.each(messageArray, function(index, value) {
                            let messageList;
                            let currentLoggedUID = $('#loggedInUID').val();
            
                            if (value.sender.uid != currentLoggedUID) {
                                messageList = `
                                <div class="received-chats old-chats">
                                    <div class="received-chats-img">
                                        <img src="${value.sender.avatar}" alt="Avatar" class="avatar">
                                    </div>
                
                                    <div class="received-msg">
                                        <div class="received-msg-inbox">
                                            <p>
                                                <span id="message-sender-id">${value.sender.uid}</span><br />
                                                ${value.data.text}
                                            </p>
                                        </div>
                                    </div>
                               </div>                    
                                `
                            } else {
                                messageList = `
                                <div class="outgoing-chats old-chats">
                                    <div class="outgoing-chats-msg">
                                        <p>${value.data.text}</p>
                                    </div>
                                    <div class="outgoing-chats-img">
                                        <img src="${value.sender.avatar}" alt="" class="avatar">
                                    </div>
                                </div>
            `
                            }
            
                            $('#group-message-holder').append(messageList);
                        });  
                        this.scrollToBottom();
                    }
                })
            )            
        },
        scrollToBottom() {
            const chat = document.getElementById("msg-page");
            chat.scrollTo(0, chat.scrollHeight + 30);
        }
    }
}();