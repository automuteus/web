import React from "react";
import { Form, Tooltip, OverlayTrigger } from "react-bootstrap";
export default class EffectToggle extends React.Component {
  render() {
    return (
      <OverlayTrigger
        placement="top"
        delay={{ show: 0, hide: 0 }}
        trigger={['hover', 'focus']}
        overlay={
          <Tooltip id={this.props.name + "tooltip"}>
            {this.props.tooltip}
          </Tooltip>
        }
      >
        <div className="d-inline-block">
          <Form.Switch
            id={this.props.name}
            label={this.props.label}
            onClick={this.props.toggle}
            defaultChecked={!this.props.init}
          ></Form.Switch>
        </div>
      </OverlayTrigger>
    );
  }
}