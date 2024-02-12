import FeatureItemCard from "./FeatureItemCard"
import joystickIcon from "../../assets/joystickIcon.svg"
import lobyIcon from "../../assets/lobyIcon.svg"
import moderationIcon from "../../assets/moderationIcon.svg"
import gamepadIcon from "../../assets/gamepad.svg"
import playtestingIcon from "../../assets/playtestting.svg"
import chatIcon from "../../assets/chat.svg"
import Button from "../ui/Button"

const featureCardsData = [
    {
        id: 1,
        title: "Joysticks",
        subheading: "Subheading about the feature here",
        imgSrc: joystickIcon
    },
    {
        id: 2,
        title: "Lobby",
        subheading: "Subheading about the feature here",
        imgSrc: lobyIcon
    },
    {
        id: 3,
        title: "Moderation",
        subheading: "Subheading about the feature here",
        imgSrc: moderationIcon
    },
    {
        id: 4,
        title: "Gamepads",
        subheading: "Subheading about the feature here",
        imgSrc: gamepadIcon
    },
    {
        id: 5,
        title: "Playtesting",
        subheading: "Subheading about the feature here",
        imgSrc: playtestingIcon
    },
    {
        id: 6,
        title: "Chat",
        subheading: "Subheading about the feature here",
        imgSrc: chatIcon
    },
]
const Features = () => {
    return (
        <div

        >


            <div className="text-center mt-20 md:mt-40 md:self-center ">
                <h2>Ship faster with easy-to-use <br className='hidden md:block' /> integrations & toolkit</h2>
                <p className="my-5 mx-auto lg:w-[50%]">
                    Multiplayer modules can be embedded into any game for speed development and play testing. It’s perfect for teams with faster development cycle to launch games.
                </p>
                <Button className="bg-white">Read Documentation</Button>
            </div>
            <div className="flex carousel rounded-box md:p-14 gap-4 lg:gap-x-[100px] mt-10 md:mt-20 md:grid md:grid-cols-3 md:gap-x-28 ">
                {featureCardsData.map(({ id, imgSrc, title, subheading }) => {
                    return <FeatureItemCard key={id} imgSrc={imgSrc} title={title} subheading={subheading} />
                })}


            </div>
        </div>
    )
}

export default Features