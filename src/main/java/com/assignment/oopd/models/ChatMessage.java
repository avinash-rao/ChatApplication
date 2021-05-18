package com.assignment.oopd.models;

public class ChatMessage {

    private MessageType type;
    private String content;
    private String sender;
    private String roomId;
    private String roomCapacity;


    public String getRoomId() {
        return roomId;
    }

    public String getRoomCapacity() {
        return roomCapacity;
    }

    public void setRoomCapacity(String capacity) {
        this.roomCapacity = capacity;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}
