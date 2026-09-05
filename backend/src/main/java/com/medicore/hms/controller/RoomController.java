package com.medicore.hms.controller;
import com.medicore.hms.entity.Room;
import com.medicore.hms.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;
    @GetMapping public ResponseEntity<List<Room>> getAll() { return ResponseEntity.ok(roomService.getAllRooms()); }
    @GetMapping("/{id}") public ResponseEntity<Room> getById(@PathVariable Long id) { return ResponseEntity.ok(roomService.getRoomById(id)); }
    @PostMapping public ResponseEntity<Room> create(@RequestBody Room room) { return new ResponseEntity<>(roomService.createRoom(room), HttpStatus.CREATED); }
    @PutMapping("/{id}") public ResponseEntity<Room> update(@PathVariable Long id, @RequestBody Room room) { return ResponseEntity.ok(roomService.updateRoom(id, room)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { roomService.deleteRoom(id); return ResponseEntity.noContent().build(); }
}
