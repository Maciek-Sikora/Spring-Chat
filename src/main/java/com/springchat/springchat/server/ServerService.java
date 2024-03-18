package com.springchat.springchat.server;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServerService {

    private final ServerRepository serverRepository;

    public Optional<String> getServerId(String serverName){
        return serverRepository
                .findByServerName(serverName)
                .map(Server::getServerId);
    }

    private String createServer(String serverName){
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
