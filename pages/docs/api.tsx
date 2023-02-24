import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { BotInfo } from "../../types/api/BotInfo";

interface Props {}

const APIPage: NextPage<Props> = (props) => {
    return (
        <AppLayout
            title="AutoMuteUs - API Integration"
            metaDesc="View documentation related to the AutoMuteUs Discord muting bot."
        >
            <div className={`container pb-4 apiPage`}>
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <h1 className="mb-0">Documentation</h1>
                        <FontAwesomeIcon size="lg" icon={faAngleRight} />
                        <h3 className="mb-0">API Integration</h3>
                    </div>
                </div>

                <div>
                    Interested in leveraging the game state details provided by
                    AutoMuteUs? Browse the API documentation for the official
                    bot
                </div>

                <hr />

                <div className="content">
                    <h5>API Status</h5>
                    <APIStatusRow />
                </div>
            </div>
        </AppLayout>
    );
};

export default APIPage;

function APIStatusRow() {
    const [stats, setStats] = useState<BotInfo | undefined>();

    useEffect(() => {
        function getAlerts() {
            fetch("/api/bot/info")
                .then((result) => result.json())
                .then((result) => setStats(result));
        }
        getAlerts();

        const interval = setInterval(() => getAlerts(), 5000);

        console.log("stats", stats);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="api-status">
            <div className="status-card" key={`stats-shardID-${stats?.shardID}`}>
                <div className="metric">{stats?.shardID ?? "-"}</div>
                <div className="label">Shard ID</div>
            </div>
            <div className="status-card" key={`stats-version-${stats?.version}`}>
                <div className="metric">{stats?.version ?? "-"}</div>
                <div className="label">Version</div>
            </div>
            <div className="status-card" key={`stats-commit-${stats?.commit}`}>
                <div className="metric">{stats?.commit ?? "-"}</div>
                <div className="label">Commit</div>
            </div>
            <div className="status-card" key={`stats-shardCount-${stats?.shardCount}`}>
                <div className="metric">{stats?.shardCount ?? "-"}</div>
                <div className="label">Shard Count</div>
            </div>
            <div className="status-card" key={`stats-totalGuilds-${stats?.totalGuilds}`}>
                <div className="metric">{stats?.totalGuilds ?? "-"}</div>
                <div className="label">Total Servers</div>
            </div>
            <div className="status-card" key={`stats-activeGames-${stats?.activeGames}`}>
                <div className="metric">{stats?.activeGames ?? "-"}</div>
                <div className="label">Active Games</div>
            </div>
            <div className="status-card" key={`stats-totalUsers-${stats?.totalUsers}`}>
                <div className="metric">{stats?.totalUsers ?? "-"}</div>
                <div className="label">Total Users</div>
            </div>
            <div className="status-card" key={`stats-totalGames-${stats?.totalGames}`}>
                <div className="metric">{stats?.totalGames ?? "-"}</div>
                <div className="label">Total Games</div>
            </div>
        </div>
    );
}
