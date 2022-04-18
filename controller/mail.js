const nodemailer = require('nodemailer');
const path = require('path')

module.exports = {

    signup: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Signup successful', 
            html: 'Congratulations, you have successfully signed up for Crowdchain. <br>Please wait for an account verification status mail before signing in to CrowdChain. Your secret key is ' + req.body.secret_key + '. <br>Please save this key as it will be used for resetting your password.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    },

    /* change_pass: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Password changed successfully', 
            html: 'Your password has been reset successfully. Please use the new password to sign in to your CrowdChain account.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    }, */

    update_details: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Profile details updated', 
            html: 'Your profile details have been updated successfully. Please wait for an account verification status mail before signing in to CrowdChain again.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    },

    accept_status: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Account status update', 
            html: 'Your application for CrowdChain is accepted. You can now login to CrowdChain and click on proceed to main website.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    },

    reject_status: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Account status update', 
            html: 'Your application for CrowdChain is rejected. Reason for rejection: ' + req.body.reason + '. Please login to your CrowdChain account and make appropriate changes to the profile.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    },

    donator: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Donation successful', 
            html: 'Congratulations, you have successfully donated ' + req.body.amount + ' ETH to ' + req.body.camp_title + ' campaign. <br>Thank you for using CrowdChain.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    },

    creator: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Donation to ' + req.body.camp_title + ' campaign', 
            html: 'You received ' + req.body.donation_amt + ' ETH for your ' + req.body.camp_title + ' campaign. The total amount raised towards the campaign is ' + req.body.a_raised + ' ETH.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    },

    camp_create: function (req, res, cb) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'crowdchain.info@gmail.com',
                pass: 'Crowd@chain9867'
            }
        });
        const mailOptions = {
            from: 'crowdchain.info@gmail.com', 
            to: req.body.email, 
            subject: 'Campaign created successfully', 
            html: 'Congrats, you have successfully created ' + req.body.camp_title + ' campaign.'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                res.json({status:"error", message: "mail error", data:null});
                console.log(err);
            }
            else
                console.log(info);
                res.json({status:"success", message: "mail sent successfully!!!", data:null})
        });
    }
}