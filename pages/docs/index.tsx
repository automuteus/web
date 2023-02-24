import { NextPage } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { Button, Card } from "react-bootstrap";
import AppLayout from "../../components/layout/AppLayout";

interface Props {}

const DocsPage: NextPage<Props> = (props) => {
    return (
        <AppLayout
            title="AutoMuteUs - Documentation"
            metaDesc="View documentation related to the AutoMuteUs Discord muting bot."
        >
            <div className={`container pb-4 docsPage`}>
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <h1>Documentation</h1>
                </div>

                <div>
                    Browse pages related to using the AutoMuteUs bot,
                    self-hosting, API interaction, and more
                </div>

                <hr />

                <div className="content">
                    <MyCard title={"Getting Started"} link={"/docs/getting-started"}>
                        Get started with running a game of AmongUs using
                        AutoMuteUs to capture game state and auto-mute players.
                    </MyCard>
                    <MyCard title={"Commands"} link={"/docs/commands"}>
                        Browse the commands available to users when using the
                        bot, and see what options AutoMuteUs Premium unlocks.
                    </MyCard>
                    <MyCard title={"API Integration"} link={"/docs/api"}>
                        Interested in leveraging the game state details provided
                        by AutoMuteUs? Browse the API documentation for the
                        official bot.
                    </MyCard>
                    <MyCard title={"Advanced Usage"} link={"/docs/advanced-usage"}>
                        Learn how increase responsiveness for high-player-count
                        games using the additional capture bot or other advanced options.
                    </MyCard>
                </div>
            </div>
        </AppLayout>
    );
};

export default DocsPage;

function MyCard({
    children,
    title,
    link,
}: {
    children: ReactNode;
    title: string;
    link: string;
}) {
    return (
        <Card>
            <Card.Header>
                <Card.Title as={"h5"} className="my-2">
                    {title}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>{children}</Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex align-items-center gap-2 py-3">
                <Link passHref href={link}>
                    <Button size="sm" className="ms-auto">
                        Read more
                    </Button>
                </Link>
            </Card.Footer>
        </Card>
    );
}
