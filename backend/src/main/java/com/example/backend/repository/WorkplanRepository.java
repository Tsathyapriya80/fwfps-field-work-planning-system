package com.example.backend.repository;

import com.example.backend.model.Workplan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkplanRepository extends JpaRepository<Workplan, Long> {
}
