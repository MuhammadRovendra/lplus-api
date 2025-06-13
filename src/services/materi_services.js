const model = require('../model/materi')
const { requestResponse, upload } = require('../utils/index')

const create = async (data) => {
    const Upload = await model.create(data)
    return { ...requestResponse.success, data: Upload }
}

const getAll = async () => {
    return await model.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'KATEGORI',
                foreignField: 'IDKATEGORI',
                as: 'CATEGORY_DATA'
            },
        },
        {
            $unwind: {
                path: '$CATEGORY_DATA',
            }
        }
    ])
}

const getAllByCategory = async ({ KATEGORI }) => {

    const data = await model.aggregate([
        {
            $match: {
                KATEGORI: KATEGORI  // Match berdasarkan category
            }
        },
        { $sort: { CREATED_AT: -1 } },
        {
            $lookup: {
                from: 'categories',
                localField: 'KATEGORI',
                foreignField: 'IDKATEGORI',
                as: 'CATEGORY_DATA'
            }
        },
        {
            $unwind: {
                path: '$CATEGORY_DATA',
            }
        },
    ]);

    return { data }
}

const getByStatus = async ({ status, page }) => {
    console.log(page)
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(6);
    const skip = (pageNumber - 1) * limitNumber;

    const totalCount = await model.countDocuments({ STATUS: status })
    const data = await model.aggregate([
        { $match: { STATUS: status } },
        { $sort: { CREATED_AT: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
        {
            $lookup: {
                from: 'categories',
                localField: 'CATEGORY',
                foreignField: 'IDCATEGORY',
                as: 'CATEGORY_DATA'
            }
        },
        {
            $unwind: {
                path: '$CATEGORY_DATA',
            }
        },
    ]);

    return { totalCount, data }
};

const getById = async (condition) => {
    return model.findOne(condition)
}

const updateOne = async (condition, body) => {
    return model.updateOne(condition, body)
}

const updateStatus = async (condition) => {
    const news = await model.findOne(condition)
    if (news.STATUS === "Publish") {
        return model.updateOne(condition, {
            $set: {
                STATUS: "Pending"
            }
        })
    } else {
        return model.updateOne(condition, {
            $set: {
                STATUS: "Publish"
            }
        })
    }
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
    getAllByCategory,
    getByStatus,
    updateOne,
    updateStatus,
    getById,
    deleteOne,
    getCount
}