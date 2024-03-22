package com.springchat.springchat.channel;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ChannelRepository extends MongoRepository<Channel, String> {
    Optional<Channel> findByChannelNameAndServerId(String channelName, String serverId);
    List<Channel> findChannelsByServerId(String serverId);
}
