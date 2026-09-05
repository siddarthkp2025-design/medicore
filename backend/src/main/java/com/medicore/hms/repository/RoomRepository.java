package com.medicore.hms.repository;
import com.medicore.hms.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(String status);
    List<Room> findByRoomType(String type);
    Optional<Room> findByRoomNumber(String number);
    long countByStatus(String status);
}
