package com.teamtaskmanager.Service;

import com.teamtaskmanager.Entity.Project;
import com.teamtaskmanager.Repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Project createProject(Project project) {

        if (project.getName() == null || project.getName().trim().isEmpty()) {
            throw new RuntimeException("Project title cannot be empty");
        }

        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}