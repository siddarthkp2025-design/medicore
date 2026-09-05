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
    public Room createRoom(Room room) { return roomRepository.save(room); }
    public Room updateRoom(Long id, Room room) {
        Room existing = getRoomById(id);
        existing.setRoomType(room.getRoomType());
        existing.setStatus(room.getStatus());
        existing.setDailyCharge(room.getDailyCharge());
        return roomRepository.save(existing);
    }
    public void deleteRoom(Long id) { roomRepository.deleteById(id); }
}
