const express = require("express");
const router = express.Router();

const User = require("../models/user");
const UserProfile = require("../models/userprofile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const helmet     = require('helmet');
const { body, param, validationResult } = require('express-validator');


router.post("/register", async (req, res) => {
    const {email, password} = req.body;

    try {

        let user = await User.findOne({email});
        if ( user ) {
            return res.status(400).json({msg: "USer already exists"} );
        }

        const hashedpassword = await bcrypt.hash( password, 10 );
        user = new User ({
            email,
            password: hashedpassword,
            lastClick: new Date()
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            {expiresIn : "24h"}
        )

        return res.status(201).json({
            msg: "Registered Successfully",
            token
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message}); 
    }
});

router.post("/login", async (req, res) => {

    const {email,password} = req.body;
    try {

        let user = await User.findOne({email});
        if ( !user ) {
            return res.status(400).json({msg: "Entered Wrong Email"} );
        }

        let isMatch = await bcrypt.compare( password, user.password );
        if ( !isMatch) {
            return res.status(400).json({msg: "Entered Wrong Password"} );
        }

        const token = jwt.sign (
            { id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "24h" }
        );

        return res.status(201).json({
            msg: "Login successgully",
            token
        });

    } catch (err) {
        return res.status(500).json({msg: err.message} );
    }    
});

function middle(req, res, next ) {

    const header = req.header("Authorization");
    if ( !header ) {
        return res.status(401).json({msg: "Problem No Token found"} );
    }

    const token = header.split(" ")[1];
    try {

        const decode = jwt.verify( token, process.env.JWT_SECRET);
        req.user = decode;

        next();
    } catch (err) {
        return res.status(401).json({msg: "Invalid token"});
    }
}


router.patch( "/click", middle, async (req, res) => {

    const userId = req.user.id; 

    const time = new Date();

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: { lastClick: time, alertSent: false } },
        { new: true }
    );

    res.json({ time: user.lastClick });  
});

router.get("/profile", middle, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({
            userId: req.user.id
        }).lean();

        if (!profile) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        // Calculate age from DOB
        let age = null;
        if (profile.dateOfBirth) {
            const dob = new Date(profile.dateOfBirth);
            const diff = Date.now() - dob.getTime();
            age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        }

        // Format response for your frontend
        const response = {
            id: profile._id,
            name: profile.name,
            age,
            dateOfBirth: profile.dateOfBirth,
            gender: profile.gender,
            bloodGroup: profile.bloodGroup,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            nationality: profile.nationality,
            occupation: profile.occupation,
            role: profile.role,
            status: profile.status,
            memberSince: profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                  })
                : null,
            medicalInfo: profile.medicalInfo,
            emergencyContacts: profile.emergencyContacts
        };

        res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message });
    }
});

router.put("/edit-profile", middle, async (req, res) => {
    try {
        const update = req.body;

        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.user.id },
            { $set: update },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            success: true,
            data: profile
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;