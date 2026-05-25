

const posts = []

const images = [
    'images/apple.png',
    'images/appleplaque.png',
    'images/blacklocustbeans.png',
    'images/blacklocustbeansplaque.png',
    'images/blackwalnut.png',
    'images/blackwalnutplaque.png',
    'images/burningbushred.png',
    'images/bushhoneysuckle.png',
    'images/bushhoneysuckleplaque.png',
    'images/commonhazelplaque.png',
    'images/commonhazel.png',
    'images/deermodeling.png',
    'images/deerrunning.gif',
    'images/firstpond.png',
    'images/floweringdogwood.png',
    'images/floweringdogwoodplaque.png',
    'images/frog.png',
    'images/frogpond.png',
    'images/englishyew.png',
    'images/englishyewplaque.png',
    'images/lacebarkpine.png',
    'images/lacebarkpineplaque.png',
    'images/lindenleaf.png',
    'images/maidenhairfern.png',
    'images/maidenhairplaque.png',
    'images/poisonivy.png',
    'images/rabbitjumping.gif',
    'images/squirrel.png',
    'images/swampwhiteoak.png',
    'images/treeofheaven.png',
    'images/weepingbeach.png',
    'images/weepingbeachplaque.png',
    'images/wineberry.png',
    'images/wsnakeroot.png'
]
let imageIndex = 0;

for(let i = 1; i <= 34; i++){
    let item = {
        id: i,
        title: `Post ${i}`,
        date: `${i < 10 ? 0 : ''}${i}/10/2021 `,
        image: images[imageIndex]
    }
    posts.push(item);
    imageIndex++;
    if (imageIndex > images.length - 1) imageIndex = 0;
}

console.log(posts)
