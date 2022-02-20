interface Props {
  metaImg?: string;
}

const Metadata = ({ metaImg }: Props): React.ReactElement => {
  return (
    <>
      <meta
        name="description"
        content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
      />
      <meta name="theme-color" content="#7289DA" />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content="AutoMuteUs" key="google:name" />
      <meta
        itemProp="description"
        content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
        key="google:description"
      />
      <meta
        itemProp="image"
        content={metaImg ?? `https://automute.us/public/images/logo_embed.png`}
        key="google:image"
      />

      {/* Discord/Facebook Meta Tags */}
      <meta property="og:url" content="https://automute.us" key="og:url" />
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:title" content="AutoMuteUs" key="og:title" />
      <meta
        property="og:description"
        content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
        key="og:description"
      />
      <meta
        property="og:image"
        content={metaImg ?? `https://automute.us/public/images/logo_embed.png`}
        key="og:image"
      />

      {/* Twitter Meta Tags */}
      <meta name="twitter:title" content="AutoMuteUs" />
      <meta
        name="twitter:description"
        content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
      />
      <meta
        name="twitter:image"
        content={metaImg ?? `https://automute.us/public/images/logo_embed.png`}
      />
    </>
  );
};

export default Metadata;
