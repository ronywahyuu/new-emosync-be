
const facialInterventionGif = require('../services/facialInterventionGif');
const getListFacialInterventionGifGiphy = async (req, res, next) => {
  try {
    const data = await facialInterventionGif.getListGiphy();

    return res.status(200).json({
      message: 'Facial Intervention Gif List',
      data,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getSingleRandomFacialInterventionGif = async (req, res, next) => {
  try {
    const { gender, filter, category } = req.query;
    const data = await facialInterventionGif.getSingleRandomFacialInterventionGif({category, filter, gender});

   
    return res.status(200).send(data);


   
  } catch (error) {
    console.log(error)
    next(error)
  }

}

const getSingleDefaultFacialInterventionGif = async (req, res, next) => {
  try {
    const data = await facialInterventionGif.getSingleDefaultFacialInterventionGif();

    return res.status(200).json({
      message: 'Facial Intervention Gif',
      data,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getSingleByTypeOfEmotion = async (req, res, next) => {
  try {
    const { emotion, gender } = req.query;
    if (!emotion) {
      return res.status(400).json({
        message: 'Facial Intervention Gif not found',
        data: [],
      })
    }
    const data = await facialInterventionGif.getSingleByTypeOfEmotion(emotion, gender);

    if (!data) {
      return res.status(404).json({
        message: 'Facial Intervention Gif not found',
        data: [],
      })
    }

    return res.status(200).json({
      message: 'Facial Intervention Gif',
      data,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// const getRandomFacialInterventionGif = async (req, res, next) => {

module.exports = {
  getListFacialInterventionGifGiphy,
  getSingleRandomFacialInterventionGif,
  getSingleDefaultFacialInterventionGif,
  getSingleByTypeOfEmotion
}
