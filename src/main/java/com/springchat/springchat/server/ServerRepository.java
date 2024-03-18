package com.springchat.springchat.server;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ServerRepository extends MongoRepository<Server, String> {
    Optional<Server> findByServerName(String serverName);
}
