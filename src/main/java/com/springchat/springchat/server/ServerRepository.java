package com.springchat.springchat.server;

import com.springchat.springchat.channel.Channel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ServerRepository extends MongoRepository<Server, String> {
    Optional<Server> findByServerName(String serverName);
}
