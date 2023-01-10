import { Props as PremiumItemProps } from "../components/premium/PremiumItem"

import crewmate_brown from "../public/images/svg/crewmate_brown.svg";
import crewmate_white from "../public/images/svg/crewmate_white.svg";
import crewmate_yellow from "../public/images/svg/crewmate_yellow.svg";
import crewmate_cyan from "../public/images/svg/crewmate_cyan.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export const premium_items: Array<PremiumItemProps> = [
    {
        cardTitle: "Bronze",
        accentColor: "#71491e",
        buttonText: "Get Bronze",
        paypalId: "M8D39PF5ADGJW",
        image: crewmate_brown.src,
        price: (
            <>
                <strong>US$1.50</strong> <small>/ month</small>
            </>
        ),
        perks: [
            {
                key: "Priority Game Access",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Stats and Leaderboards",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Premium Support",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
            {
                key: "Priority Muting Bots",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
            {
                key: "Premium Servers",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
            {
                key: "Download Raw Data",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
        ],
    },
    {
        cardTitle: "Silver",
        accentColor: "#d6e0f0",
        buttonText: "Get Silver",
        paypalId: "CPZMEL7ZA6PHN",
        image: crewmate_white.src,
        price: (
            <>
                <strong>US$3.50</strong> <small>/ month</small>
            </>
        ),
        perks: [
            {
                key: "Priority Game Access",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Stats and Leaderboards",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Premium Support",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Priority Muting Bots",
                value: (
                    <>
                        <FontAwesomeIcon icon={faTimes} />
                        <strong> 1</strong>
                    </>
                ),
            },
            {
                key: "Premium Servers",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
            {
                key: "Download Raw Data",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
        ],
    },
    {
        cardTitle: "Gold",
        accentColor: "#ffd700",
        buttonText: "Get Gold",
        paypalId: "PYFCA7562KHB6",
        image: crewmate_yellow.src,
        price: (
            <>
                <strong>US$5.50</strong> <small>/ month</small>
            </>
        ),
        perks: [
            {
                key: "Priority Game Access",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Stats and Leaderboards",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Premium Support",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                key: "Priority Muting Bots",
                value: (
                    <>
                        <FontAwesomeIcon icon={faTimes} />
                        <strong> 3</strong>
                    </>
                ),
            },
            {
                key: "Premium Servers",
                value: (
                    <>
                        <FontAwesomeIcon icon={faTimes} />
                        <strong className=""> 2</strong>
                    </>
                ),
            },
            {
                key: "Download Raw Data",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
        ],
    },
    {
        cardTitle: "Donation",
        accentColor: "#38fedc",
        buttonText: "Make Donation",
        paypalId: "YM72RY5TF6WZU",
        image: crewmate_cyan.src,
        description: (
            <div>
                <h6 className="text-blurple">Chip in any amount you wish ❤️</h6>
                <div>
                    You won't get any special bot privileges, but you will get
                    our thanks for making this Open Source project possible!
                </div>
            </div>
        ),
    },
];
