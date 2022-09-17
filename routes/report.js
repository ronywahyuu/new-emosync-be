const router = require('express').Router();
const labels = require('../utils/labels');
const Recognition = require('../models/recognition');

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
    const recognitionParsed = [
      recognition
        .map(({ neutral }) => neutral)
        .reduce((prev, next) => prev + next, 0),
      recognition
        .map(({ happy }) => happy)
        .reduce((prev, next) => prev + next, 0),
      recognition.map(({ sad }) => sad).reduce((prev, next) => prev + next, 0),
      recognition
        .map(({ angry }) => angry)
        .reduce((prev, next) => prev + next, 0),
      recognition
        .map(({ fearful }) => fearful)
        .reduce((prev, next) => prev + next, 0),
      recognition
        .map(({ disgusted }) => disgusted)
        .reduce((prev, next) => prev + next, 0),
      recognition
        .map(({ surprised }) => surprised)
        .reduce((prev, next) => prev + next, 0),
    ];
    const summary = recognitionParsed.map((item) =>
      Math.round(
        (item / recognitionParsed.reduce((prev, next) => prev + next, 0)) * 100
      )
    );
    return res.status(200).send({ data: { labels, summary } });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
