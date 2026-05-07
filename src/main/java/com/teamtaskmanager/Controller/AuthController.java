package com.teamtaskmanager.Controller;

import com.teamtaskmanager.Entity.User;
import com.teamtaskmanager.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    // SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerUser(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // LOGIN
    @PostMapping("/login")
    public User login(@RequestBody User loginData) {
        return userService.loginUser(
                loginData.getEmail(),
                loginData.getPassword());
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}