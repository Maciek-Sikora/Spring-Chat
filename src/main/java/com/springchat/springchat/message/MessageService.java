package com.springchat.springchat.message;

import com.springchat.springchat.channel.ChannelService;
import com.springchat.springchat.server.ServerService;
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
    public Message save(Message message) throws Exception {
        var channelId = channelService
                .getChannelId(message.getChannelName(), message.getServerName())
                .orElseThrow(() -> new Exception("Server or channel not found - " + message.getChannelName()));
        message.setChannelId(channelId);
        message.setServerId(serverService.getServerId(message.getServerName()));
        messageRepository.save(message);
        return message;
    }
    public List<Message> findMessages(String channelName, String serverName){
        var channelId = channelService.getChannelId(channelName, serverName);
        return channelId.map(messageRepository::findByChannelId).orElse(new ArrayList<>());
    }
}
