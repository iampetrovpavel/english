const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");
const { UnAuthorizedError } = ApiService.Errors;
const jwt = require("jsonwebtoken");
var cookieSession = require('cookie-session')

const broker = new ServiceBroker({
    nodeID: "node-api",
    transporter: "nats://english-nats:4222",
});

broker.createService({
    name: "api",
    mixins: [ApiService],
    settings: {
        port: process.env.PORT || 3000,
        use: [
            cookieSession({
                name: 'session',
                keys: [process.env.COOKIE_KEY],
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: false,
                path: '/',
            })
        ],
        routes: [{
			path: "/api",
			authorization: true,
            onAfterCall(ctx, route, req, res, data) {
                if (ctx.meta.cookies) {
                    req.session = ctx.meta.cookies;
                }
                return data;
            }
		}],
    },
    methods: {
        async authorize (ctx, route, req, res) {
            let user;

            if( req.session.token ) {
                user = await this.resolveToken( req.session.token )
                if(user) {
                    ctx.meta.user = user;
                }
            }

            if (req.$action.auth == "required" && !user){
				throw new UnAuthorizedError();
            }
            if (req.$action.admin == "required" && (!user || !user.groups || !user.groups.includes('admin'))){
                throw new UnAuthorizedError();
            }
        },
        async resolveToken(token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_KEY);
                return payload; 
            } catch(e) {
                return null;
            }
        },
    }
});

broker.start();