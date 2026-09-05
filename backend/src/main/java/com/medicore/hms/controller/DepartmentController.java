package com.medicore.hms.controller;
import com.medicore.hms.entity.Department;
import com.medicore.hms.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;
    @GetMapping public ResponseEntity<List<Department>> getAll() { return ResponseEntity.ok(departmentService.getAllDepartments()); }
    @GetMapping("/{id}") public ResponseEntity<Department> getById(@PathVariable Long id) { return ResponseEntity.ok(departmentService.getDepartmentById(id)); }
    @PostMapping public ResponseEntity<Department> create(@RequestBody Department d) { return new ResponseEntity<>(departmentService.createDepartment(d), HttpStatus.CREATED); }
    @PutMapping("/{id}") public ResponseEntity<Department> update(@PathVariable Long id, @RequestBody Department d) { return ResponseEntity.ok(departmentService.updateDepartment(id, d)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { departmentService.deleteDepartment(id); return ResponseEntity.noContent().build(); }
}
