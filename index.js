const { Alchemy, Network } = require("alchemy-sdk")
const fs = require("fs")

const BORED_APES_CONTRACT = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"


const getBoredApeCollectionFromAlchemy = async () => {

    const alchemyClient = new Alchemy({apiKey :"Nn53cqXw3wDcW5_bWPBcnaaAf7r09s_x" , network : Network.ETH_MAINNET})

    const iterable =  alchemyClient.nft.getNftsForContractIterator(BORED_APES_CONTRACT)

    let nfts = []

    for await (const ite of iterable){
        console.log(`TokenId: ${ite.tokenId}`);
        nfts.push(ite)
    }
    return nfts
}

const getMultipleOf100 = (arr) => {
    const cleanArr = []

    arr.forEach(element => {
        if(Number(element.tokenId) % 100 === 0){
            cleanArr.push({tokenId : element.tokenId, attributes : element.rawMetadata.attributes})
        }
    });

    return cleanArr
}

const computeRarity = (traitType, tokens) => {
    let calc = {}
for (const token of tokens){
    for(const att of token.attributes){
        if (att.trait_type === traitType){
calc[att.value] = calc[att.value] ? calc[att.value] + 1 : 1
        }
    }
}
return calc
}

const computeTokensScore = (mul) => {

    const computed = []

    const computedEyes = computeRarity("Eyes", mul)
    const computedHat = computeRarity("Hat", mul)
    const computedMouth = computeRarity("Mouth", mul)
    const computedClothes = computeRarity("Clothes", mul)
    const computedBackground = computeRarity("Background", mul)
    const computedEarring = computeRarity("Earring", mul)
    const computedFur = computeRarity("Fur", mul)

    for (const token of mul){
        token.rarity = 0
        for(const att of token.attributes){
            switch (att.trait_type){
                case "Eyes": 
                    // token[att.trait_type] = computedEyes[att.value];
                    token.rarity = token.rarity + computedEyes[att.value];
                    break;
                case "Hat": 
                    // token[att.trait_type] = computedHat[att.value];
                    token.rarity = token.rarity + computedHat[att.value];
                    break;
                case "Mouth": 
                    // token[att.trait_type] = computedMouth[att.value];
                    token.rarity = token.rarity + computedMouth[att.value];
                    break;
                case "Clothes": 
                    // token[att.trait_type] = computedClothes[att.value];
                    token.rarity = token.rarity + computedClothes[att.value];
                    break;
                case "Background": 
                    // token[att.trait_type] = computedBackground[att.value];
                    token.rarity = token.rarity + computedBackground[att.value];
                    break;
                case "Earring": 
                    // token[att.trait_type] = computedEarring[att.value];
                    token.rarity = token.rarity + computedEarring[att.value];
                    break;
                case "Fur": 
                    // token[att.trait_type] = computedFur[att.value];
                    token.rarity = token.rarity + computedFur[att.value];
                    break;
                default: 
                    console.log("error")
            }
        }

        
        
        computed.push(token)
    }
    return computed
}



const main = async () => {
    // const boredApesCollection = await getBoredApeCollectionFromAlchemy()
    // const multipleClean = getMultipleOf100(boredApesCollection)
    // fs.writeFileSync("./Tokens", JSON.stringify(multipleClean))

    const Tokens = require("./Tokens.json")

    const computedTokens = computeTokensScore(Tokens)

    const sortedTokens = computedTokens.sort(
        (firstItem, secondItem) =>{
            let sorting = secondItem.rarity - firstItem.rarity
            if (sorting === 0){
                sorting = Number(secondItem.tokenId) - Number(firstItem.tokenId)
            }
         return sorting
      })

    console.log(sortedTokens)
}


main()