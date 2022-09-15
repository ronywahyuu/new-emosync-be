const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(req.body.image);
    const user = new User({ ...req.body, image: secure_url });
    await user.save();
    return res.status(200).send({ data: user });
  } catch (err) {
    console.log(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const { name, meetingId } = req.query;
    const user = await User.find({
      ...(name && { name }),
      ...(meetingId && { meetingId }),
    }).exec();
    if (!user.length) {
      return res.status(404).send({ message: 'Data not found!' });
    }
    return res.status(200).send({ data: user });
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }
    return res.status(200).send({ data: user });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const public_id = user.image.substring(
      user.image.indexOf('.jpg') - 20,
      user.image.indexOf('.jpg')
    );
    await cloudinary.uploader.destroy(public_id);
    await user.remove();
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const public_id = user.image.substring(
      user.image.indexOf('.jpg') - 20,
      user.image.indexOf('.jpg')
    );
    await cloudinary.uploader.destroy(public_id);
    const result = await cloudinary.uploader.upload(req.body.image);
    const data = {
      name: req.body.name || user.name,
      image: result.secure_url || user.image,
    };
    const userUpdated = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    return res.json(userUpdated);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
