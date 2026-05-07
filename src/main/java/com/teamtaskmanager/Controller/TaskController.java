package com.teamtaskmanager.Controller;

import com.teamtaskmanager.Entity.Task;
import com.teamtaskmanager.Entity.User;
import com.teamtaskmanager.Service.TaskService;
import com.teamtaskmanager.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    // CREATE TASK
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // GET TASKS BY USER
    @GetMapping("/user/{id}")
    public List<Task> getTasksByUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return taskService.getTasksByUser(user);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public Task updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return taskService.updateTaskStatus(id, status);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }
}