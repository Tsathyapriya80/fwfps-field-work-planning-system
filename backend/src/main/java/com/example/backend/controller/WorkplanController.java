package com.example.backend.controller;

import com.example.backend.model.Workplan;
import com.example.backend.repository.WorkplanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/workplan")
public class WorkplanController {
    @Autowired
    private WorkplanRepository workplanRepository;

    @GetMapping
    public List<Workplan> getAll() {
        return workplanRepository.findAll();
    }

    @PostMapping
    public Workplan create(@RequestBody Workplan workplan) {
        return workplanRepository.save(workplan);
    }

    @GetMapping("/{id}")
    public Workplan getById(@PathVariable Long id) {
        return workplanRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Workplan update(@PathVariable Long id, @RequestBody Workplan workplan) {
        workplan.setId(id);
        return workplanRepository.save(workplan);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        workplanRepository.deleteById(id);
    }
}
