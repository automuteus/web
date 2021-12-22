import { Table } from "react-bootstrap";

import * as AMUS from "../../utils/interfaces";

function ArgTable(props: {
  cmd: string;
  args: Array<AMUS.CommandArg>;
}): React.ReactElement {
  const { cmd, args } = props;

  if (!args.length)
    return (
      <div className="text-muted">
        <em>None</em>
      </div>
    );

  return (
    <Table striped borderless variant="dark" responsive style={{borderRadius: "5px"}}>
      <thead>
        <tr>
          <th style={{ width: "10%" }}>Name</th>
          <th style={{ width: "10%" }}>Type</th>
          <th style={{ width: "50%" }}>Description</th>
          <th>Values</th>
        </tr>
      </thead>
      <tbody>
        {args.map((a) => (
          <tr key={`${cmd}-arg-${a.name}`}>
            <td className="text-monospace">{a.name}</td>
            <td className="text-monospace">{a.type}</td>
            <td>
              {a.description.map((e, i) => (
                <span key={"desc3-" + i}>{e}</span>
              ))}
            </td>
            <td>
              {a.values ? (
                a.values.map((v) => (
                  <code key={`${cmd}-arg-${a.name}-${v}`} className="mr-2">
                    {v}
                  </code>
                ))
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

export default ArgTable;
