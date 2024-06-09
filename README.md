# Spring Chat - Real-Time Chat Application

Spring Chat is a real-time chat application built using Java Spring Boot and WebSocket technology. It allows users to join chat servers, create channels, and communicate with each other in real-time.
![image](https://github.com/Maciek-Sikora/Spring-Chat/assets/43787380/f301a4e4-200d-4617-8160-051baf230e5d)

## Features

- Join chat servers with a nickname.
- Create and join channels within chat servers.
- Send and receive messages in real-time.
- View the list of online users.
- Timestamps for messages to indicate when they were sent.

![image](https://github.com/Maciek-Sikora/Spring-Chat/assets/43787380/0648981b-bd79-4af2-90ed-102b02de0ebc)


## Technologies Used

- Java Spring Boot: Backend framework for building the application.
- WebSocket: Enables real-time bidirectional communication between clients and servers.
- MongoDB: NoSQL database for storing chat-related data.
- HTML, CSS, JavaScript: Frontend technologies for user interface and interaction.
- SockJS and STOMP: WebSocket client libraries for connecting to WebSocket server endpoints.
- Lombok: Java library for reducing boilerplate code.

![image](https://github.com/Maciek-Sikora/Spring-Chat/assets/43787380/559d4a8f-9ff1-43ab-b95c-18c39fb4a476)

## Websocket
WebSocket allows for full-duplex communication channels over a single TCP connection, facilitating seamless bi-directional data exchange. Designed to support instantaneous message delivery, WebSocket ensures that users can send and receive messages in real-time without the need for constant polling or refreshing of the web page.bIn the context of the Spring Chat app, WebSocket functionality is implemented using Java Spring Boot and leverages the SockJS and STOMP libraries for WebSocket communication
