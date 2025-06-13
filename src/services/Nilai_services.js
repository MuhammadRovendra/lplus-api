const model = require('../model/Nilai')
const modeluser = require('../model/users')
const materi = require('../model/materi')
const modelKategori = require('../model/kategori')
const modelMateri = require('../model/materi')
const modelNilai = require('../model/Nilai')
const { v4, validate: isUuid } = require("uuid");
const { requestResponse, upload } = require('../utils/index')
let { response } = require('express')

const create = async (data) => {
    const checkUser = await modeluser.findOne({ IDUSER: data.IDUSER }, { _id: false }, { lean: true })
    console.log(checkUser)
    if (!checkUser) {
        response = { ...requestResponse.unprocessable_entity }
        response.message = 'User tidak terdaftar'
        return response
    }

    const checkBundleUser = await modelNilai.findOne(data)
    console.log(checkBundleUser)

    if (checkBundleUser) {
        response = { ...requestResponse.unprocessable_entity, data: checkBundleUser }
        return response
    }

    const dataKategori = await modelKategori.findOne({ IDKATEGORI: data.IDKATEGORI }, { _id: false }, { lean: true })
    const dataMateri = await modelMateri.find({ KATEGORI: data.IDKATEGORI }, { _id: false }, { lean: true })

    // console.log(dataKategori)
    // console.log(dataMateri)

    const materiDalamKategori = dataMateri
        .filter((materi) => materi.KATEGORI === dataKategori.IDKATEGORI)
        .map((materi) => ({
            IDMATERI: materi.IDMATERI,
            STATUS: 0,
            LIKE: false,
        }));

    const progress = {
        LEVEL: dataKategori.KATEGORI,
        MATERI: materiDalamKategori
    };

    const dataProgressBelajar = {
        IDNILAI: v4(),
        IDUSER: data.IDUSER,
        IDKATEGORI: data.IDKATEGORI,
        RATING: 0,
        NILAI: 0,
        LEVEL: progress.LEVEL,
        MATERI: progress.MATERI
    }

    // console.log(dataProgressBelajar)
    const hasil = await modelNilai.create(dataProgressBelajar)

    const getKategoriStudent = await modelKategori.findOne({ IDKATEGORI: data.IDKATEGORI })

    await modelKategori.updateOne({ IDKATEGORI: data.IDKATEGORI }, {
        $set: {
            STUDENTS: getKategoriStudent.STUDENTS + 1
        }
    })

    return { ...requestResponse.success, data: hasil }
}

const getAllByUser = async (condition) => {
    // const dataNilai = await model.findById(condition)
    console.log(condition)
    const data = await model.aggregate([
        { $match: condition },
        { $sort: { CREATED_AT: -1 } },
        { $unwind: "$MATERI" },
        {
            $lookup: {
                from: "materis",
                localField: "MATERI.IDMATERI",
                foreignField: "IDMATERI",
                as: "DETAIL"
            }
        },
        { $unwind: { path: "$DETAIL", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "categories", // Pastikan ini nama collection yang benar
                localField: "IDKATEGORI",
                foreignField: "IDKATEGORI",
                as: "DETAIL_KATEGORI"
            }
        },
        { $unwind: { path: "$DETAIL_KATEGORI", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$_id",
                IDNILAI: { $first: "$IDNILAI" },
                IDUSER: { $first: "$IDUSER" },
                IDKATEGORI: { $first: "$IDKATEGORI" },
                LEVEL: { $first: "$LEVEL" },
                NILAI: { $first: "$NILAI" },
                DETAIL_KATEGORI: { $first: "$DETAIL_KATEGORI" },
                MATERI: {
                    $push: {
                        IDMATERI: "$MATERI.IDMATERI",
                        STATUS: "$MATERI.STATUS",
                        LIKE: "$MATERI.LIKE",
                        DETAIL: "$DETAIL"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                IDNILAI: 1,
                IDUSER: 1,
                IDKATEGORI: 1,
                LEVEL: 1,
                NILAI: 1,
                MATERI: 1,
                DETAIL_KATEGORI: 1
            }
        }
    ]);

    console.log(data)
    return data;
};

const getAllByUserAndKategori = async (condition) => {
    // const dataNilai = await model.findById(condition)
    console.log('nilai')
    const data = await model.aggregate([
        { $match: condition },
        { $unwind: "$MATERI" },
        {
            $lookup: {
                from: "materis",
                localField: "MATERI.IDMATERI",
                foreignField: "IDMATERI",
                as: "DETAIL"
            }
        },
        { $unwind: { path: "$DETAIL", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$_id",
                IDNILAI: { $first: "$IDNILAI" },
                IDUSER: { $first: "$IDUSER" },
                IDKATEGORI: { $first: "$IDKATEGORI" },
                LEVEL: { $first: "$LEVEL" },
                NILAI: { $first: "$NILAI" },
                RATING: { $first: "$RATING" },
                MATERI: {
                    $push: {
                        IDMATERI: "$MATERI.IDMATERI",
                        STATUS: "$MATERI.STATUS",
                        LIKE: "$MATERI.LIKE",
                        DETAIL: "$DETAIL"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                IDNILAI: 1,
                IDUSER: 1,
                IDKATEGORI: 1,
                LEVEL: 1,
                NILAI: 1,
                MATERI: 1,
                RATING: 1
            }
        }
    ]);

    // console.log(data)
    return data;
};

const getAll = async (condition) => {
    // const dataNilai = await model.findById(condition)
    console.log('nilai')
    const data = await model.aggregate([
        { $match: condition },
        { $unwind: "$MATERI" },
        {
            $lookup: {
                from: "materis",
                localField: "MATERI.IDMATERI",
                foreignField: "IDMATERI",
                as: "DETAIL"
            }
        },
        { $unwind: { path: "$DETAIL", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: "$_id",
                IDNILAI: { $first: "$IDNILAI" },
                IDUSER: { $first: "$IDUSER" },
                IDKATEGORI: { $first: "$IDKATEGORI" },
                LEVEL: { $first: "$LEVEL" },
                NILAI: { $first: "$NILAI" },
                MATERI: {
                    $push: {
                        IDMATERI: "$MATERI.IDMATERI",
                        STATUS: "$MATERI.STATUS",
                        LIKE: "$MATERI.LIKE",
                        DETAIL: "$DETAIL"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                IDNILAI: 1,
                IDUSER: 1,
                IDKATEGORI: 1,
                LEVEL: 1,
                NILAI: 1,
                MATERI: 1
            }
        }
    ]);

    // console.log(data)
    return data;
};

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
    // Ambil data berdasarkan IDUSER dan IDKATEGORI
    const getDataNilai = await model.findOne(condition, { _id: false }, { lean: true });
    console.log(getDataNilai);

    if (!getDataNilai) {
        const response = { ...requestResponse.unauthorized };
        response.message = 'Data tidak ditemukan';
        return response;
    }

    // Cek apakah materi ditemukan dan ubah statusnya jadi 1
    let materiUpdated = false;
    const updatedMateri = getDataNilai.MATERI.map((materi) => {
        if (materi.IDMATERI === data.IDMateri) {
            materiUpdated = true;
            return { ...materi, STATUS: 1 };
        }
        return materi;
    });

    if (!materiUpdated) {
        console.log('Materi tidak ditemukan!');
        return;
    }

    // Hitung progress nilai
    const totalMateri = updatedMateri.length;
    const completedMateri = updatedMateri.filter((materi) => materi.STATUS === 1).length;
    const nilaiBaru = (completedMateri / totalMateri) * 100;

    // Lakukan update ke database
    const updateResult = await model.updateOne(
        condition,
        {
            $set: {
                MATERI: updatedMateri,
                NILAI: nilaiBaru,
                UPDATED_AT: new Date()
            }
        }
    );

    if (updateResult.modifiedCount > 0) {
        console.log("Status dan nilai berhasil diperbarui");
    } else {
        console.log("Tidak ada perubahan data");
    }
};

const likeOrNoLike = async (condition, data) => {
    try {
        // Ambil data nilai user
        const getDataNilai = await model.findOne(condition, { _id: false }, { lean: true });
        if (!getDataNilai) {
            console.log("Data nilai tidak ditemukan");
            return;
        }

        // Update LIKE pada materi
        const updatedMateri = getDataNilai.MATERI.map((materi) => {
            if (materi.IDMATERI === data.IDMateri) {
                return { ...materi, LIKE: !data.LIKE };
            }
            return materi;
        });

        // Update dokumen nilai user
        await model.updateOne(condition, {
            $set: {
                MATERI: updatedMateri,
                UPDATED_AT: new Date()
            }
        });

        // Update jumlah LIKE di koleksi materi
        const findMateri = await materi.findOne({ IDMATERI: data.IDMateri });
        if (!findMateri) {
            console.log("Materi tidak ditemukan");
            return;
        }

        const jumlahLike = data.LIKE
            ? Math.max(0, findMateri.JUMLAH_LIKE - 1) // unlike
            : findMateri.JUMLAH_LIKE + 1;             // like

        await materi.updateOne({ IDMATERI: data.IDMateri }, {
            $set: { JUMLAH_LIKE: jumlahLike }
        });

        console.log("Like status berhasil diperbarui");

    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
};

const updateUserRatingAndBundleAverage = async (IDUSER, data) => {
    const parsedRating = parseFloat(data.RATING);

    if (!parsedRating || parsedRating < 0 || parsedRating > 5) {
        throw new Error("INVALID_RATING");
    }

    // 1. Update rating user
    const nilai = await modelNilai.findOneAndUpdate(
        { IDKATEGORI: data.IDKATEGORI, IDUSER: IDUSER },
        { RATING: parsedRating, UPDATED_AT: new Date() },
        { new: true }
    );

    if (!nilai) {
        throw new Error("NILAI_NOT_FOUND");
    }

    // 2. Hitung ulang rata-rata rating
    const allRatings = await modelNilai.find({ IDKATEGORI: data.IDKATEGORI, RATING: { $gt: 0 } });
    const totalRating = allRatings.reduce((sum, item) => sum + (item.RATING || 0), 0);
    const count = allRatings.length;
    const averageRating = count > 0 ? totalRating / count : 0;

    // 3. Update Bundle
    const bundle = await modelKategori.findOneAndUpdate(
        { IDKATEGORI: data.IDKATEGORI },
        {
            RATING: parseFloat(averageRating.toFixed(2)),
            UPDATED_AT: new Date()
        },
        { new: true }
    );

    if (!bundle) {
        throw new Error("BUNDLE_NOT_FOUND");
    }

    return {
        ratingUser: parsedRating,
        ratingBundle: bundle.RATING
    };
};


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
    getAllByUser,
    getAllByUserAndKategori,
    updateUserRatingAndBundleAverage,
    likeOrNoLike,
    getAll,
    updateOne,
    getByIdUser,
    deleteOne,
    getCount
}