package com.springchat.springchat.message;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Message {
    @Id
    private String id;
    private String channelName;
    private String channelId;
    private String serverId;
    private String serverName;
    private String senderId;
    private String content;
    private Date time;
}
