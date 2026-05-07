package com.teamtaskmanager.Controller;

import com.teamtaskmanager.Entity.Project;
import com.teamtaskmanager.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin("*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @GetMapping("/all")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
}