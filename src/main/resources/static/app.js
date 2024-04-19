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
function onConnected(){
    stompClient.subscribe(`/user/messages`, onMessageReceived);
}
async function subscribeChannel(serverName, channelName) {
    const messages = await fetch(`messages/${serverName}/${channelName}`, {
        method: "GET"
    });
    const messagesResponse = await channels.json();
    console.log(messagesResponse)
}
async function subscribeServer(serverName) {
    data[serverName] = {}
    const channels = await fetch(`channels/${serverName}`, {
        method: "GET"
    });
    const channelsResponse = await channels.json();
    channelsResponse.forEach(channel => {
        data[serverName][channel.channelName] = {}
        subscribeChannel(serverName, channel.channelName)
    });
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
    var newLi = $("<li>").addClass("clearfix active");
    var aboutDiv = $("<div>").addClass("about");
    var nameDiv = $("<div>").addClass("name").text(serverName);
    aboutDiv.append(nameDiv);
    newLi.append(aboutDiv);
    $("ul.list-unstyled.server-list").append(newLi)

}

$(function () {
    $("#join").click(() => joinChat());
});



