package com.medicore.hms.service;
import com.medicore.hms.entity.Room;
import com.medicore.hms.exception.ResourceNotFoundException;
import com.medicore.hms.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    public List<Room> getAllRooms() { return roomRepository.findAll(); }
    public Room getRoomById(Long id) { return roomRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Room not found")); }
    public Room createRoom(Room room) {
        if (room.getStatus() == null || room.getStatus().trim().isEmpty()) {
            room.setStatus("Available");
        }
        return roomRepository.save(room);
    }
    public Room updateRoom(Long id, Room room) {
        Room existing = getRoomById(id);
        if (room.getRoomNumber() != null) existing.setRoomNumber(room.getRoomNumber());
        if (room.getRoomType() != null) existing.setRoomType(room.getRoomType());
        if (room.getFloorNumber() != null) existing.setFloorNumber(room.getFloorNumber());
        if (room.getStatus() != null) existing.setStatus(room.getStatus());
        if (room.getDailyCharge() != null) existing.setDailyCharge(room.getDailyCharge());
        return roomRepository.save(existing);
    }
    public void deleteRoom(Long id) { roomRepository.deleteById(id); }
}
