package com.springchat.springchat.channel;

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
public class ChannelController {

    @Autowired
//    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageService messageService;

    @MessageMapping("/channel")
    public void acceptMessage(@Payload Message message) throws Exception {
        Message saved = messageService.save(message);
        // TODO: Finish this part with simpMessagingTemplate
    }

    @GetMapping("messages/{serverName}")
    public ResponseEntity<List<Message>> getChannelMessages (@PathVariable String serverName) {
        return ResponseEntity.ok(messageService.findMessages(serverName));
    }


}
