const model = require('../model/Nilai')
const materi = require('../model/materi')
const { requestResponse, upload } = require('../utils/index')

const create = async (data) => {
    const Upload = await model.create(data)
    return { ...requestResponse.success, data: Upload }
}

const getAll = async (condition) => {
    // const data = await model.findOne({ IDUSER: condition.IDUSER })
    const data = await model.aggregate([
        { $match: { IDUSER: condition.IDUSER } },
        { $unwind: "$PROGRES" },
        { $unwind: "$PROGRES.MATERI" },
        {
            $lookup: {
                from: "materis",
                localField: "PROGRES.MATERI.IDMATERI",
                foreignField: "IDMATERI",
                as: "DETAILS"
            }
        },
        {
            $unwind: {
                path: "$DETAILS",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    id: "$_id",
                    level: "$PROGRES.LEVEL"
                },
                IDNILAI: { $first: "$IDNILAI" },
                IDUSER: { $first: "$IDUSER" },
                NILAI: { $first: "$NILAI" },
                MATERI: {
                    $push: {
                        IDMATERI: "$PROGRES.MATERI.IDMATERI",
                        STATUS: "$PROGRES.MATERI.STATUS",
                        LIKE: "$PROGRES.MATERI.LIKE",
                        DETAILS: "$DETAILS"
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id.id",
                IDNILAI: { $first: "$IDNILAI" },
                IDUSER: { $first: "$IDUSER" },
                NILAI: { $first: "$NILAI" },
                PROGRES: {
                    $push: {
                        LEVEL: "$_id.level",
                        MATERI: "$MATERI"
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                IDNILAI: 1,
                IDUSER: 1,
                NILAI: 1,
                PROGRES: 1
            }
        }
    ])
    // console.log(data)
    return data
}

// const getAll = async (condition) => {
//     return await model.aggregate([
//         // Filter data berdasarkan IDUSER
//         { $match: { IDUSER: condition.IDUSER } },

//         // Unwind PROGRES
//         { $unwind: { path: "$PROGRES", preserveNullAndEmptyArrays: true } },
//         { $unwind: { path: "$PROGRES.MATERI", preserveNullAndEmptyArrays: true } },

//         // Lookup ke koleksi materi untuk mengambil DETAILS
//         {
//             $lookup: {
//                 from: "materis",
//                 localField: "PROGRES.MATERI.IDMATERI",
//                 foreignField: "IDMATERI",
//                 as: "MATERI_DETAILS",
//             },
//         },

//         // Menambahkan DETAIL materi ke dalam setiap item MATERI
//         {
//             $addFields: {
//                 "PROGRES.MATERI.DETAILS": { $arrayElemAt: ["$MATERI_DETAILS", 0] },
//             },
//         },

//         // Lookup ke koleksi nilai untuk mendapatkan IDNILAI, NILAI, dll.
//         {
//             $lookup: {
//                 from: "nilai", // Koleksi nilai
//                 localField: "IDUSER", // Field referensi
//                 foreignField: "IDUSER",
//                 as: "USER_NILAI",
//             },
//         },

//         // Menambahkan field IDNILAI, NILAI, CREATED_AT, UPDATED_AT
//         {
//             $addFields: {
//                 IDNILAI: { $arrayElemAt: ["$USER_NILAI.IDNILAI", 0] },
//                 NILAI: { $arrayElemAt: ["$USER_NILAI.NILAI", 0] },
//                 CREATED_AT: { $arrayElemAt: ["$USER_NILAI.CREATED_AT", 0] },
//                 UPDATED_AT: { $arrayElemAt: ["$USER_NILAI.UPDATED_AT", 0] },
//             },
//         },

//         // Group ulang data berdasarkan LEVEL dan IDUSER
//         {
//             $group: {
//                 _id: { IDUSER: "$IDUSER", LEVEL: "$PROGRES.LEVEL" },
//                 MATERI: {
//                     $push: {
//                         IDMATERI: "$PROGRES.MATERI.IDMATERI",
//                         STATUS: "$PROGRES.MATERI.STATUS",
//                         LIKE: "$PROGRES.MATERI.LIKE",
//                         DETAILS: "$PROGRES.MATERI.DETAILS",
//                     },
//                 },
//             },
//         },

//         // Group ulang untuk menggabungkan semua LEVEL ke dalam PROGRES
//         {
//             $group: {
//                 _id: "$_id.IDUSER",
//                 PROGRES: {
//                     $push: {
//                         LEVEL: "$_id.LEVEL",
//                         MATERI: "$MATERI",
//                     },
//                 },
//                 IDNILAI: { $first: "$IDNILAI" },
//                 NILAI: { $first: "$NILAI" },
//                 CREATED_AT: { $first: "$CREATED_AT" },
//                 UPDATED_AT: { $first: "$UPDATED_AT" },
//             },
//         },

//         // Proyeksikan hasil akhir
//         {
//             $project: {
//                 _id: 0, // Hilangkan _id jika tidak diperlukan
//                 IDUSER: "$_id",
//                 IDNILAI: 1,
//                 NILAI: 1,
//                 CREATED_AT: 1,
//                 UPDATED_AT: 1,
//                 PROGRES: 1,
//             },
//         },
//     ]);
// };

const updateNilai = async (condition, data) => {
    const getDataNilai = await model.findOne(condition, { _id: false }, { lean: true })
    console.log(getDataNilai)
    if (getDataNilai === null) {
        response = { ...requestResponse.unauthorized }
        response.message = 'Data tidak ditemukan'
        return response
    }

    let materiUpdated = false;
    getDataNilai.PROGRES.forEach((progress) => {
        progress.MATERI.forEach((materi) => {
            if (materi.IDMATERI === data.IDMateri) {
                materi.STATUS = 1; // Ubah status menjadi 1
                materiUpdated = true;
            }
        });
    });

    if (!materiUpdated) {
        console.log('Materi tidak ditemukan!');
        return;
    }

    const totalMateri = getDataNilai.PROGRES.reduce((count, progress) => count + progress.MATERI.length, 0);

    const completedMateri = getDataNilai.PROGRES.reduce(
        (count, progress) => count + progress.MATERI.filter((materi) => materi.STATUS === 1).length,
        0
    );
    const nilaiBaru = (completedMateri / totalMateri) * 100;

    const updateNilai = await model.updateOne({
        IDUSER: condition.IDUSER
    }, {
        $set: {
            NILAI: nilaiBaru
        }
    })

    if (updateNilai.modifiedCount > 0) {
        console.log("nilai berhasil diperbarui");
    } else {
        console.log("Data nilai tidak ditemukan atau tidak ada perubahan");
    }

    const updateData = await model.updateOne(
        {
            IDUSER: condition.IDUSER,
            "PROGRES.MATERI.IDMATERI": data.IDMateri
        },
        {
            $set: {
                "PROGRES.$.MATERI.$[elem].STATUS": 1
            }
        },
        {
            arrayFilters: [{ "elem.IDMATERI": data.IDMateri }]
        }
    )
    console.log(updateData)

    if (updateData.modifiedCount > 0) {
        console.log("Status berhasil diperbarui");
    } else {
        console.log("Data tidak ditemukan atau tidak ada perubahan");
    }
}

const likeOrNoLike = async (condition, data) => {
    let updateLike
    if (data.LIKE === true) {
        updateLike = await model.updateOne({
            IDUSER: condition.IDUSER,
            "PROGRES.MATERI.IDMATERI": data.IDMateri
        }, {
            $set: {
                "PROGRES.$.MATERI.$[elem].LIKE": false
            }
        }, {
            arrayFilters: [{ "elem.IDMATERI": data.IDMateri }]
        })

        const findMateri = await materi.findOne({ IDMATERI: data.IDMateri })
        const jumlahLike = findMateri.JUMLAH_LIKE - 1

        updateMateri = await materi.updateOne({
            IDMATERI: data.IDMateri
        }, {
            $set: {
                "JUMLAH_LIKE": jumlahLike
            }
        })
    } else {
        updateLike = await model.updateOne({
            IDUSER: condition.IDUSER,
            "PROGRES.MATERI.IDMATERI": data.IDMateri
        }, {
            $set: {
                "PROGRES.$.MATERI.$[elem].LIKE": true
            }
        }, {
            arrayFilters: [{ "elem.IDMATERI": data.IDMateri }]
        })
        const findMateri = await materi.findOne({ IDMATERI: data.IDMateri })
        const jumlahLike = findMateri.JUMLAH_LIKE + 1

        updateMateri = await materi.updateOne({
            IDMATERI: data.IDMateri
        }, {
            $set: {
                "JUMLAH_LIKE": jumlahLike
            }
        })
    }

    if (updateLike.modifiedCount > 0) {
        response = { ...requestResponse.success }
        response.message = 'Data Berhasil diperbarui'
        return response
    } else {
        response = { ...requestResponse.not_found }
        response.message = 'Data tidak ditemukan'
        return response
    }
}

const getByIdUser = async (condition) => {
    return model.findOne(condition)
}

const updateOne = async (condition, body) => {
    return model.updateOne(condition, body)
}

const deleteOne = (condition) => {
    return model.deleteOne(condition)
}

const getCount = (condition) => {
    return model.countDocuments(condition)
}

module.exports = {
    create,
    updateNilai,
    likeOrNoLike,
    getAll,
    updateOne,
    getByIdUser,
    deleteOne,
    getCount
}