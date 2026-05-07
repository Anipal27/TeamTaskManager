package com.teamtaskmanager.Service;

import com.teamtaskmanager.Entity.Task;
import com.teamtaskmanager.Entity.User;
import com.teamtaskmanager.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // CREATE TASK
    public Task createTask(Task task) {

        // EMPTY TITLE
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Task title cannot be empty");
        }

        // DEADLINE REQUIRED
        if (task.getDeadline() == null) {
            throw new RuntimeException("Deadline is required");
        }

        // INVALID PAST DATE
        if (task.getDeadline().isBefore(LocalDate.now())) {
            throw new RuntimeException("Deadline cannot be in the past");
        }

        // DEFAULT STATUS
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("Pending");
        }

        return taskRepository.save(task);
    }

    // GET TASKS FOR MEMBER
    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByAssignedTo(user);
    }

    // UPDATE TASK STATUS
    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId).orElse(null);

        if (task != null) {
            task.setStatus(status);
            return taskRepository.save(task);
        }

        return null;
    }

    // DASHBOARD COUNTS
    public long getTaskCountByStatus(String status) {
        return taskRepository.countByStatus(status);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}