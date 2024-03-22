package com.springchat.springchat.channel;

import com.springchat.springchat.message.Message;
import com.springchat.springchat.server.ServerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final ServerService serverService;

    public Optional<String> getChannelId(String channelName, String serverId){
        return channelRepository
                .findByChannelNameAndServerId(channelName, serverId)
                .map(Channel::getChannelId);
    };

    public List<Channel> findChannels(String serverName){
        return channelRepository
                .findChannelsByServerId(serverService.getServerId(serverName));
    }


    public String createChannel(String channelName, String serverName){
        var channelId = channelName + UUID.randomUUID();
        Channel channel = Channel
                .builder()
                .channelId(channelId)
                .channelName(channelName)
                .serverId(serverService.getServerId(serverName))
                .build();

        channelRepository.save(channel);
        return channelId;
    }

}
