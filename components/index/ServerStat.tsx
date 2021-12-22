import { ReactElement } from "react";
import numeral from "numeral";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";

interface Props {
  stat: number | undefined;
  base: number;
  label: string;
}

const ServerStat = ({ stat, base, label }: Props): ReactElement => {
  const metric =
    stat !== undefined ? (
      <div className="metric">{numeral(stat + base).format("0a")}</div>
    ) : (
      <Spinner className="spinner" animation="grow" />
    );

  return (
    <OverlayTrigger
      placement={"bottom"}
      overlay={
        <Tooltip id={`tooltip-${metric}`}>{stat ? stat + base : ""}</Tooltip>
      }
    >
      <div className="stat-card">
        <div className="stat-card-metric">{metric}</div>
        <div className="stat-card-descriptor">{label}</div>
      </div>
    </OverlayTrigger>
  );
};

export default ServerStat;
