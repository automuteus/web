import React from "react";

import { Row } from "react-bootstrap";

import SubscriptionCard from "./SubscriptionCard";

import "./Premium.css";

import crewmate_brown from "../assets/img/crewmate_brown.png";
import crewmate_white from "../assets/img/crewmate_white.png";
import crewmate_yellow from "../assets/img/crewmate_yellow.png";
import crewmate_cyan from "../assets/img/crewmate_cyan.png";

class Premium extends React.Component {
  render() {
    return (
      <div className="text-center">
        <h1>⭐ Premium Tiers ⭐</h1>
        <h6 className="text-muted mb-4">
          Game cap is full, and you want faster muting? Try these!
        </h6>
        <Row xs={1} lg={3} className="justify-content-center">
          <SubscriptionCard
            color="#71491E"
            title="AutoMuteUs Bronze"
            paypal_id="M8D39PF5ADGJW"
            show_fee="true"
            image={crewmate_brown}
          >
            <div>
              <p>
                Offers Basic Premium features for AutoMuteUs! ($1.50* a month)
              </p>
              <ul>
                <li>
                  <em>Priority Game Access:</em>
                  <p>
                    Always be able to make new games, even when the bot is under
                    high load!
                  </p>
                </li>
                <li>
                  <em>
                    Stats and Leaderboards <small>(BETA)</small>:
                  </em>
                  <p>
                    View Among Us stats and leaderboards for the players on your
                    server!
                  </p>
                </li>
              </ul>
            </div>
          </SubscriptionCard>

          <SubscriptionCard
            color="#D6E0F0"
            title="AutoMuteUs Silver"
            paypal_id="CPZMEL7ZA6PHN"
            show_fee="true"
            image={crewmate_white}
          >
            <div>
              <p>
                Offers Standard Premium features for AutoMuteUs! ($3.50* a month)
              </p>
              <ul>
                <li>
                  <em> Includes AutoMuteUs Bronze, but also:</em>
                  <p>
                    1 Priority Muting Bot: Issues requests alongside the main
                    bot; this drastically improves the speed of mutes/deafens in
                    your games!
                  </p>
                </li>
                <li>
                  <em>General Support:</em>
                  <p>
                    Access to Premium-Only channels and chats in our Official
                    Discord!
                  </p>
                </li>
              </ul>
            </div>
          </SubscriptionCard>

          <SubscriptionCard
            color="#F6F658"
            title="AutoMuteUs Gold"
            paypal_id="PYFCA7562KHB6"
            show_fee="true"
            image={crewmate_yellow}
          >
            <div>
              <p>
                Offers Enhanced Premium features for AutoMuteUs! ($5.50* a month)
              </p>
              <ul>
                <li>
                  <em>Includes previous tiers, but also:</em>
                  <p>
                    Multiple Server Premium Status: Get your Gold AutoMuteUs
                    status in 2 servers of your choosing!
                  </p>
                </li>
                <li>
                  <em>3 Priority Muting Bots:</em>
                  <p>
                    3 total Mute Bots to go even further in speeding up your
                    games! Ideal for servers that run multiple games
                    simultaneously!
                  </p>
                </li>
              </ul>
            </div>
          </SubscriptionCard>
        </Row>

        <h1 className="mb-4">💎 Super Awesome Donator Tier 💎</h1>
        <Row xs={1} lg={3} className="justify-content-center">
          <SubscriptionCard
            color="#38fedc"
            title="Donation"
            paypal_id="YM72RY5TF6WZU"
            image={crewmate_cyan}
          >
            <div>
              <p>Chip in any amount you wish ❤️</p>
              <ul>
                <li>
                  <em>Includes:</em>
                  <p>
                    No special bot privileges, but rather our thanks for making
                    this Open Source Project possible!
                  </p>
                </li>
                <li>
                  <em>Why this means so much:</em>
                  <p>
                    Turns out, servers are expensive! This money goes back into
                    the cost of paying for our servers.
                  </p>
                </li>
              </ul>
            </div>
          </SubscriptionCard>
        </Row>
      </div>
    );
  }
}

export default Premium;
