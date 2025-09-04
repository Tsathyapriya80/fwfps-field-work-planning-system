package com.example.backend.controller;

import com.example.backend.model.Operation;
import com.example.backend.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/operation")
public class OperationController {
    @Autowired
    private OperationRepository operationRepository;

    @GetMapping
    public List<Operation> getAll() {
        return operationRepository.findAll();
    }

    @PostMapping
    public Operation create(@RequestBody Operation operation) {
        return operationRepository.save(operation);
    }

    @GetMapping("/{id}")
    public Operation getById(@PathVariable Long id) {
        return operationRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Operation update(@PathVariable Long id, @RequestBody Operation operation) {
        operation.setId(id);
        return operationRepository.save(operation);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        operationRepository.deleteById(id);
    }
}
