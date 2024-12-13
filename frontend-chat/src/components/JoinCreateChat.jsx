import React, { useState } from "react";
import chatIcon from "../assets/speak.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext.jsx";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const {
    roomId,
    userName,
    setRoomId,
    setCurrentUser,
    connected,
    setConnected,
  } = useChatContext();

  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId == "" || detail.userName == "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        console.log(detail.roomId);

        const room = await joinChatApi(detail.roomId);
        toast.success("Joined successfully");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status == 400) {
          toast.error("Room Not Found");
        } else {
          toast.error("Error in joining");
          console.log(error);
        }
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      console.log(detail);

      try {
        const response = await createRoomApi(detail.roomId);
        console.log(response);
        toast.success("Room Created Successfully !");
        setCurrentUser(detail.userName);
        console.log(detail.userName);
        
        setRoomId(response.data.roomId);
        console.log(response.data.roomId);
        
        setConnected(true);
        //joinChat();
        navigate("/chat");
      } catch (error) {
        console.log(error);
        if (error.status == 400) {
          toast.error("Room already exist !");
        } else {
          toast.error("Error in creating !");
        }
      }
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-10 w-full flex flex-col gap-4 max-w-md rounded-lg dark:bg-gray-800 shadow-lg">
        <div>
          <img src={chatIcon} className="mx-auto w-24" />
        </div>
        <h1 className="text-2xl font-semibold text-center">
          Join Room / Create Room...
        </h1>
        {/*name div */}
        <div className="">
          <label htmlFor="name" className="block font-medium text-sm mb-2">
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            type="text"
            id="name"
            name="userName"
            className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-full text-sm focus:ring-2 focus:outline-none focus:ring-blue-500"
            placeholder="Enter your name"
            aria-label="Enter your name"
          />
        </div>
        {/*room id div */}
        <div className="">
          <label htmlFor="roomid" className="block font-medium text-sm mb-2">
            Room Id / New Room Id
          </label>
          <input
            name="roomId"
            onChange={handleFormInputChange}
            value={detail.roomId}
            type="text"
            id="roomid"
            className="w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 rounded-full text-sm focus:ring-2 focus:outline-none focus:ring-blue-500"
            placeholder="Enter your Room-Id"
            aria-label="Enter your Room-Id"
          />
        </div>
        {/* Button */}
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={joinChat}
            className="px-3 py-3 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={createRoom}
            className="px-3 py-3 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
