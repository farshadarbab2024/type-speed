import { useEffect, useRef, useState } from "react";
import { IoTime } from "react-icons/io5";
import { IoIosSpeedometer } from "react-icons/io";
import { ImTarget } from "react-icons/im";
import TimeFormat from "hh-mm-ss";
import { Modal, Rate } from "antd";
import { FiRefreshCcw } from "react-icons/fi";
import React from "react" ; 
interface NavbarItem {
  icon: React.ElementType;
  number: string;
  text: string;
}

function typeSpeed() {
  const [text, setText] = useState<string[]>([]); //list of characters
  const textRef = useRef<string[]>([]);
  const [charIndex, setCharIndex] = useState<number>(0);
  const key = useRef<string>("");
  const [time, setTime] = useState<number>(0);
  const [standardTime, setStandardTime] = useState<string>("00:00");
  const isStarted = useRef<boolean>(false);
  const [isTypeWrong, setIsTypeWrong] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0);
  const charInWord = 5;
  const [accuracy, setAccuracy] = useState<number>(0);
  const [pressKeyNumber, setPressKeyNumber] = useState<number>(0);
  const [endModalShow, setEndModalShow] = useState<boolean>(false);

  const texts = [
    "if I could free my hands, he thought, I might throw off the noose and spring into the stream. By diving I could evade the bullets and, swimming vigorously, reach the bank, take to the woods and get away home. after that we had a most tranquil season during three months. The bill was prodigious of course and I had said I would not pay it until the new machinery had proved itself to be flawless.",
  ];

  const qualifications = {
    1: {
      title: "Disaster!",
      describe:
        "You were completely bad but don't worry it's the process of learning",
    },
    2: {
      title: "Not Good!",
      describe:
        "You are not good enough but don't worry, you can practice more.",
    },
    3: {
      title: "Not Bad",
      describe: "Your skill is not bad and it is not good also.",
    },
    4: {
      title: "Good!",
      describe: "You were good but not perfect still.",
    },
    5: {
      title: "Impressive!",
      describe: "You were perfect. congradulation!",
    },
  };

  const navbarItems: NavbarItem[] = [
    {
      icon: IoTime,
      number: standardTime,
      text: "Time: ",
    },
    {
      icon: IoIosSpeedometer,
      number: String(speed),
      text: "Words in minutes: ",
    },
    {
      icon: ImTarget,
      number: String(accuracy) + "%",
      text: "Accuracy: ",
    },
  ];

  const handleKeyPress = (e: any) => {
    const pressedKey = e.key;
    if (pressedKey == "Shift") {
      return;
    }
    isStarted.current = true;

    setPressKeyNumber((prev) => prev + 1);

    if (pressedKey == key.current) {
      setCharIndex((prev) => prev + 1);
      setIsTypeWrong(false);
    } else {
      setIsTypeWrong(true);
    }
  };

  //   update current character
  useEffect(() => {
    key.current = text[charIndex];
  }, [charIndex]);

  //    accuracy
  useEffect(() => {
    if (pressKeyNumber == 0) {
      setAccuracy(0);
      return;
    }
    setAccuracy(Math.floor((charIndex / pressKeyNumber) * 100));
  }, [pressKeyNumber]);

  //   calculate speed
  useEffect(() => {
    const forwardCharNum = charIndex + 1;
    const forwardWordsNum = forwardCharNum / charInWord;
    const timeInMinutes = time / 60;
    if (timeInMinutes == 0) {
      setSpeed(0);
      return;
    }
    setSpeed(Math.floor(forwardWordsNum / timeInMinutes));
  }, [time, charIndex]);

  //   Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (isStarted.current) {
        setTime((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //   make time standard to show
  useEffect(() => {
    setStandardTime(TimeFormat.fromS(time, "mm:ss"));
  }, [time]);

  //   select a text
  useEffect(() => {
    const random = Math.floor(Math.random() * texts.length);
    const text: string = texts[random];
    const arrayText: string[] = text.split(""); // convert string to array of characters
    key.current = arrayText[0];
    setText(arrayText);
  }, []);

  //   event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  //   keep textRef up to date
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  //   when ends
  useEffect(() => {
    if (charIndex >= text.length && text.length != 0) {
      isStarted.current = false; //stop the timer
      setEndModalShow(true);
    }
  }, [charIndex]);

  const getRate = (): 1 | 2 | 3 | 4 | 5 => {
    if (speed > 75 && accuracy > 98) {
      return 5;
    } else if (speed > 60 && accuracy > 95) {
      return 4;
    } else if (speed > 55 && accuracy > 90) {
      return 3;
    } else if (speed > 40 && accuracy > 80) {
      return 2;
    } else {
      return 1;
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  const getSpeedQuality = () => {
    if (speed > 70) {
      return "impressive";
    } else if (speed > 60) {
      return "good";
    } else if (speed > 50) {
      return "not bad";
    } else if (speed > 40) {
      return "bad";
    } else if (speed < 30) {
      return "disaster";
    }
  };

  const getAccuracyQuality = () => {
    if (accuracy > 98) {
      return "impressive";
    } else if (speed > 95) {
      return "good";
    } else if (speed > 90) {
      return "not bad";
    } else if (speed > 75) {
      return "bad";
    } else if (speed < 55) {
      return "disaster";
    }
  };

  return (
    <div className="w-[1200px] mx-auto max-w-[90vw] py-12">
      {/* Top Navbar */}
      <div className="flex items-center justify-between w-[800px] mx-auto">
        {navbarItems.map((item: NavbarItem, index: number) => {
          return (
            <div
              key={"item" + index}
              className="flex items-center justify-start gap-x-1"
            >
              <item.icon className="!text-[25px] text-custom-black" />
              <span className="text-2xl font-semibold ml-2 !text-custom-black">
                {item?.text} {item?.number}
              </span>
            </div>
          );
        })}
      </div>

      {/* Text Area */}
      <div
        className="bg-[#fbfbfb] rounded-xl p-4 leading-loose
        max-h-[420px] overflow-y-auto mt-4 text-justify
        text-[30px] overflow-x-hidden"
      >
        {text.map((char, index: number) => {
          const isCurrent = charIndex == index;
          const isPast = index < charIndex;

          let bg: string;
          let borderBottom: string;
          let color: string;
          if (isCurrent) {
            if (isTypeWrong) {
              bg = "#fc9797";
              borderBottom = "#cc1212";
              color = "#cc1212";
            } else {
              bg = "var(--main-background)";
              borderBottom = "4px solid var(--main-color)";
              color = "var(--main-color)";
            }
          } else if (isPast) {
            bg = "#fbfbfb";
            borderBottom = "";
            color = "var(--main-color)";
          } else {
            bg = "#fbfbfb";
            borderBottom = "";
            color = "var(--custom-black)";
          }
          return (
            <span
              className="mr-[1px] px-[2px]"
              key={"character" + index}
              style={{
                backgroundColor: bg,
                borderBottom: borderBottom,
                color: color,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Start Again */}
      <div
        className="rounded-full full w-[100px] h-[100px] flex items-center
      justify-center border-[3px] border-main-color cursor-pointer mt-12 mx-auto"
        onClick={refresh}
      >
        <FiRefreshCcw size={50} className="text-custom-black" />
      </div>

      {/* End Modal */}
      <Modal footer={false} closable={false} open={endModalShow} width={700}>
        <span
          className="text-[40px] text-center font-bold block
        text-custom-black"
        >
          {qualifications[getRate()]?.title}
        </span>
        <p className="text-center !text-gray2">
          {qualifications[getRate()]?.describe}
        </p>
        <div className="flex items-center justify-center mt-6">
          <Rate
            disabled
            defaultValue={getRate()}
            size="large"
            className="block "
          />
        </div>

        <div className="flex justify-between w-[500px] mx-auto mt-16">
          <div>
            <ImTarget size={50} className="mx-auto" />
            <span className="text-[22px] font-bold block text-center">
              {accuracy}% accuracy
            </span>
            <span className="text-center block mx-auto text-gray2">
              {getAccuracyQuality()}
            </span>
          </div>
          <div>
            <IoIosSpeedometer size={50} className="mx-auto" />
            <span className="text-[22px] font-bold block text-center">
              {speed} words per minute
            </span>
            <span className="text-center block mx-auto text-gray2">
              {getSpeedQuality()}
            </span>
          </div>
        </div>

        <div
          className="w-[100px] h-[60px] border-[2px] border-main-color
        flex items-center justify-center rounded-full mt-8 mx-auto
        cursor-pointer"
          onClick={refresh}
        >
          <FiRefreshCcw size={22} />
        </div>
      </Modal>
    </div>
  );
}

export default typeSpeed;

