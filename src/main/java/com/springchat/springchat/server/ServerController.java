package com.springchat.springchat.server;

import com.springchat.springchat.channel.Channel;
import com.springchat.springchat.channel.ChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ServerController {

    private final ServerService serverService;

    @PostMapping("createServer/{serverName}")
    public ResponseEntity<String> createServer (@PathVariable String serverName) {
        return ResponseEntity.ok(serverService.createServer(serverName));
    }

    @GetMapping("servers")
    public ResponseEntity<List<Server>> getServers () {
        return ResponseEntity.ok(serverService.getServers());
    }

}
