package com.springchat.springchat.user;

import com.springchat.springchat.server.Server;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserServerRepository extends MongoRepository<UserServer, String> {
    Optional<List<UserServer>> findAllByUserId(String userId);
    Optional<List<UserServer>> findAllByServerId(String serverId);

}
