import React from "react";

import { Button, Card, Col, Image } from "react-bootstrap";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class PaymentComplete extends React.Component {
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
        </Card>
      </Col>
    );
  }
}
