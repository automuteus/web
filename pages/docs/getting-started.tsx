import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import AppLayout from "../../components/layout/AppLayout";

interface Props {}

const GettingStartedPage: NextPage<Props> = (props) => {
    return (
        <AppLayout
            title="AutoMuteUs - Getting Started"
            metaDesc="View documentation related to the AutoMuteUs Discord muting bot."
        >
            <div className={`container pb-4 apiPage`}>
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <h1 className="mb-0">Documentation</h1>
                        <FontAwesomeIcon size="lg" icon={faAngleRight} />
                        <h3 className="mb-0">Getting Started</h3>
                    </div>
                </div>

                <div>
                    Get started with running a game of AmongUs using AutoMuteUs
                    to capture game state and auto-mute players
                </div>

                <hr />

                <div className="content"></div>
            </div>
        </AppLayout>
    );
};

export default GettingStartedPage;
