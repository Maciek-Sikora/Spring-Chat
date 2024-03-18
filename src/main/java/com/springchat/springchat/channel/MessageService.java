package com.springchat.springchat.channel;

import com.springchat.springchat.server.ServerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final ChannelRepository channelRepository;
    private final ServerService serverService;

    public Message save(Message message) throws Exception {
        var serverId = serverService
                .getServerId(message.getServerName())
                .orElseThrow(() -> new Exception("Server not found - " + message.getServerName()));
        message.setSenderId(serverId);
        channelRepository.save(message);
        return message;
    }
    public List<Message> findMessages(String serverName){
        var serverId = serverService.getServerId(serverName);
        return serverId.map(channelRepository::findByServerId).orElse(new ArrayList<>());
    }
}
