import { Link } from "react-router-dom";
import "./homepage.css";
import { TypeAnimation } from "react-type-animation";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="left">
        <h1>CHATAI</h1>
        <h2>Chat with AI</h2>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot" />
          <div className="chat">
            <img src="/bot.png" alt=""></img>
            <TypeAnimation
              sequence={[
                "Chat with an AI assistant",
                1000,
                "Ask anything, anytime",
                1000,
                "Your personal AI guide",
                1000,
                "Get insights from AI",
                1000,
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
