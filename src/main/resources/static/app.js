let nickname = "user";
let stompClient = null;
let data = {}

async function joinChat() {
    nickname = $("#nickname").val().trim();
    const userResponse = await fetch(`createUser/${nickname}`, {
        method: "POST"
    });
    const data = await userResponse;
    if(data.ok){
        $(".join-form").addClass("hidden")
        $(".chat").removeClass("hidden")
        connectToWebSocket()
    }
}
connectToWebSocket()

function connectToWebSocket(){
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
}

function onConnected(){
    // stompClient.subscribe(`/user/messages`, onMessageReceived);
    loadContent()

}
function onError(){
    console.log("ERROR")
}
function addMessgae(message){
    var messageTime = formatTimestamp(message.time)
    var senderName = message.senderName
    var messageContent = message.content;
    if(nickname == message.senderName){
        var newMessage = $('<li>', {
            class: 'clearfix',
            html: '<div class="message-data text-right"><span class="message-data-time">' + messageTime + '</span><span class="message-data-name">' + senderName + '</span></div><div class="message other-message float-right">' + messageContent + '</div>'
        });
    } else {
        var newMessage = $('<li>', {
            class: 'clearfix',
            html: '<div class="message-data"><span class="message-data-time">' + messageTime + '</span><span class="message-data-name">' + senderName + '</span></div><div class="message my-message">' + messageContent + '</div>'
        });
    }
    $('ul.m-b-0').append(newMessage);
}
async function loadChannel(serverName, channelName) {
    console.log(serverName, channelName)
    const messages = await fetch(`messages/${serverName}/${channelName}`, {
        method: "GET"
    });
    const messagesResponse = await messages.json();
    console.log(messagesResponse)
    data[serverName][channelName] = messagesResponse
    messagesResponse.forEach(function(message) {
        addMessgae(message);
    })

}

async function loadServer(serverName) {
    data[serverName] = {}
    const channels = await fetch(`channels/${serverName}`, {
        method: "GET"
    });
    const channelsResponse = await channels.json();
    channelsResponse.forEach(channel => {
        data[serverName][channel.channelName] = {}
        loadChannel(serverName, channel.channelName)
    });
}

function loadServers(){
    for (serverName in data){
        var newServer = $('<li>', {
            class: 'clearfix',
            'data-serverName': serverName,
            html: '<div class="about"><div class="name">' + serverName + '</div></div>'
        });
        $('.server-list').append(newServer);
    }

}

async function loadContent() {
    const servers = await fetch(`servers`, {
        method: "GET"
    });
    const serversResponse = await servers.json();
    serversResponse.forEach(server => {loadServer(server.serverName)})
    loadServers()
    subscribeServers()
}

async function subscribeServers() {
    for (const server in data) {
        stompClient.subscribe(`/user/${server}/queue/messages`, onMessageReceived)
    }
}

function formatTimestamp(timestamp) {
    var date = new Date(timestamp);

    var hours = date.getHours();
    var minutes = date.getMinutes();

    var amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;

    var today = new Date();
    var isToday = date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear();

    var formattedTime = hours + ':' + minutes + ' ' + amPm;
    var formattedDate = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
    return formattedTime + ', ' + formattedDate;
}


async function onMessageReceived(payload){
    const message = JSON.parse(payload.body)
    addMessgae(message)
}
async function addServer() {
    serverName = $('*[placeholder="Server Name"]').val().trim()
    if (serverName.length == 0) {
        alert("Server name cannot be empty")
        return;
    }
    const joinServer = await fetch(`joinServer/${nickname}/${serverName}`, {
        method: "POST"
    });
    const joinServerResponse = await joinServer;
    if (!joinServerResponse.ok) {
        console.log("NO ok")
        return;
    }
    var newLi = $("<li>")
        .addClass("clearfix active")
        .attr("data-servername", serverName);
    var aboutDiv = $("<div>").addClass("about");
    var nameDiv = $("<div>").addClass("name").text(serverName);
    aboutDiv.append(nameDiv);
    newLi.append(aboutDiv);
    $("ul.list-unstyled.server-list").append(newLi)
}

function showChannels(serverName){
    const channels = data[serverName];
    for (const channel in channels) {
        var newChannel = $('<li>', {
            class: 'clearfix',
            'data-channelname': channel,
            html: '<div class="about"><div class="name">' + channel + '</div></div>'
        });
        $('.chat-list').append(newChannel);
    }
}

function showMessgaes(serverName, channelName){
    const messages = data[serverName][channelName]
    for (const message in messages) {
        console.log(message)
    }
}
function select(serverName){
    $('.server-list > li').removeClass('active');
    $('.server-list [data-servername='+ serverName+']').addClass('active');
    $('.chat-list > li').remove();
    showChannels(serverName)
    $(document).ready(function() {
        $('.chat-list > li:first').addClass('clearfix active');
    });

}

function sendMessage(){
    var text = $('.form-control').val();
    if(!text){
        alert("Empty message!")
        return;
    }
    channelName = $('ul.chat-list').find('li.clearfix.active').first().find('.name').text()
    serverName = $('ul.server-list').find('li.clearfix.active').first().find('.name').text()

    const messagePayload = {
        channelName: channelName,
        serverName: serverName,
        senderName: nickname,
        content: text,
        time: new Date()
    };
    stompClient.send(`/app/message`, {}, JSON.stringify(messagePayload));


}

$(function () {
    $("#join").click(() => joinChat());
});

$('.server-list').on('click', 'li', function() {
    const server = $(this).data('servername');
    select(server); // Call select function with the clicked server name
});
