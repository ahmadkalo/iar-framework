exports.getAll = async function (db) {
    return db.collection("salesmen").find().toArray();
};

exports.getById = async function (db, id) {
    return db.collection("salesmen").findOne({ id: id });
};

exports.add = async function (db, salesman) {
    const result = await db.collection("salesmen").insertOne(salesman);
    return await db.collection("salesmen").findOne({ _id: result.insertedId });
};


exports.update = async function (db, id, data) {
    return db.collection("salesmen").findOneAndUpdate(
        { id: id },
        { $set: data },
        { returnOriginal: false }

    );
};



exports.remove = async function (db, id) {
    return db.collection("salesmen").findOneAndDelete({ id: id });
};
