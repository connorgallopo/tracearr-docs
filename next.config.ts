import nextra from "nextra";

const withNextra = nextra({
  // Nextra options
});

export default withNextra({
  // Next.js options
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/getting-started/installation/portainer",
        destination: "/getting-started/installation/docker-ui",
        permanent: true,
      },
      {
        source: "/debug",
        destination: "/configuration/debug",
        permanent: true,
      },
      {
        source: "/rules",
        destination: "/configuration/automations",
        permanent: true,
      },
      {
        source: "/configuration/rules",
        destination: "/configuration/automations",
        permanent: true,
      },
      {
        source: "/update",
        destination: "/upgrading",
        permanent: true,
      },
      {
        source: "/analytics",
        destination: "/",
        permanent: true,
      },
      {
        source: "/performance",
        destination: "/",
        permanent: true,
      },
    ];
  },
});
