exports.getAll = async function (db) {
    return db.collection("socialPerformances").find().toArray();
};

exports.getBySid = async function (db, sid) {
    const s = String(sid);
    const n = Number(sid);

    return db.collection("socialPerformances").find({
        $or: [{ sid: n }, { sid: s }]
    }).toArray();
};


exports.add = async function (db, record) {
    return (await db.collection("socialPerformances").insertOne(record)).insertedId;
};

exports.update = async function (db, sid, category, data) {
    return db.collection("socialPerformances").findOneAndUpdate(
        { sid: sid, category: category },
        { $set: data },
        { returnDocument: "after" }
    );
};

exports.remove = async function (db, sid, category) {
    return db.collection("socialPerformances").findOneAndDelete({ sid: sid, category: category });
};
