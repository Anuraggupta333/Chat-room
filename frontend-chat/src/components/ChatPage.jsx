import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxioxHelper";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/helper";

export const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();
  // console.log(roomId);
  // console.log(currentUser);
  // console.log(connected);

  const navigate = useNavigate();

  // Effect hook to navigate if the user is not connected
  useEffect(() => {
    console.log("Connected status:", connected);
    if (!connected) {
      console.log("I am here");
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  const [messages, setMessages] = useState([
    // {
    //   content: "hello ?",
    //   sender: "Anurag",
    // },
    // {
    //   content: "hello ?",
    //   sender: "shejal",
    // },
    // {
    //   content: "hello ?",
    //   sender: "puneet",
    // },
    // {
    //   content: "how are you puneet ?",
    //   sender: "Anurag",
    // },
    // {
    //   content: "how are you shejal ?",
    //   sender: "Anurag",
    // },
    // {
    //   content: "I am gud and you anurag ?",
    //   sender: "puneet",
    // },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  //page init

  // message ko load krna hoga

  useEffect(() => {
    async function loadMessages() {
      try {
        const messages = await getMessages(roomId);
        //console.log(messages);
        setMessages(messages);
      } catch (error) {}
    }
    if(connected){
      loadMessages();
    }
   
  }, []);

  //scroll down
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  //stompclient ko init karna hoga
  //subscribe
  useEffect(() => {
    const connectWebSocket = () => {
      //const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(() => new SockJS(`${baseURL}/chat`));
      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected");
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          console.log(message);
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };
    if (connected) {
      connectWebSocket();
    }
  }, [roomId]);
  //send message handle
  const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
      console.log(input);
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
      };
      stompClient.send(
        `/app/sendMessage/${roomId}`,
        {},
        JSON.stringify(message)
      );
      setInput("");
    }
  };
  function handleLogout() {
    stompClient.disconnect();
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
    toast.success("Logout success");
  }

  return (
    <div>
      {/* Header Section */}
      <header className="border-b dark:border-gray-300 fixed w-full dark:bg-gray-900 shadow py-5 flex justify-between items-center px-6">
        {/* Room name container */}
        <div>
          <h1 className="text-xl font-semibold">
            Room: <span>{roomId}</span>
          </h1>
        </div>
        {/* Username container */}
        <div>
          <h1 className="text-xl font-semibold">
            User: <span>{currentUser}</span>
          </h1>
        </div>
        {/* Button: Leave room */}
        <div>
          <button
            onClick={handleLogout}
            className="dark:bg-red-500 dark:hover:bg-red-700 text-white px-4 py-2 rounded-full"
          >
            Leave Room
          </button>
        </div>
      </header>

      {/* Main Content Section */}
      <main
        ref={chatBoxRef}
        className="py-20 px-10 w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto"
      >
        <div className="message-container p-4">
          {/* Add your messages here */}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === currentUser
                  ? " justify-end"
                  : " justify-start"
              }`}
            >
              <div
                className={`my-2 p-2 rounded max-w-xs ${
                  message.sender === currentUser
                    ? "bg-green-800"
                    : "bg-gray-800"
                }`}
              >
                <div className="flex flex-row gap-2 ">
                  <img
                    className="h-10 w-10"
                    src="https://avatar.iran.liara.run/public/19"
                    alt="Image"
                  />
                  <div className=" flex flex-col gap-1">
                    <p className="text-sm font-bold">{message.sender}</p>
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-400">{timeAgo(message.timeStamp)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Message Section */}
      <div className="fixed bottom-4 w-full ">
        <div className="h-16 border dark:border-gray-700 w-2/3 mx-auto rounded-full dark:bg-gray-900 shadow flex items-center px-4">
          {/* Input field */}
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e)=>{
             if(e.key=="Enter"){
              sendMessage()
             }
            }}
            type="text"
            placeholder="Type your message..."
            className="dark:bg-gray-900 dark:border-gray-700 text-white px-4 py-2 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 "
          />
          {/* Buttons */}
          <div className="flex ml-4">
            <button
              className="dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded-full flex items-center justify-center"
              title="Attach File"
            >
              <MdAttachFile />
            </button>
            <button
              onClick={sendMessage}
              className="dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-2 rounded-full flex items-center justify-center ml-2"
              title="Send Message"
            >
              <MdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
