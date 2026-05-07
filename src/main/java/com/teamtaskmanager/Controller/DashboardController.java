package com.teamtaskmanager.Controller;

import com.teamtaskmanager.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("Pending", taskService.getTaskCountByStatus("Pending"));
        stats.put("In Progress", taskService.getTaskCountByStatus("In Progress"));
        stats.put("Done", taskService.getTaskCountByStatus("Done"));

        return stats;
    }
}