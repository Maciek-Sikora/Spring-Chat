package com.springchat.springchat.channel;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChannelRepository extends MongoRepository<Message, String> {
    List<Message> findByServerId(String serverId);
}
