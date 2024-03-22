package com.springchat.springchat.user;

import com.springchat.springchat.server.Server;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class UserServer {
    @Id
    private String id;
    private String serverId;
    private String userId;
}
