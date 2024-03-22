package com.springchat.springchat.message;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class MessageController {

    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/message")
    public Message acceptMessage(@Payload Message message) throws Exception {
        Message saved = messageService.save(message);
        simpMessagingTemplate.convertAndSendToUser(
                message.getChannelName(), "/queue/messages",
                new Message(
                        saved.getId(),
                        saved.getChannelName(),
                        saved.getChannelId(),
                        saved.getServerId(),
                        saved.getServerName(),
                        saved.getSenderId(),
                        saved.getContent(),
                        saved.getTime()
                )
        );
        return saved;
    }

    @GetMapping("messages/{serverName}/{channelName}")
    public ResponseEntity<List<Message>> getChannelMessages (@PathVariable String serverName, @PathVariable String channelName) {
        return ResponseEntity.ok(messageService.findMessages(serverName, channelName));
    }


}
