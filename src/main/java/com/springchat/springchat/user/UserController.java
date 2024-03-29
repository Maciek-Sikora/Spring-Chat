package com.springchat.springchat.user;

import com.springchat.springchat.channel.ChannelService;
import com.springchat.springchat.server.Server;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("createUser/{nickname}")
    public ResponseEntity<String> createUser (@PathVariable String nickname) {
        return ResponseEntity.ok(userService.createUser(nickname));
    }

    @PostMapping("joinServer/{nickname}/{serverName}")
    public ResponseEntity<String> joinServer (@PathVariable String nickname, @PathVariable String serverName) {
        return ResponseEntity.ok(userService.joinServer(serverName, nickname));
    }

    @GetMapping("getUsersFromServer/{serverName}")
    public ResponseEntity<Optional<List<User>>> getUsersFromServer (@PathVariable String serverName) {
        return ResponseEntity.ok(userService.getUsersOnServer(serverName));
    }

    @GetMapping("getServersWithUser/{userName}")
    public ResponseEntity<Optional<List<Server>>> getServersWithUser (@PathVariable String userName) {
        return ResponseEntity.ok(userService.getServersWhereUser(userName));
    }

//    @GetMapping("/chat")
//    public String chat() {
//        return "redirect:/chat.html";
//    }

}
