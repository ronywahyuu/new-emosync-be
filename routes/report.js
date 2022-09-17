const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const Recognition = require('../models/recognition');

router.post('/', async (req, res) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(req.body.image);
    const recognition = new Recognition({ ...req.body, image: secure_url });
    await recognition.save();
    return res.status(200).send({ data: recognition });
  } catch (err) {
    console.log(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const { name, meetingId } = req.query;
    const recognition = await Recognition.find({
      ...(name && { name }),
      ...(meetingId && { meetingId }),
    }).exec();
    if (!recognition.length) {
      return res.status(404).send({ message: 'Data not found!' });
    }
    const recognitionParsed = {
      labels: recognition.map(({ createdAt }) =>
        new Date(createdAt).toLocaleTimeString()
      ),
      neutral: recognition.map(({ neutral }) => neutral),
      happy: recognition.map(({ happy }) => happy),
      sad: recognition.map(({ sad }) => sad),
      angry: recognition.map(({ angry }) => angry),
      fearful: recognition.map(({ fearful }) => fearful),
      disgusted: recognition.map(({ disgusted }) => disgusted),
      surprised: recognition.map(({ surprised }) => surprised),
      image: recognition.map(({ image }) => image),
    };
    // const labels = recognition.map(({ createdAt }) =>
    //   new Date(createdAt).toLocaleTimeString()
    // );
    // const neutral = recognition.map(({ neutral }) => neutral);
    // const happy = recognition.map(({ happy }) => happy);
    // const sad = recognition.map(({ sad }) => sad);
    // const angry = recognition.map(({ angry }) => angry);
    // const fearful = recognition.map(({ fearful }) => fearful);
    // const disgusted = recognition.map(({ disgusted }) => disgusted);
    // const surprised = recognition.map(({ surprised }) => surprised);
    // const image = recognition.map(({ image }) => image);
    // const test = {
    //   labels,
    //   neutral,
    //   happy,
    //   sad,
    //   angry,
    //   fearful,
    //   disgusted,
    //   surprised,
    //   image,
    // };
    // return res.status(200).send({ data: recognition });
    return res.status(200).send({ data: recognitionParsed });
  } catch (err) {
    console.log(err);
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { name, meetingId } = req.query;
    const recognition = await Recognition.find({
      ...(name && { name }),
      ...(meetingId && { meetingId }),
    }).exec();
    if (!recognition.length) {
      return res.status(404).send({ message: 'Data not found!' });
    }
    const neutral = recognition
      .map(({ neutral }) => neutral)
      .reduce((prev, next) => prev + next, 0);
    const happy = recognition
      .map(({ happy }) => happy)
      .reduce((prev, next) => prev + next, 0);
    const sad = recognition
      .map(({ sad }) => sad)
      .reduce((prev, next) => prev + next, 0);
    const angry = recognition
      .map(({ angry }) => angry)
      .reduce((prev, next) => prev + next, 0);
    const fearful = recognition
      .map(({ fearful }) => fearful)
      .reduce((prev, next) => prev + next, 0);
    const disgusted = recognition
      .map(({ disgusted }) => disgusted)
      .reduce((prev, next) => prev + next, 0);
    const surprised = recognition
      .map(({ surprised }) => surprised)
      .reduce((prev, next) => prev + next, 0);
    const sum = Object.values({
      neutral,
      happy,
      sad,
      angry,
      fearful,
      disgusted,
      surprised,
    }).reduce((prev, next) => prev + next, 0);
    // console.log({
    //   neutral,
    //   happy,
    //   sad,
    //   angry,
    //   fearful,
    //   disgusted,
    //   surprised,
    // });
    const labels = [
      'Neutral',
      'Happy',
      'Sad',
      'Angry',
      'Fearful',
      'Disgusted',
      'Surprised',
    ];
    const test = {
      neutral: Number((neutral / sum).toFixed(2)) * 100,
      happy: Number((happy / sum).toFixed(2)) * 100,
      sad: Number((sad / sum).toFixed(2)) * 100,
      angry: Number((angry / sum).toFixed(2)) * 100,
      fearful: Number((fearful / sum).toFixed(2)) * 100,
      disgusted: Number((disgusted / sum).toFixed(2)) * 100,
      surprised: Number((surprised / sum).toFixed(2)) * 100,
    };
    const test3 = Object.assign(
      ...Object.entries(test).map((item) => ({
        [item[0]]: Number(item[1].toFixed(2)),
      }))
    );
    // return res.status(200).send({ data: recognition });
    return res.status(200).send(test3);
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recognition = await Recognition.findById(req.params.id);
    if (!recognition) {
      return res.status(404).send({ message: 'Recognition not found!' });
    }
    return res.status(200).send({ data: recognition });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const recognition = await Recognition.findById(req.params.id);
    const public_id = recognition.image.substring(
      recognition.image.indexOf('.jpg') - 20,
      recognition.image.indexOf('.jpg')
    );
    await cloudinary.uploader.destroy(public_id);
    await recognition.remove();
    return res.json(recognition);
  } catch (err) {
    console.log(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const recognition = await Recognition.findById(req.params.id);
    const public_id = recognition.image.substring(
      recognition.image.indexOf('.jpg') - 20,
      recognition.image.indexOf('.jpg')
    );
    await cloudinary.uploader.destroy(public_id);
    const result = await cloudinary.uploader.upload(req.body.image);
    const data = {
      name: req.body.name || recognition.name,
      image: result.secure_url || recognition.image,
    };
    const recognitionUpdated = await Recognition.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
      }
    );
    return res.json(recognitionUpdated);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
