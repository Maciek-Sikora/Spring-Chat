console.log("start");


document.addEventListener("DOMContentLoaded", function() {
    const socket = new SockJS('/ws');
    // Your further code related to socket initialization or usage
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError)
});



function onError(){
    console.log("Error jest")
}
function onConnected() {

    // setConnected(true);
    console.log('Connected: ');
    // stompClient.subscribe('/user/messages', (payload) => {
    //     console.log(JSON.parse(payload.body).content);
    // });
    stompClient.subscribe(`/user/testServer/queue/messages`, (payload) => {
        console.log(JSON.parse(payload.body).content)
    });
    stompClient.subscribe(`/user/public`, (payload) => {
        console.log(JSON.parse(payload.body).content)
    });


}

function sendMsgTest(serverName) {
    // register the connected user

        const chatMessage = {
            channelName: serverName,
            senderId: "UserIDTEST",
            content: "Content test",
            time: new Date()
        };
        stompClient.send("/app/channel", {}, JSON.stringify(chatMessage));

}
$(function () {
    $("#join").click(() => sendMsgTest());
});


// sendMsgTest();


// stompClient.onWebSocketError = (error) => {
//     console.error('Error with websocket', error);
// };
//
// stompClient.onStompError = (frame) => {
//     console.error('Broker reported error: ' + frame.headers['message']);
//     console.error('Additional details: ' + frame.body);
// };
//
// // function setConnected(connected) {
// //     $("#connect").prop("disabled", connected);
// //     $("#disconnect").prop("disabled", !connected);
// //     if (connected) {
// //         $("#conversation").show();
// //     }
// //     else {
// //         $("#conversation").hide();
// //     }
// //     $("#greetings").html("");
// // }
//
// function connect() {
//     stompClient.activate();
// }
//
// function disconnect() {
//     stompClient.deactivate();
//     setConnected(false);
//     console.log("Disconnected");
// }
//
// function sendName() {
//     stompClient.publish({
//         destination: "/app/hello",
//         body: JSON.stringify({'name': $("#name").val()})
//     });
// }
