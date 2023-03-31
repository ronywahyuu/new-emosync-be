const Class = require('../models/class');

const get = async ({ role, createdBy }) => {
    if (role.includes('superadmin')) {
        return await Class.find({}).sort({ createdAt: 'desc' })
    }
    return await Class.find({ createdBy: createdBy }).sort({ createdAt: 'desc' })
};

const create = async ({ body, createdBy }) => {
    const data = new Class({ ...body, createdBy })
    return await data.save()
}

const update = async ({ id, body }) => {
    return await Class.findOneAndUpdate({ meetCode: id }, body, {upsert: true, new: true})
}

module.exports = {
    get,
    create,
    update,
}