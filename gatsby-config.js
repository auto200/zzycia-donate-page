module.exports = {
  pathPrefix: "/wsparcie",
  siteMetadata: {
    title: `Wesprzyj Sebka`,
    description: `Tutaj możesz wesprzeć Sebka, autora kanału z życia na youtube`,
    author: `Sebek`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: "@chakra-ui/gatsby-plugin",
      options: {},
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Wesprzyj Sebka 🧔`,
        short_name: `🧔`,
        start_url: `/`,
        background_color: `#1A202C`,
        theme_color: `#1A202C`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
