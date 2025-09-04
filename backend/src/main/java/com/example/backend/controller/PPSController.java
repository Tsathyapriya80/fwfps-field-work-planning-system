package com.example.backend.controller;

import com.example.backend.model.PPS;
import com.example.backend.repository.PPSRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pps")
public class PPSController {
    @Autowired
    private PPSRepository ppsRepository;

    @GetMapping
    public List<PPS> getAll() {
        return ppsRepository.findAll();
    }

    @PostMapping
    public PPS create(@RequestBody PPS pps) {
        return ppsRepository.save(pps);
    }

    @GetMapping("/{id}")
    public PPS getById(@PathVariable Long id) {
        return ppsRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public PPS update(@PathVariable Long id, @RequestBody PPS pps) {
        pps.setId(id);
        return ppsRepository.save(pps);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ppsRepository.deleteById(id);
    }
}
