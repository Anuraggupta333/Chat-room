package com.chatbot.chat_app_beckend.entites;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;


@Document(collection = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    private String id; // Mongo db : unique identifier
    private String roomId;

    private List<Message> messages = new ArrayList<>();


    public void setRoomId(String roomId) {
           this.roomId=roomId;
    }

    public List<Message> getMessages() {
        return messages;
    }
}