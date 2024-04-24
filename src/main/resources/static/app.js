let nickname = null;
let stompClient = null;
let data = {}

async function joinChat() {
    nickname = $("#nickname").val().trim();
    const userResponse = await fetch(`createUser/${nickname}`, {
        method: "POST"
    });
    const data = await userResponse;
    console.log(data)
    if(data.ok){
        $(".join-form").addClass("hidden")
        $(".chat").removeClass("hidden")
        connectToWebSocket()
    }
}

function connectToWebSocket(){
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
}
onConnected()
function onConnected(){
    // stompClient.subscribe(`/user/messages`, onMessageReceived);
    loadContent()

}
async function loadChannel(serverName, channelName) {
    console.log(serverName, channelName)
    const messages = await fetch(`messages/${serverName}/${channelName}`, {
        method: "GET"
    });
    const messagesResponse = await messages.json();
    console.log(messagesResponse)
//     TODO end it
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

async function loadContent() {
    const servers = await fetch(`servers`, {
        method: "GET"
    });
    const serversResponse = await servers.json();
    console.log(serversResponse)
    serversResponse.forEach(server => {loadServer(server.serverName)})
}

async function subscribeServers() {
    for (const server in data) {
        stompClient.subscribe(`/user/${server}/queue/messages`, onMessageReceived)
    }
}
async function onMessageReceived(message){
    console.log(message)
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
    const data = await joinServer;
    console.log(data)
    if (!data.ok) {
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

function select(serverName){
    $('.server-list > li').removeClass('active');
    $(serverName).addClass('active');
}

$(function () {
    $("#join").click(() => joinChat());
});

$('.server-list > li').click(function() {
    const server = $(this).data('servername');
    console.log('Clicked item:', server);
});