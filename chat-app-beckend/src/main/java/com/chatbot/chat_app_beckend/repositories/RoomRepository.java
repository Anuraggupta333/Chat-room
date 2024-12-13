package com.chatbot.chat_app_beckend.repositories;

import com.chatbot.chat_app_beckend.entites.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends MongoRepository<Room, String> {

    //get room using room id
    Room findByRoomId(String roomId);


}
