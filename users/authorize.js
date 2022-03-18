const E = require("moleculer-web").Errors;
const jwt = require("jsonwebtoken"); 

module.exports = function(ctx, route, req, res) {
    let auth = req.headers["authorization"];
    if (auth && auth.startsWith("Bearer")) {
        let token = auth.slice(7);
        try{
            const payload = jwt.verify(token, process.env.JWT_KEY);
            ctx.meta.user = payload;
            return Promise.resolve(ctx);
        }
        catch(e){
            return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }
    } else {
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
    }
}