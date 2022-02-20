import { ReactElement } from "react";
import numeral from "numeral";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";

interface Props {
    stat: number | undefined;
    base: number;
    label: string;
    format: string;
}

export default function ServerStat({
    stat,
    base,
    label,
    format,
}: Props): ReactElement {
    const metric =
        stat !== undefined ? (
            <div className="metric">
                {numeral(stat + base).format(format)}
            </div>
        ) : (
            <Spinner className="spinner" animation="grow" />
        );

    return (
        <OverlayTrigger
            placement={"bottom"}
            overlay={
                <Tooltip id={`tooltip-${metric}`}>
                    {stat ? stat + base : ""}
                </Tooltip>
            }
        >
            <div className="stat-card">
                <div className="stat-card-metric">{metric}</div>
                <div className="stat-card-descriptor">{label}</div>
            </div>
        </OverlayTrigger>
    );
}
