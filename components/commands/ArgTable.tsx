import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CommandArg } from "../../types/Command";
import CommandDescription from "./CommandDescription";

export default function ArgTable(props: {
    cmd: string;
    args: Array<CommandArg>;
}): React.ReactElement {
    const { cmd, args } = props;
    const { t } = useTranslation("commands");

    if (!args.length)
        return (
            <div className="text-muted">
                <em>{t("table.none")}</em>
            </div>
        );

    return (
        <Table
            striped
            borderless
            variant="dark"
            responsive
            style={{ borderRadius: "5px" }}
        >
            <thead>
                <tr>
                    <th style={{ width: "10%" }}>{t("table.name")}</th>
                    <th style={{ width: "10%" }}>{t("table.type")}</th>
                    <th style={{ width: "50%" }}>{t("table.description")}</th>
                    <th>{t("table.values")}</th>
                </tr>
            </thead>
            <tbody>
                {args.map((a) => (
                    <tr key={`${cmd}-arg-${a.name}`}>
                        <td className="text-monospace" style={{whiteSpace: "nowrap"}}>
                            <code>{a.name}</code>
                        </td>
                        <td className="text-monospace">{a.type}</td>
                        <td>
                            <CommandDescription i18nKey={a.description} />
                        </td>
                        <td>
                            {a.values ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.25rem",
                                    }}
                                >
                                    {a.values.map((v) => (
                                        <code key={`${cmd}-arg-${a.name}-${v}`}>
                                            {v}
                                        </code>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-muted">-</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
