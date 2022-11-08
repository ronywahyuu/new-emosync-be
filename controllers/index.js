const get = async (_, res) => {
  return res.status(200).send({ message: 'server running well' })
}

module.exports = { get }
