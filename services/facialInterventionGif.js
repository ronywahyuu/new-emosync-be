
const fs = require('fs')

const getListGiphy = async (search) => {
  const data = [
    {
      id: 1,
      name: 'Facial Intervention Gif 1',
      url: 'https://media.giphy.com/media/3o7TKzj7g8zvQFfjQY/giphy.gif',
    },
    {
      id: 2,
      name: 'Facial Intervention Gif 2',
      url: 'https://media.giphy.com/media/3o7TKzj7g8zvQFfjQY/giphy.gif',
    },
    {
      id: 3,
      name: 'Facial Intervention Gif 3',
      url: 'https://media.giphy.com/media/3o7TKzj7g8zvQFfjQY/giphy.gif',
    },
    {
      id: 4,
      name: 'Facial Intervention Gif 4',
      url: 'https://media.giphy.com/media/3o7TKzj7g8zvQFfjQY/giphy.gif',
    },
    {
      id: 5,
      name: 'Facial Intervention Gif 5',
      url: 'https://media.giphy.com/media/3o7TKzj7g8zvQFfjQY/giphy.gif',
    },
  ]

  return data
}

const getSingleRandomFacialInterventionGif = async ({filter, category, gender}) => {
  console.log(`Called with gender: ${gender}`); // Add this line

  if(gender === "male") {
    const maleAgentPath = 'public/pedagogic-agent/P'

    let randomGif;
    try {
      randomGif = fs.readdirSync(maleAgentPath)
    } catch (error) {
      console.error(`Failed to read directory at ${maleAgentPath}: ${error}`)
      return;
    }

    const randomIndex = Math.floor(Math.random() * randomGif.length)
    const selectedGif = `public/pedagogic-agent/L/${randomGif[randomIndex]}`
    const emotionNameState = randomGif[randomIndex].split('.')[0]
    let base64Image;
    try {
      base64Image = fs.readFileSync(selectedGif, { encoding: 'base64' })
    } catch (error) {
      console.error(`Failed to read file at ${selectedGif}: ${error}`)
      return;
    }

    const url = `data:image/gif;base64,${base64Image}`
    return url

  }

  if(gender === "female") {
    const femaleAgentPath = 'public/pedagogic-agent/P'

    let randomGif;
    try {
      randomGif = fs.readdirSync(femaleAgentPath)
    } catch (error) {
      console.error(`Failed to read directory at ${femaleAgentPath}: ${error}`)
      return;
    }

    const randomIndex = Math.floor(Math.random() * randomGif.length)
    const selectedGif = `public/pedagogic-agent/P/${randomGif[randomIndex]}`
    const emotionNameState = randomGif[randomIndex].split('.')[0]
    let base64Image;
    try {
      base64Image = fs.readFileSync(selectedGif, { encoding: 'base64' })
    } catch (error) {
      console.error(`Failed to read file at ${selectedGif}: ${error}`)
      return;
    }


    // return {
    //   name: 'Facial Intervention Gif 1',
    //   selectedGif,
    //   emotionNameState,
    //   url: `data:image/gif;base64,${base64Image}`,
    // }
    const url = `data:image/gif;base64,${base64Image}`
    return url
  

  }


  
}

const getSingleDefaultFacialInterventionGif = async (gender) => {
  const localPath = 'public/pedagogic-agent/P/Anger2Neutral.gif'
  const base64Image = fs.readFileSync(localPath, { encoding: 'base64' })
  const selectedFileName = localPath.split('/').pop()
  console.log(`Selected file name: ${selectedFileName}`)
  return {
    // name: 'Neutral Agent Gif',
    selectedFileName,

    url: `data:image/gif;base64,${base64Image}`,
  }
}

const getSingleByTypeOfEmotion = async (emotion = "Anger2Neutral", gender = 'female') => {
  const selectedGender = gender === 'male' ? 'L' : 'P'

  const localPath = `public/pedagogic-agent/${selectedGender}/${emotion}.gif`
  const base64Image = fs.readFileSync(localPath, { encoding: 'base64' })
  const selectedFileName = localPath.split('/').pop()
  console.log(`Selected file name: ${selectedFileName}`)
  return {
    // name: 'Neutral Agent Gif',
    selectedFileName,

    url: `data:image/gif;base64,${base64Image}`,
  }
}  

module.exports = {
  getListGiphy,
  getSingleRandomFacialInterventionGif,
  getSingleDefaultFacialInterventionGif,
  getSingleByTypeOfEmotion
}
