import { PremiumItemData } from "../components/premium/PremiumItem";

import crewmate_brown from "../public/images/svg/crewmate_brown.svg";
import crewmate_white from "../public/images/svg/crewmate_white.svg";
import crewmate_yellow from "../public/images/svg/crewmate_yellow.svg";
import crewmate_cyan from "../public/images/svg/crewmate_cyan.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

// Text lives in the premium namespace: PremiumItem looks it up from `card` and each perk ID.
export const premium_items: Array<PremiumItemData> = [
    {
        card: "bronze",
        tier: 1,
        accentColor: "#71491e",
        paypalId: "M8D39PF5ADGJW",
        image: crewmate_brown.src,
        price: "US$1.50",
        perks: [
            {
                perk: "gameAccess",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "stats",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "support",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
            {
                perk: "mutingBots",
                value: (
                    <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="text-muted"
                    />
                ),
            },
            {
                perk: "servers",
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
        card: "silver",
        tier: 2,
        accentColor: "#d6e0f0",
        paypalId: "CPZMEL7ZA6PHN",
        image: crewmate_white.src,
        price: "US$3.50",
        perks: [
            {
                perk: "gameAccess",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "stats",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "support",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "mutingBots",
                value: (
                    <>
                        <FontAwesomeIcon icon={faTimes} />
                        <strong> 1</strong>
                    </>
                ),
            },
            {
                perk: "servers",
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
        card: "gold",
        tier: 3,
        accentColor: "#ffd700",
        paypalId: "PYFCA7562KHB6",
        image: crewmate_yellow.src,
        price: "US$5.50",
        perks: [
            {
                perk: "gameAccess",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "stats",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "support",
                value: <FontAwesomeIcon icon={faCheckCircle} />,
            },
            {
                perk: "mutingBots",
                value: (
                    <>
                        <FontAwesomeIcon icon={faTimes} />
                        <strong> 3</strong>
                    </>
                ),
            },
            {
                perk: "servers",
                value: (
                    <>
                        <FontAwesomeIcon icon={faTimes} />
                        <strong className=""> 2</strong>
                    </>
                ),
            },
        ],
    },
    {
        card: "donation",
        accentColor: "#38fedc",
        paypalId: "YM72RY5TF6WZU",
        image: crewmate_cyan.src,
    },
];
