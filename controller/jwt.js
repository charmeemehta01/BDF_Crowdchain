const jwt = require('jsonwebtoken');

module.exports = {
    
    create: function ( req, res, next ) {
        const token = jwt.sign({
                uid: req.body.uid,
                email: req.body.email,
            },
            'CrowdChainSecretKey', {
                expiresIn: '2h',
            }
        );
        res.json({ status: "success", jwt_token: token });
    },

    authenticate: function ( req, res, next ) {
        const token = req.body.jwt_token;
        let decode_token;
        try {
            decode_token = jwt.verify( token, 'CrowdChainSecretKey' );
        }
        catch( err) {
            res.json({ status:"error" , error: err });
        }
        if (!decode_token) {
            res.json({ status: "error", error : "Invalid" });
        }
        res.json({ status: "success" });
    }
}