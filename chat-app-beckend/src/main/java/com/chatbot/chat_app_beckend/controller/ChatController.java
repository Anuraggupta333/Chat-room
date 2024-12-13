package com.chatbot.chat_app_beckend.controller;

import com.chatbot.chat_app_beckend.config.AppConstants;
import com.chatbot.chat_app_beckend.entites.Message;
import com.chatbot.chat_app_beckend.entites.Room;
import com.chatbot.chat_app_beckend.payload.MessageRequest;
import com.chatbot.chat_app_beckend.repositories.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class ChatController {

    private final RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    @CrossOrigin(AppConstants.FRONTEND_BASE_URL)
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ) {
        // Fetch the room by roomId
        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            throw new IllegalArgumentException("Room not found with ID: " + roomId);
        }

        // Create a new message
        Message message = new Message();
        message.setSender(request.getSender());
        message.setContent(request.getContent());
        message.setTimeStamp(LocalDateTime.now());

        // Add the message to the room
        room.getMessages().add(message);

        // Save the room (persist the new message)
        roomRepository.save(room);

        // Return the message to be broadcast
        return message;
    }
}
