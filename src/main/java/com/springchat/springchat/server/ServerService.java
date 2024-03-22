package com.springchat.springchat.server;

import com.springchat.springchat.channel.Channel;
import com.springchat.springchat.channel.ChannelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServerService {

    private final ServerRepository serverRepository;

    public String getServerId(String serverName){
        return serverRepository
                .findByServerName(serverName)
                .map(Server::getServerId)
                .orElseGet(() -> {
                    var serverId = createServer(serverName);
                    return serverId;
                });
    };

    public List<Server> getServers() {
        return serverRepository.findAll();
    }


    public String createServer(String serverName){
        var serverId = serverName + UUID.randomUUID();
        Server server = Server
                .builder()
                .serverId(serverId)
                .serverName(serverName)
                .build();

        serverRepository.save(server);
        return serverId;
    }
}
