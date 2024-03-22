package com.springchat.springchat.channel;

import com.springchat.springchat.message.Message;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.nio.channels.Channels;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChannelController {
    private final ChannelService channelService;

    @PostMapping("createChannel/{serverName}/{channelName}")
    public ResponseEntity<String> createChannel (@PathVariable String serverName, @PathVariable String channelName) {
        return ResponseEntity.ok(channelService.createChannel(channelName, serverName));
    }

    @GetMapping("channels/{serverName}")
    public ResponseEntity<List<Channel>> getChannelMessages (@PathVariable String serverName) {
        return ResponseEntity.ok(channelService.findChannels(serverName));
    }
}
