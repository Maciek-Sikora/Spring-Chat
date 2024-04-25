package com.springchat.springchat.message;

import com.springchat.springchat.channel.ChannelService;
import com.springchat.springchat.server.ServerService;
import com.springchat.springchat.user.UserServer;
import com.springchat.springchat.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final ChannelService channelService;
    private final ServerService serverService;
    private final UserService userService;
    public Message save(Message message) throws Exception {
        message.setServerId(serverService.getServerId(message.getServerName()));
        var channelId = channelService
                .getChannelId(message.getChannelName(), message.getServerId())
                .orElseThrow(() -> new Exception("Server or channel not found - " + message.getChannelName()));
        message.setChannelId(channelId);
        message.setSenderId(userService.getUserId(message.getSenderName()));
        messageRepository.save(message);
        return message;
    }
    public List<Message> findMessages(String serverName, String channelName){
        var channelId = channelService.getChannelId(channelName, serverService.getServerId(serverName));
        return channelId.map(messageRepository::findByChannelId).orElse(new ArrayList<>());
    }
}
