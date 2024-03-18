package com.springchat.springchat.server;


import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Server {
    @Id
    private String id;
    private String serverId;
}
