import React from "react";

import { Button, Card, Col, Image } from "react-bootstrap";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class SubscriptionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      guild_id: null,
    };

    this.getGuild = this.getGuild.bind(this);
  }

  onComponentMount() {
    this.getGuild();
  }

  getGuild(e) {
    const urlParams = new URLSearchParams(window.location.search);
    let guild;

    if (!this.props.show_fee) {
      this.setState({ guild_id: "donation" });
    } else if (
      (guild = urlParams.get("guild")) != null &&
      !(guild === null || guild === "" || !this.validateId(guild, false))
    ) {
      this.setState({ guild_id: guild });
    } else {
      // alert('guild id needed');
      let pretext =
        guild !== null ? guild + " (from URL)" : "(17-20 digit guild ID)";
      guild = prompt(
        "Please provide the Server ID you want premium for:",
        pretext
      );
      if (guild === null || guild === "" || !this.validateId(guild, true))
        e.preventDefault();

      this.setState({ guild_id: guild });
    }
  }

  validateId(id, notice) {
    let message = false;

    if (id.length < 17 || id.length > 20 || isNaN(id))
      message =
        "Invalid ID. You can get your Server ID with developer tools in discord.";
    if (message) {
      if (notice) alert(message);
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <Col className="mb-4">
        <Card
          className="text-center bg-dark text-white sub-card h-100"
          style={{ borderColor: this.props.color }}
        >
          <Card.Body>
            <Card.Title style={{ color: this.props.color }}>
              {this.props.title}
              <Image src={this.props.image} />
            </Card.Title>
            <Card.Text className="text-left" as="div">
              {this.props.children}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              href={
                "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
                this.props.paypal_id +
                "&custom=" +
                this.state.guild_id
              }
              className="btn btn-premium m-0"
              onClick={this.getGuild}
            >
              <FontAwesomeIcon icon={faPaypal} size="lg" className="mr-2" />{" "}
              Checkout
            </Button>
            {this.props.show_fee && (
              <small className="d-block mt-2 text-muted">
                *includes 50¢ paypal processing fee
              </small>
            )}
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}
