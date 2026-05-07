package com.teamtaskmanager.Repository;

import com.teamtaskmanager.Entity.Task;
import com.teamtaskmanager.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo(User user);

    long countByStatus(String status);
}