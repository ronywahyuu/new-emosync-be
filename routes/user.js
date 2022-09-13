const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    // Upload image to cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path);
    const result = await cloudinary.uploader.upload(req.body.image);
    // Create new user
    let user = new User({ ...req.body.data, image: result.secure_url });
    // save user details in mongodb
    await user.save();
    res.status(200).send({ data: user });
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({
        message: 'User not found!',
      });
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Delete user from db
    await user.remove();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Upload new image to cloudinary
    const result = await cloudinary.uploader.upload(req.body.image);
    const data = {
      name: req.body.name || user.name,
      profile_img: result.secure_url || user.profile_img,
      cloudinary_id: result.public_id || user.cloudinary_id,
    };
    const userUpdated = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(userUpdated);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
