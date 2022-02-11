function hashtags() {
  let hashtagsPossibilities = [
    "#NFT",
    "#NFTCommunity",
    "#NFTCommunity",
    "@LooksRareNFT",
    "$LOOKS",
    "#LooksRare",
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
