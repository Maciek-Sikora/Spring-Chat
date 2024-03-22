package com.springchat.springchat.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByNickname(String nickname);
    Optional<User> findByUserId(String userId);
}
