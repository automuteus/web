import React from "react";
import { GetStaticProps } from "next";
import AppLayout from "../components/layout/AppLayout";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";

export const getStaticProps: GetStaticProps = async () => {
    const user = await prisma.user.findMany({ include: { guilds: true } });
    return {
        props: { user },
    };
};

type Props = {
    user: Array<User>;
};

export default function Home(props: Props): React.ReactElement {
    return (
        <AppLayout>
            <strong>All Users</strong>
            <pre>{JSON.stringify(props.user, null, 2)}</pre>
        </AppLayout>
    );
}
