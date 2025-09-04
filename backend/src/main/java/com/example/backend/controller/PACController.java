package com.example.backend.controller;

import com.example.backend.model.PAC;
import com.example.backend.repository.PACRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pac")
public class PACController {
    @Autowired
    private PACRepository pacRepository;

    @GetMapping
    public List<PAC> getAll() {
        return pacRepository.findAll();
    }

    @PostMapping
    public PAC create(@RequestBody PAC pac) {
        return pacRepository.save(pac);
    }

    @GetMapping("/{id}")
    public PAC getById(@PathVariable Long id) {
        return pacRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public PAC update(@PathVariable Long id, @RequestBody PAC pac) {
        pac.setId(id);
        return pacRepository.save(pac);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        pacRepository.deleteById(id);
    }
}
