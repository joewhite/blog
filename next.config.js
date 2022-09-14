const {withContentlayer} = require('next-contentlayer');

module.exports = withContentlayer({
  async redirects() {
    return [
      {
        // Oh my. Let's update this for a post-#MeToo consciousness.
        source: '/2004/09/11/hotel-philosophy-101-through-499-loot-pillage-and-rape',
        destination: '/2004/09/11/hotel-philosophy-101-through-499-loot-pillage-and-burn',
        permanent: true,
      },
    ];
  },
});
