function hashtags() {
  let hashtagsPossibilities = [
    "#NFT",
    "#NFTCommunity",
    "@LooksRareNFT",
    "#Trending",
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
    console.log(firstHashtag, secondHashtag);
    secondHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
  }

  let hashtags = `${firstHashtag} ${secondHashtag}`;
  return hashtags;
}

module.exports.hashtags = hashtags;
