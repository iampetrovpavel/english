const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");
const { UnAuthorizedError } = ApiService.Errors;
const jwt = require("jsonwebtoken");
const Cookies = require("cookies");
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')

const broker = new ServiceBroker({
    nodeID: "node-api",
    transporter: "nats://nats:4222",
});

broker.createService({
    name: "api",
    mixins: [ApiService],
    settings: {
        port: process.env.PORT || 3000,
        use: [
            // cookieParser(),
            cookieSession({
                name: 'session',
                keys: ['key1', 'key2'],
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            })
        ],
        routes: [{
			path: "/api",
			authorization: true,
            onBeforeCall(ctx, route, req, res) {
                console.log("COOKIES API ", req.session)
                // req.session = null

                // let cookies = new Cookies(req, res);
                // this.logger.warn("COOKIES ", cookies.get("token"))
                // ctx.meta.cookies2 = cookies.get("token");
            },
    
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
            let auth = req.headers["authorization"];
            this.logger.warn("COOKIES2", req.session)
            if (auth && auth.startsWith("Bearer")) {
                let token = auth.slice(7);
                user = await this.resolveToken(token)
                if(user) {
                    ctx.meta.user = user;
                }
            }
            if (req.$action.auth == "required" && !user){
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