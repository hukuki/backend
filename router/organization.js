const express = require("express");
const Organization = require("../model/organization");
const auth = require("../middleware/auth");
const sudo = require("../middleware/sudo");
const verifyId = require("../middleware/verifyId");

const router = express.Router();

router.post("/", auth, sudo, async (req, res) => {
    const { name, address, domain } = req.body;

    try {
        const organization = new Organization({ name, address, domain });

        await organization.save();
        res.send(organization);
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong.");
    }
});

router.get("/", auth, sudo, async (req, res) => {
    const organizations = await Organization.find();

    res.send(organizations);
});

router.get('/:id', auth, sudo, verifyId, async (req, res) => {
    const organization = await Organization.findById(req.params.id);

    res.send(organization);
});