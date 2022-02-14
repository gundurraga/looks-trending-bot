function hashtags() {
  let hashtagsPossibilities = [
    "#NFT",
    "#NFTs",
    "#NFTCommunity",
    "#NFTCommunity",
    "@LooksRareNFT",
    "$LOOKS",
    "#LooksRare",
    "#LooksRareTrends",
    "#NFTart",
    "#NFTartist",
  ];
  let firstHashtag =
    hashtagsPossibilities[
      Math.floor(Math.random() * hashtagsPossibilities.length)
    ];
  let secondHashtag =
    hashtagsPossibilities[
      Math.floor(Math.random() * hashtagsPossibilities.length)
    ];

  while (firstHashtag === secondHashtag) {
    secondHashtag =
      hashtagsPossibilities[
        Math.floor(Math.random() * hashtagsPossibilities.length)
      ];
  }

  let hashtags = `${firstHashtag} ${secondHashtag}`;
  return hashtags;
}

module.exports.hashtags = hashtags;
