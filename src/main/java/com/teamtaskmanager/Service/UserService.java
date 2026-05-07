package com.teamtaskmanager.Service;

import com.teamtaskmanager.Entity.User;
import com.teamtaskmanager.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // SIGNUP
    public User registerUser(User user) {

        // EMPTY FIELD CHECK
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new RuntimeException("Name cannot be empty");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        // DUPLICATE EMAIL CHECK
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }

    // LOGIN
    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }

        return null;
    }

    // FIND USER BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}