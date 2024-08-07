const Class = require('../models/class')
const Meeting = require('../models/meeting')

const get = async ({ role, createdBy, searchQuery }) => {
    // if (role.includes('superadmin')) {
    //     return await Class.find({}).sort({ createdAt: 'desc' })
    // }
    // return await Class.find({ createdBy: createdBy }).sort({ createdAt: 'desc' })
    if(typeof searchQuery !== 'string') searchQuery = ''
    if(role.includes('superadmin') || role.includes('admin') || role.includes('teacher')){
        return await Class.aggregate([
            {
                $match: {
                    createdBy: createdBy,
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            }
        ]).sort({ createdAt: 'desc' })
    }

   return await Class.find({ createdBy: createdBy }).sort({ createdAt: 'desc' })
};

// get by user id
// const getByUserId = async ({ createdBy, userId }) => {
//     return await Class.find({ createdBy: createdBy, userId: userId }).sort({ createdAt: 'desc' })

// }

const create = async ({ body, createdBy }) => {
    const data = new Class({ ...body, createdBy })
    return await data.save()
}
const getByMeetCode = async ({ createdBy, meetCode }) => {
    return await Class.find({ createdBy: createdBy, meetCode: meetCode }).sort({ createdAt: 'desc' })
};

const update = async ({ id, body }) => {
    return await Class.findOneAndUpdate({ meetCode: id }, body, {upsert: true, new: true})
}

const remove = async ({ id }) => {
  const data = await Class.findOne({ meetCode: id })
  if (!data) return
  await Meeting.deleteMany({ meetCode: id });
  return await data.remove()
}

module.exports = {
    get,
    getByMeetCode,
    create,
    update,
    remove,
}