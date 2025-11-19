const salesmenService = require("../services/salesmen-service");
const Salesman = require("../models/Salesman");

exports.getAll = async function (req, res) {
    const db = req.app.get("db");
    res.send(await salesmenService.getAll(db));
};

exports.getById = async function (req, res) {
    const db = req.app.get("db");
    const id = parseInt(req.params.id);

    const found = await salesmenService.getById(db, id);
    if (!found) return res.status(404).send({ message: "Salesman not found" });

    res.send(found);
};

exports.add = async function (req, res) {
    const db = req.app.get("db");

    const salesman = new Salesman(
        req.body.id,
        req.body.firstname,
        req.body.lastname
    );

    await salesmenService.add(db, salesman);

    res.status(201).send(salesman);
};


exports.update = async function (req, res) {

    const db = req.app.get("db");
    const id = parseInt(req.params.id);

    const result = await salesmenService.update(db, id, req.body);


    res.send(result.value);
};


exports.remove = async function (req, res) {
    const db = req.app.get("db");
    const id = parseInt(req.params.id);

    const removed = await salesmenService.remove(db, id);


    res.send(removed.value);
};
