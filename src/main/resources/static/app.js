let nickname = "user";
let stompClient = null;
let data = {}
function getServerName(){
    return $('ul.server-list').find('li.clearfix.active').first().find('.name').text()
}
function getChannelName(){
    return $('ul.chat-list').find('li.clearfix.active').first().find('.name').text()
}
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
    $('.messages > li').remove();
    const messages = await fetch(`messages/${serverName}/${channelName}`, {
        method: "GET"
    });
    const messagesResponse = await messages.json();
    console.log(messagesResponse)
    data[serverName][channelName] = messagesResponse
    $('.chat-history').find('img.center').remove();
    $('.chat-history').find('h4').remove();
    if (messagesResponse.length == 0){
        $('<img>').attr('src', 'https://cdn-icons-png.flaticon.com/512/5089/5089742.png').addClass('center').appendTo('.chat-history');
        $('.chat-history').append($('<h4>', {
            class: 'center',
            text: 'There are no messages yet!'
        }));
    } else {
        messagesResponse.forEach(function (message) {
            addMessgae(message);
        })
    }

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
    $('.server-list > li').remove();
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
    if (message.channelName == getChannelName()){
        addMessgae(message)
        $(document).ready(function() {
            $(".chat-history").scrollTop($(".chat-history")[0].scrollHeight);
        })
    }
    data[getServerName()][getChannelName()].push(message)
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
    data[serverName] = {}
    loadServers()
    selectServer(serverName)
}
async function addChannel() {
    channelName = $('*[placeholder="Channel Name"]').val().trim()
    if (serverName.length == 0) {
        alert("Server name cannot be empty")
        return;
    }
    serverName = $('ul.server-list').find('li.clearfix.active').first().find('.name').text()
    const addChannel = await fetch(`createChannel/${serverName}/${channelName}`, {
        method: "POST"
    });
    const addServerResponse = await addChannel;
    if (!addServerResponse.ok) {
        console.log("NO ok")
        return;
    }
    data[serverName][channelName] = []
    showChannels(serverName)
}
function showChannels(serverName){
    $('.chat-list > li').remove();
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
function selectServer(serverName){
    $('.server-list > li').removeClass('active');
    $('.server-list [data-servername='+ serverName+']').addClass('active');
    showChannels(serverName)
    selectChannel(Object.keys(data[serverName])[0])

}

function formatLastMessageDate(dateString) {
    const messageDate = new Date(dateString);

    const currentDate = new Date();

    const timeDifference = currentDate - messageDate;

    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const monthsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30.4368));
    const yearsDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25));

    if (secondsDifference < 60) {
        return secondsDifference + " second" + (secondsDifference === 1 ? "" : "s") + " ago";
    } else if (minutesDifference < 60) {
        return minutesDifference + " minute" + (minutesDifference === 1 ? "" : "s") + " ago";
    } else if (hoursDifference < 24) {
        return hoursDifference + " hour" + (hoursDifference === 1 ? "" : "s") + " ago";
    } else if (daysDifference < 30) {
        return daysDifference + " day" + (daysDifference === 1 ? "" : "s") + " ago";
    } else if (monthsDifference < 12) {
        return monthsDifference + " month" + (monthsDifference === 1 ? "" : "s") + " ago";
    } else {
        return yearsDifference + " year" + (yearsDifference === 1 ? "" : "s") + " ago";
    }
}


function updadeHeader(){
    $('.server').html(getServerName())
    $('.channel').html(getChannelName())
    lastMessageDate = data[getServerName()][getChannelName()].slice(-1).time
    $('.last').val("Last message: " + formatLastMessageDate(lastMessageDate))

}
function selectChannel(channelName){
    $('.chat-list > li').removeClass('active');
    $('.chat-list [data-channelname='+ channelName+']').addClass('active');
    loadChannel(getServerName(), channelName)
    updadeHeader()
    $(document).ready(function() {
        $(".chat-history").scrollTop($(".chat-history")[0].scrollHeight);
    })
    console.log("CYK")
    $(".chat-history").scrollTop($(".chat-history")[0].scrollHeight);
}

function sendMessage(){
    var text = $('.form-control').val();
    $('.form-control').val('')
    if(!text){
        alert("Empty message!")
        return;
    }
    channelName = getChannelName()
    serverName = getServerName()

    const messagePayload = {
        channelName: channelName,
        serverName: serverName,
        senderName: nickname,
        content: text,
        time: new Date()
    };
    stompClient.send(`/app/message`, {}, JSON.stringify(messagePayload));
}

$(document).ready(function() {
    $(".form-control").on("keyup", function(e) {
        if (e.keyCode == 13) {
            sendMessage();
        }
    });
    $(function () {
        $("#join").click(() => joinChat());
    });

    $('.server-list').on('click', 'li', function() {
        const server = $(this).data('servername')
        selectServer(server)
    });

    $('.chat-list').on('click', 'li', function() {
        const channel = $(this).data('channelname')
        selectChannel(channel)
    });

});

