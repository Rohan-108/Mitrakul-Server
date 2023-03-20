import User from "../mongodb/models/user.js";
import Chat from "../mongodb/models/chat.js";
import Message from "../mongodb/models/message.js";

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res.status(400).json({ message: "plz fill all fields" });
    }
    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    const message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
};

const allMessages = async (req, res) => {
  try {
    const allMessage = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(allMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};
export { sendMessage, allMessages };
