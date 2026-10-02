import { ReactElement } from "react";
import numeral from "numeral";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";

interface Props {
    /** Stable across languages: used for the tooltip element id. */
    id: string;
    stat: number | undefined;
    base: number;
    label: string;
    format: string;
}

export default function ServerStat({
    id,
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
                <Tooltip id={`tooltip-${id}`}>
                    {stat !== undefined ? stat + base : ""}
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
