

const posts = []

const images = [
    'images/bonetobankwr.gif',
    'images/CalciumCoinPlain.png',
    'images/coineating.gif',
    'images/coininbank.gif',
    'images/cowsgrazing.gif',
    'images/dairy food darkened.png',
    'images/dairytocoin.gif',
    'images/parkkidswr.gif',
    'images/skellysintro.gif',
    'images/junkfood.png',
    'images/fridge2.png',
    'images/pointingskelly.png'
]
let imageIndex = 0;

for(let i = 1; i <= 12; i++){
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
