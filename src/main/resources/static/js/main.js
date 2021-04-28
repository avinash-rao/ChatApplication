"use strict";

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var createRoomForm = document.querySelector("#createRoomForm");
var messageForm = document.querySelector("#messageForm");
var messageInput = document.querySelector("#message");
var messageArea = document.querySelector("#messageArea");
var connectingElement = document.querySelector(".connecting");

var stompClient = null;
var username = null;
let roomId = null;

let roomIds = [];

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function randomNumberGenerator(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function createRoom() {
    username = document.querySelector("#name-to-create").value.trim();
    while (roomId == null && roomIds.includes(roomId)) {
        roomId = randomNumberGenerator(1, 10);
    }
    roomIds.push(roomId);
    connect();
}

function joinRoom() {
    username = document.querySelector("#name-to-join").value.trim();
    roomId = document.querySelector("#roomId").value.trim();
    connect();
}

function connect(event) {

    if (username) {
        usernamePage.classList.add("hidden");
        chatPage.classList.remove("hidden");

        var socket = new SockJS("/ws");
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    //subscribe to the public topic
    stompClient.subscribe("/topic/" + roomId, onMessageReceived);

    //Tell your name to the server
    stompClient.send("/app/chat.addUser", {},
        JSON.stringify({ sender: username, type: "JOIN" })
    )
    connectingElement.classList.add("hidden");
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = "";
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    var messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

createRoomForm.addEventListener("submit", createRoom, true);
joinRoomForm.addEventListener("submit", joinRoom, true);
messageForm.addEventListener("submit", sendMessage, true);