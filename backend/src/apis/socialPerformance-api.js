const service = require("../services/socialPerformance-service");
const SocialPerformance = require("../models/SocialPerformance");

exports.getAll = async (req, res) => {
    const db = req.app.get("db");
    res.send(await service.getAll(db));
};

exports.getBySid = async (req, res) => {
    const db = req.app.get("db");
    const sid = parseInt(req.params.sid);

    const result = await service.getBySid(db, sid);
    if (result.length === 0)
        return res.status(404).send({message: `No records found for ${sid}`});

    res.send(result);
};

exports.add = async (req, res) => {
    const db = req.app.get("db");

    const record = new SocialPerformance(
        req.body.sid,
        req.body.category,
        req.body.score,
        req.body.year
    );

    await service.add(db, record);
    res.status(201).send(record);
};

exports.update = async (req, res) => {
    const db = req.app.get("db");
    const sid = parseInt(req.params.sid);
    const category = req.params.category;

    const result = await service.update(db, sid, category, req.body);


    res.send(result.value);
};

exports.remove = async (req, res) => {
    const db = req.app.get("db");
    const sid = parseInt(req.params.sid);
    const category = req.params.category;

    const result = await service.remove(db, sid, category);


    res.send(result.value);
};
