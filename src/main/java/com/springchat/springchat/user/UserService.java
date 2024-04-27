package com.springchat.springchat.user;

import com.springchat.springchat.server.Server;
import com.springchat.springchat.server.ServerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserServerRepository userServerRepository;
    private final UserRepository userRepository;
    private final ServerService serverService;
    public String getUserId(String nickname){
        return userRepository
                .findByNickname(nickname)
                .orElseThrow(() -> new NoSuchElementException("User not found for nickname: " + nickname))
                .getUserId();
    };

    public Optional<User> getUser(String nickname){
        return userRepository
                .findByNickname(nickname);
    };

    public Optional<List<User>> getUsersOnServer(String serverName) {
        var serverId = serverService.getServerId(serverName);
        return userServerRepository
                .findAllByServerId(serverId)
                .map(userServers ->
                        userServers.stream()
                                .map(UserServer::getUserId)
                                .map(userRepository::findByUserId)
                                .filter(Optional::isPresent)
                                .map(Optional::get)
                                .collect(Collectors.toList())

                );
    }

    public Optional<List<Server>> getServersWhereUser(String nickname) {
        var userId = getUserId(nickname);
        return userServerRepository
                .findAllByUserId(userId)
                .map(userServers ->
                        userServers.stream()
                                .map(UserServer::getServerId)
                                .map(serverService::getServer)
                                .collect(Collectors.toList())

                );
    }

    public String createUser(String nickname){
        var userId = nickname + UUID.randomUUID();
        User user = User
                .builder()
                .userId(userId)
                .nickname(nickname)
                .build();

        userRepository.save(user);
        return userId;
    }

    public String joinServer(String serverName, String nickname){
        String serverId = serverService.getServerId(serverName);

        if (serverId == null) {
            serverService.createServer(serverName);
        }

        userServerRepository.save(
                UserServer.builder()
                        .serverId(serverService.getServerId(serverName))
                        .userId(getUserId(nickname))
                        .build()
        );
        return "Server joined successfully";
    }
}
