package com.chatbot.chat_app_beckend.payload;

import java.time.LocalDateTime;

public class MessageRequest {
    private String content;
    private String sender;
    private String roomId;
    private LocalDateTime messageTime;

    public MessageRequest(String sender, String content, String roomId, LocalDateTime messageTime) {
        this.sender = sender;
        this.content = content;
        this.roomId = roomId;
        this.messageTime = LocalDateTime.now();
    }

    public MessageRequest() {

    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public LocalDateTime getMessageTime() {
        return messageTime;
    }

    public void setMessageTime(LocalDateTime messageTime) {
        this.messageTime = messageTime;
    }
}
