const model = require('../model/kategori')
const { requestResponse, upload } = require('../utils/index')

const create = async (data) => {
    const Upload = await model.create(data)
    return { ...requestResponse.success, data: Upload }
}

const getAll = async (attributes) => {
    // return await model.find({}, attributes, { _id: false }, { lean: false },)
    return await model.aggregate([
        // { $match: { IDUSER: condition.IDUSER } },
        {
            $lookup: {
                from: "materis",
                localField: "IDKATEGORI",
                foreignField: "KATEGORI",
                as: "MATERI"
            }
        },
        // {
        //     // $unwind: {
        //     //     path: "$MATERI",
        //     //     preserveNullAndEmptyArrays: true
        //     // }
        // }
    ])
    // console.log(data)
}

const getById = async (condition) => {
    const data = await model.aggregate([
        { $match: condition },
        {
            $lookup: {
                from: "materis",
                localField: "IDKATEGORI",
                foreignField: "KATEGORI",
                as: "MATERI"
            }
        },
        // {
        //     // $unwind: {
        //     //     path: "$MATERI",
        //     //     preserveNullAndEmptyArrays: true
        //     // }
        // }
    ])

    return data
}

const updateOne = async (condition, body) => {
    return model.updateOne(condition, body)
}

const updateOneStatus = async (condition, body) => {
    const cekID = await model.findOne(condition)
    if (cekID.STATUS === 1) {
        return await model.updateOne(condition, {
            $set: {
                STATUS: 0
            }
        })
    }
    return await model.updateOne(condition, {
        $set: {
            STATUS: 1
        }
    })
}

const deleteOne = (condition) => {
    return model.deleteOne(condition)
}

const getCount = (condition) => {
    return model.countDocuments(condition)
}

module.exports = {
    create,
    getAll,
    updateOne,
    updateOneStatus,
    getById,
    deleteOne,
    getCount
}