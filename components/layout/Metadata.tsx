import { useTranslation } from "react-i18next";

interface Props {
    metaTitle?: string;
    metaDesc?: string;
    metaImg?: string;
}

const defaultImg = `https://automute.us/images/logo_embed.png`;

const Metadata = ({
    metaTitle,
    metaDesc,
    metaImg,
}: Props): React.ReactElement => {
    const { t } = useTranslation("common");
    const defaultTitle = t("meta.title");
    const defaultDesc = t("meta.description");
    return (
        <>
            <meta name="description" content={metaDesc ?? defaultDesc} />
            <meta name="theme-color" content="#7289DA" />

            {/* Google / Search Engine Tags */}
            <meta
                itemProp="name"
                content={metaTitle ?? defaultTitle}
                key="google:name"
            />
            <meta
                itemProp="description"
                content={metaDesc ?? defaultDesc}
                key="google:description"
            />
            <meta
                itemProp="image"
                content={metaImg ?? defaultImg}
                key="google:image"
            />

            {/* Discord/Facebook Meta Tags */}
            <meta
                property="og:url"
                content="https://automute.us"
                key="og:url"
            />
            <meta property="og:type" content="website" key="og:type" />
            <meta
                property="og:title"
                content={metaTitle ?? defaultTitle}
                key="og:title"
            />
            <meta
                property="og:description"
                content={metaDesc ?? defaultDesc}
                key="og:description"
            />
            <meta
                property="og:image"
                content={metaImg ?? defaultImg}
                key="og:image"
            />

            {/* Twitter Meta Tags */}
            <meta name="twitter:title" content={metaTitle ?? defaultTitle} />
            <meta
                name="twitter:description"
                content={metaDesc ?? defaultDesc}
            />
            <meta name="twitter:image" content={metaImg ?? defaultImg} />
        </>
    );
};

export default Metadata;
