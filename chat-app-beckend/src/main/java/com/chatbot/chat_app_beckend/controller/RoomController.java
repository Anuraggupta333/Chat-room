package com.chatbot.chat_app_beckend.controller;

import com.chatbot.chat_app_beckend.config.AppConstants;
import com.chatbot.chat_app_beckend.entites.Message;
import com.chatbot.chat_app_beckend.entites.Room;
import com.chatbot.chat_app_beckend.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin(AppConstants.FRONTEND_BASE_URL)
public class RoomController {
   @Autowired
   private RoomRepository roomRepository;

    //create room
    @PostMapping
    public ResponseEntity<?> createRoom (@RequestBody String roomId){
        if(roomRepository.findByRoomId(roomId)!= null){
            return ResponseEntity
                    .badRequest()
                    .body("Room is already exists!");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        roomRepository.save(room);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(room);
    }


    //get room
    @GetMapping("/{roomId}")
    @CrossOrigin("*")
    public ResponseEntity<?> joinRoom(
            @PathVariable String roomId
    ){
      Room room =roomRepository.findByRoomId(roomId);
      if(room== null){
          return ResponseEntity
                  .badRequest()
                  .body( "Room not found !");

      }
          return ResponseEntity
                  .ok(room);
    }

    @GetMapping("/{roomId}/messages")
    @CrossOrigin("*")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        // Find the room by ID
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body(null); // Return bad request if room not found
        }

        // Get the list of messages from the room
        List<Message> messages = room.getMessages();

        // Calculate the start and end indices for pagination
        int start = Math.max(0, page * size); // Start index based on page number
        int end = Math.min(messages.size(), start + size); // End index based on page size

        // Get the paginated list of messages
        List<Message> paginatedMessages = messages.subList(start, end);

        // Return the paginated list in the response
        return ResponseEntity.ok(paginatedMessages);
    }




}
