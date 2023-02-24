import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import AppLayout from "../../components/layout/AppLayout";

interface Props {}

const SelfHostingPage: NextPage<Props> = (props) => {
    return (
        <AppLayout
            title="AutoMuteUs - Advanced Usage"
            metaDesc="View documentation related to the AutoMuteUs Discord muting bot."
        >
            <div className={`container pb-4 apiPage`}>
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <h1 className="mb-0">Documentation</h1>
                        <FontAwesomeIcon size="lg" icon={faAngleRight} />
                        <h3 className="mb-0">Advanced Usage</h3>
                    </div>
                </div>

                <div>
                    Learn how increase responsiveness for high-player-count
                    games using the additional capture bot or other advanced
                    options
                </div>

                <hr />

                <div className="content"></div>
            </div>
        </AppLayout>
    );
};

export default SelfHostingPage;
